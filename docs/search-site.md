# The search site

## How it is built

`npm run build` reads the YAML files, validates them, derives level, stratum, path and child lists, and writes `dist/`:

| File | Purpose |
|---|---|
| `index.html`, `style.css`, `app.js` | the site, plain files without a front-end build step |
| `catalog.json` | the whole catalog with derived fields |
| `capabilities.csv` | the same as a table, UTF-8 with BOM so Excel opens it correctly |
| `vendor/minisearch.js` | search library (MIT) |
| `fonts/` | two fonts under the SIL OFL, served from the same origin |
| `opencap.html` | with `npm run build:standalone`, everything in one file |

The browser loads `catalog.json`, builds the search index in memory and does all searching locally. GitHub Pages only serves static files, so there is no server to run.

## What the search does

- Fields: name, synonyms, ID, path, tags, description, plus the same fields of every translation. Names and synonyms weigh most.
- Case, accents and umlauts are folded: "pruefung", "prüfung" and "Pruefung" are the same word.
- Prefix matching while typing, and typo tolerance for words longer than four letters.
- German compounds: word endings of translated names are indexed, so "verwaltung" finds "Kundenverwaltung".
- All words must match. If nothing matches all words, single-word matches are shown and the page says so.
- Deprecated capabilities are hidden unless switched on.

On the map, matches turn into filled tiles and their parents are outlined. Levels below the chosen depth stay collapsed unless a match lives there; the path to it opens automatically.

## Size and speed

Measured with a synthetic catalog of 2,040 capabilities (40 level 1, 400 level 2, 1,600 level 3): `catalog.json` is 969 KB (57 KB gzipped), the first render takes about 0.4 s, a search takes under 0.1 s. That leaves room for several thousand entries. If the catalog grows far beyond that:

1. Build the MiniSearch index at build time and ship it as JSON instead of indexing in the browser.
2. Load extension packs on demand instead of all at once.
3. Or switch to Pagefind, which indexes static pages and loads index chunks lazily. This only makes sense once there is one HTML page per capability.

## Privacy

The site loads nothing from other hosts and sets no cookies. It stores two optional preferences in the browser (`opencap.lang`, `opencap.theme`) and works without them.

## Links to GitHub

"View source file" and "Suggest a change" appear when the build knows the repository. In GitHub Actions it takes `GITHUB_REPOSITORY`. Locally set `repository` in `model/catalog.yaml`.
