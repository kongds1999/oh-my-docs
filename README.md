# oh-my-docs

Personal Mintlify documentation and blog site.

## What is here

This repository currently holds an archived snapshot of Model Context Protocol (MCP) documentation source (MDX, assets, and Mintlify config). It is the original content baseline for this personal docs site.

## Local preview

Use the Mintlify CLI (mint) for local development.
Commands for local preview:
    npm i -g mint
    mint dev

Open the URL Mintlify prints (typically http://localhost:3000).

## Configuration

Site structure, navigation, and theme are defined in docs.json.

## License

See LICENSE.


## GitHub Pages deploy

Pushes to `main` run [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml):

1. `mint export` to static HTML
2. Pagefind indexes the export (client-side search; Mintlify cloud search is unavailable on static GitHub Pages)
3. Publish to [`kongds1999/kongds1999.github.io`](https://github.com/kongds1999/kongds1999.github.io) at https://kongds1999.github.io/

Deploy uses an SSH write deploy key stored as the `PAGES_DEPLOY_KEY` Actions secret (no personal access token). You can also run the workflow manually via **Actions → Deploy Pages → Run workflow**.

On the live site, use the **Search** control (bottom-right), press `/` or `Ctrl/Cmd+K`, or click the header search bar to open Pagefind. The Mintlify “login to CLI to enable search” message may still appear in the native UI; Pagefind is the working search for this GitHub Pages setup.
