# Dr. Anca Paunica Psychiatry website

This repository contains the static website for Dr. Anca Paunica Psychiatry.

## Local preview

From this directory, start a local web server:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publishing

The website is deployed automatically through GitHub Pages whenever an approved update is pushed to the `main` branch. The deployment workflow is in `.github/workflows/deploy-pages.yml`.

Only the contents of this directory belong in the website repository. Research material, backups, reports, and the parent workspace are intentionally excluded.
