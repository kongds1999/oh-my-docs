// Custom footer copyright notice, aligned with "Powered by Mintlify"
(function() {
  var TEXT = 'Copyright \u00a9 2026 harry. All rights reserved. Personal site and documentation. Content is for learning and reference purposes only.';

  function addCopyright() {
    var footer = document.querySelector('footer');
    if (!footer || document.getElementById('harry-copyright')) return;

    var copyright = document.createElement('div');
    copyright.id = 'harry-copyright';
    copyright.textContent = TEXT;

    // Put the notice in the same row as the "Powered by Mintlify" link
    var powered = footer.querySelector('a[href*="mintlify.com"]');
    var row = powered && powered.parentElement;
    while (row && row !== footer && row.children.length < 2 && row.parentElement !== footer) {
      row = row.parentElement;
    }
    if (powered && row) {
      row.classList.add('harry-footer-row');
      row.insertBefore(copyright, row.firstChild);
    } else {
      footer.appendChild(copyright);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCopyright);
  } else {
    addCopyright();
  }

  // Handle SPA navigation
  new MutationObserver(addCopyright).observe(document.body, { childList: true, subtree: true });
})();
