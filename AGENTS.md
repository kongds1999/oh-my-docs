# Agent instructions - Mintlify docs

This is a Mintlify documentation project. Prefer Mintlify conventions over ad-hoc HTML or custom frameworks.

## Content

- Write docs as MDX (.mdx) with Mintlify components where helpful.
- Site config and navigation live in docs.json — update it when adding or moving pages.
- Ignore draft content under drafts/ and files matching *.draft.mdx (see .mintignore).

## Skills / tooling

Add Mintlify docs skills:
    npx skills add https://mintlify.com/docs

Use Mintlify docs skills when available for component usage, navigation, and theming.

## Style preferences

- Clear, concise prose; prefer short sections and concrete examples.
- Keep frontmatter and titles consistent with existing pages.
- Do not invent APIs or config keys — check docs.json and existing MDX first.
- Preserve LICENSE and avoid committing .DS_Store or local secrets.

## Local preview

Install the Mintlify CLI globally, then run mint dev.
