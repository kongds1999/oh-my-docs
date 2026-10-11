#!/usr/bin/env python3
"""
Generate raw .md files for static export so that 'Copy page' and 'View as Markdown'
work seamlessly on GitHub Pages.
"""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

def parse_frontmatter(content: str) -> tuple[dict[str, str], str]:
    if not content.startswith("---"):
        return {}, content
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    
    fm_raw = parts[1]
    body = parts[2].lstrip("\r\n")
    meta = {}
    for line in fm_raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            key, val = line.split(":", 1)
            meta[key.strip()] = val.strip().strip('"\'')
    return meta, body

def convert_mdx_to_md(content: str) -> str:
    meta, body = parse_frontmatter(content)
    title = meta.get("title", "").strip()
    description = meta.get("description", "").strip()
    
    header = ""
    if title:
        header += f"# {title}\n\n"
    if description:
        header += f"> {description}\n\n"
        
    return f"{header}{body}"

def main() -> int:
    if len(sys.argv) != 2:
        print("usage: export-markdown.py <site-dir>", file=sys.stderr)
        return 2
    site_dir = Path(sys.argv[1]).resolve()
    if not site_dir.is_dir():
        print(f"not a directory: {site_dir}", file=sys.stderr)
        return 1

    count = 0
    # Search for all .mdx in repo root (excluding site, .git, drafts, node_modules)
    for root, dirs, files in os.walk(REPO_ROOT):
        # Exclude directories
        dirs[:] = [d for d in dirs if not d.startswith(".") and d not in ("site", "drafts", "node_modules")]
        for file in files:
            if not file.endswith(".mdx") or file.endswith(".draft.mdx"):
                continue
            src_path = Path(root) / file
            rel_path = src_path.relative_to(REPO_ROOT)
            
            raw_content = src_path.read_text(encoding="utf-8", errors="replace")
            md_content = convert_mdx_to_md(raw_content)
            
            # Destination path replacing .mdx with .md
            dest_rel = rel_path.with_suffix(".md")
            dest_path = site_dir / dest_rel
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            dest_path.write_text(md_content, encoding="utf-8")
            count += 1
            
            # If it's an index.md (e.g. dir/index.md), also create dir.md
            # because Mintlify canonical URLs omit /index, leading to requests for dir.md
            if dest_rel.name == "index.md" and dest_rel.parent != Path("."):
                alias_path = site_dir / f"{dest_rel.parent}.md"
                alias_path.parent.mkdir(parents=True, exist_ok=True)
                alias_path.write_text(md_content, encoding="utf-8")
                count += 1

    print(f"Generated {count} .md files in {site_dir}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
