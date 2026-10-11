#!/usr/bin/env python3
"""
Mintlify exports a page named `<dir>/index` as `<dir>/index/index.html`, but the
navigation links to `/<dir>`. Publish the same page at `<dir>/index.html` so
both URLs work, and keep the duplicate out of the search index.
"""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path


def main(site: Path) -> int:
    fixed = []
    for src in sorted(site.rglob("index/index.html")):
        target = src.parent.parent / "index.html"
        if target.exists():
            continue
        shutil.copyfile(src, target)
        # The original /<dir>/index/ copy should not appear twice in search.
        html = src.read_text(encoding="utf-8")
        if "data-pagefind-ignore" not in html:
            html = re.sub(r"<body\b", '<body data-pagefind-ignore="all"', html, count=1)
            src.write_text(html, encoding="utf-8")
        fixed.append(str(target.relative_to(site).parent))
    for route in fixed:
        print(f"index route: /{route}")
    print(f"Fixed {len(fixed)} index routes")
    return 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1] if len(sys.argv) > 1 else "site")))
