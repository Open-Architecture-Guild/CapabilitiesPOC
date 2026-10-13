// Build one self-contained HTML file (dist/opencap.html): works offline and from file://.
// Run after "npm run build".
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib.mjs';

const DIST = join(ROOT, 'dist');
if (!existsSync(join(DIST, 'catalog.json'))) {
  console.error('dist/ is missing. Run "npm run build" first.');
  process.exit(1);
}
const read = (p) => readFileSync(join(DIST, p), 'utf8');
const b64 = (p) => readFileSync(join(DIST, p)).toString('base64');

let css = read('style.css')
  .replace('url("fonts/atkinson-latin-wght.woff2")', `url(data:font/woff2;base64,${b64('fonts/atkinson-latin-wght.woff2')})`)
  .replace('url("fonts/newsreader-latin-wght.woff2")', `url(data:font/woff2;base64,${b64('fonts/newsreader-latin-wght.woff2')})`);

// "</script>" inside JSON or code would end the script block early.
const safe = (s) => s.replace(/<\/(script)/gi, '<\\/$1');
let html = read('index.html')
  .replace('<link rel="stylesheet" href="style.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script src="vendor/minisearch.js"></script>', () => `<script>\n${safe(read('vendor/minisearch.js'))}\n</script>`)
  .replace('<script src="app.js"></script>', () => `<script>window.__OPENCAP_DATA__ = ${safe(read('catalog.json'))};</script>\n<script>\n${safe(read('app.js'))}\n</script>`);

writeFileSync(join(DIST, 'opencap.html'), html);
console.log(`Wrote dist/opencap.html (${Math.round(html.length / 1024)} KB)`);
