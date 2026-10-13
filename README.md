# OpenCap

An open, community-driven capability map for architects. The catalog lives in this repository as plain YAML files and is published as a searchable website on GitHub Pages.

Status: prototype. The entries in `model/core/` are demo content (see `NOTICE.md`).

## What you get

- A map view with strata (strategic, core, supporting) and levels, and a list view
- Search over name, description, synonyms and ID, in English and German, with typo tolerance
- Permalinks to every capability (`#CAP-0021`) and shareable searches (`?q=onboarding`)
- CSV and JSON downloads, and a single-file offline version
- No third-party requests: no CDN, no web fonts from other hosts, no tracking

## Run it locally

```
npm ci
npm run dev          # validate, build, serve on http://localhost:4173
npm test             # tests for the validation rules
npm run validate     # check the catalog only
npm run build:standalone   # also writes dist/opencap.html, one file that works offline
```

Node 20 or newer.

## Add or change a capability

1. Edit or add a file in `model/core/` (one file per level 1 capability, with its subtree).
2. Run `npm run validate`. Errors stop the build, warnings are for the reviewer.
3. Open a pull request. The workflow validates and builds the site and annotates problems on the changed lines.

A capability says what the enterprise must be able to do, not how, why or where. Name it with a business object and an activity, and describe it as "The ability to ...". The field reference is in `model/schema/capability.schema.json`.

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. In the repository, open Settings, then Pages, and set the source to "GitHub Actions".
3. Push to `main`. The `Site` workflow builds and deploys. Repository links on the site are filled in automatically.

## Layout

```
model/schema/    JSON Schema for one capability
model/core/      the catalog (YAML)
model/catalog.yaml   name, version, demo flag
site/            the website (HTML, CSS, JS, no build step for the front end)
tools/           validation, site build, local server
docs/            how the site works
.github/         workflow and issue form
```

## License

MIT, see `LICENSE`. Third-party components and trademarks are listed in `NOTICE.md`.
