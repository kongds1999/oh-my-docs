/**
 * Pagefind search for Mintlify static export on GitHub Pages.
 * Mintlify cloud search does not work after `mint export`; this provides
 * working client-side search via Pagefind (overlay + keyboard + Mint bar hijack).
 */
(function () {
  var OVERLAY_ID = "pagefind-overlay";
  var ROOT_ID = "pagefind-search";

  function isEditable(el) {
    if (!el || el === document.body) return false;
    var tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (el.isContentEditable) return true;
    return false;
  }

  function ensureDom() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = OVERLAY_ID;
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML =
        '<div class="pagefind-overlay-panel" role="dialog" aria-modal="true" aria-label="Search documentation">' +
        '<div id="' +
        ROOT_ID +
        '"></div></div>';
      document.body.appendChild(overlay);
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close();
      });
    }
    return overlay;
  }

  function open() {
    var overlay = ensureDom();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    var input = overlay.querySelector(".pagefind-ui__search-input, input[type='text'], input:not([type])");
    if (input) {
      setTimeout(function () {
        input.focus();
      }, 10);
    }
  }

  function close() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function initUi() {
    if (window.__pagefindNavInit) return;
    if (typeof PagefindUI === "undefined") return;
    ensureDom();
    try {
      new PagefindUI({
        element: "#" + ROOT_ID,
        showImages: false,
        showSubResults: true,
        resetStyles: false,
      });
      window.__pagefindNavInit = true;
    } catch (err) {
      console.warn("[pagefind-nav] failed to init PagefindUI", err);
      return;
    }

    document.addEventListener(
      "click",
      function (e) {
        var t = e.target && e.target.closest
          ? e.target.closest(
              '#search-bar-entry, #search-bar-entry-mobile, [aria-label="Open search"], button.group\\/search'
            )
          : null;
        if (!t) return;
        e.preventDefault();
        e.stopPropagation();
        open();
      },
      true
    );

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (isEditable(e.target)) return;
      if (e.key === "/" || ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        open();
      }
    });
  }

  function boot() {
    ensureDom();
    if (typeof PagefindUI !== "undefined") {
      initUi();
      return;
    }
    // Wait briefly for pagefind-ui.js if script order is odd
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (typeof PagefindUI !== "undefined") {
        clearInterval(timer);
        initUi();
      } else if (tries > 50) {
        clearInterval(timer);
        console.warn("[pagefind-nav] PagefindUI not available");
      }
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
