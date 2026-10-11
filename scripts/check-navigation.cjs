const assert = require('node:assert/strict');
const fs = require('node:fs');
const config = JSON.parse(fs.readFileSync('docs.json', 'utf8'));
const errors = [];
const exists = (route) => {
  const path = route.replace(/^\//, '').split(/[?#]/)[0];
  return fs.existsSync(`${path}.mdx`) || fs.existsSync(`${path}/index.mdx`);
};
function walk(value) {
  if (!value || typeof value !== 'object') return;
  if ('versions' in value) errors.push('Version selector remains in navigation');
  if (Array.isArray(value.pages)) {
    for (const page of value.pages) {
      if (typeof page === 'string' && !exists(page)) errors.push(`Missing page: ${page}`);
    }
  }
  Object.values(value).forEach(walk);
}
walk(config.navigation);
for (const tab of ['Documentation', 'Specification']) {
  assert(config.navigation.tabs.some((entry) => entry.tab === tab), `Missing tab: ${tab}`);
}
for (const redirect of config.redirects || []) {
  if (redirect.source === redirect.destination) errors.push(`Self redirect: ${redirect.source}`);
  if (redirect.destination.startsWith('/') && !redirect.destination.includes(':') && !exists(redirect.destination)) {
    errors.push(`Missing redirect target: ${redirect.destination}`);
  }
}
assert.equal(errors.length, 0, errors.join('\n'));
console.log('Navigation pages exist, no version selectors, redirect targets valid.');
