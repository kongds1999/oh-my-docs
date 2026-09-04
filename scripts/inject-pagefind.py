#!/usr/bin/env python3
"""Inject Pagefind CSS/JS tags into all HTML files under a site directory."""
from __future__ import annotations

import sys
from pathlib import Path

SNIPPET = """
<!-- pagefind: github pages search -->
<link rel="stylesheet" href="/pagefind/pagefind-ui.css">
<link rel="stylesheet" href="/pagefind-nav.css">
<script src="/pagefind/pagefind-ui.js" defer></script>
<script src="/pagefind-nav.js" defer></script>
"""

MARKER = "<!-- pagefind: github pages search -->"


def inject_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="surrogateescape")
    if MARKER in text:
        return False
    lower = text.lower()
    idx = lower.rfind("</head>")
    if idx != -1:
        new = text[:idx] + SNIPPET + text[idx:]
        path.write_text(new, encoding="utf-8", errors="surrogateescape")
        return True
    idx = lower.rfind("</body>")
    if idx != -1:
        new = text[:idx] + SNIPPET + text[idx:]
        path.write_text(new, encoding="utf-8", errors="surrogateescape")
        return True
    path.write_text(text + SNIPPET, encoding="utf-8", errors="surrogateescape")
    return True


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: inject-pagefind.py <site-dir>", file=sys.stderr)
        return 2
    root = Path(sys.argv[1])
    if not root.is_dir():
        print(f"not a directory: {root}", file=sys.stderr)
        return 1
    changed = 0
    for path in root.rglob("*.html"):
        if inject_file(path):
            changed += 1
    print(f"injected pagefind into {changed} html files under {root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
