/* OpenCap site: search, map and list views over catalog.json. No third-party requests. */
(() => {
  'use strict';

  /* ---------------------------------------------------------------- strings */
  const STR = {
    de: {
      skip: 'Zu den Ergebnissen',
      tagline: 'Capability Map für Architekten',
      langLegend: 'Sprache',
      demoTitle: 'Demo-Daten.',
      demoText: 'Diese Einträge zeigen nur, wie die Suche arbeitet, und sind noch nicht fachlich geprüft.',
      searchLabel: 'Capabilities durchsuchen',
      placeholder: 'Suchen, z. B. Onboarding, KYC oder Zahlungsverkehr',
      clear: 'Suche leeren',
      viewLegend: 'Ansicht',
      viewMap: 'Karte',
      viewList: 'Liste',
      depthLegend: 'Ebenen bis',
      levelLegend: 'Ebene',
      stratumLegend: 'Schicht',
      all: 'Alle',
      strategic: 'Strategisch',
      core: 'Kern',
      supporting: 'Unterstützend',
      showDeprecated: 'Veraltete anzeigen',
      resultsTitle: 'Capabilities',
      loading: 'Lade Capabilities …',
      themeDark: 'Dunkles Design',
      themeLight: 'Helles Design',
      statusAll: (n) => `${n} Capabilities`,
      statusHits: (n, q) => `${n} ${n === 1 ? 'Treffer' : 'Treffer'} für „${q}“`,
      statusLoose: 'Kein Eintrag enthält alle Wörter. Gezeigt werden Einträge mit einzelnen Wörtern.',
      statusNone: (q) => `Keine Treffer für „${q}“`,
      emptyTitle: 'Nichts gefunden',
      emptyText: 'Prüfe die Schreibweise, probiere ein Synonym oder setze die Filter zurück.',
      resetFilters: 'Filter und Suche zurücksetzen',
      suggest: 'Fehlende Capability vorschlagen',
      more: (n) => `${n} weitere anzeigen`,
      detailEmpty: 'Wähle eine Capability, um Beschreibung, Synonyme und Einordnung zu sehen.',
      close: 'Schließen',
      location: 'Einordnung',
      level: (n) => `Ebene ${n}`,
      status: { proposed: 'Vorschlag', accepted: 'Akzeptiert', deprecated: 'Veraltet' },
      sourceName: 'Englischer Originalname',
      synonyms: 'Auch bekannt als',
      children: 'Enthält',
      replacedBy: 'Ersetzt durch',
      deprecatedNote: 'Diese Capability ist veraltet.',
      provenance: 'Herkunft',
      provOriginal: 'Eigene Formulierung',
      provOpen: (l) => `Offene Quelle (${l})`,
      since: 'Seit Version',
      copyLink: 'Link kopieren',
      copied: 'Link kopiert',
      copyHint: 'Link markiert. Mit Strg+C oder Cmd+C kopieren.',
      viewSource: 'Quelldatei ansehen',
      propose: 'Änderung vorschlagen',
      hiddenBelow: (n) => `${n} weitere Ebenen darunter`,
      hitsBelow: (n) => `${n} Treffer in tieferen Ebenen`,
      matchedVia: 'Gefunden über',
      jump: 'Zum ersten Treffer',
      filters: 'Ansicht und Filter',
      matchState: 'Treffer',
      ctxState: 'enthält Treffer',
      loadErrorTitle: 'Die Daten konnten nicht geladen werden.',
      loadErrorText: 'Wenn du die Seite direkt aus einer Datei öffnest, blockiert der Browser das Laden. Starte lokal "npm run dev" oder nutze die Einzeldatei aus "npm run build:standalone".',
      dataLinks: { csv: 'Alle als CSV', json: 'Alle als JSON', offline: 'Offline-Version', source: 'Quellcode' },
      version: (v) => `OpenCap ${v}`,
      license: 'Lizenz MIT',
      legal:
        'Das Modell orientiert sich an Konzepten aus TOGAF und BIZBOK und übernimmt keine geschützten Inhalte daraus. TOGAF und ArchiMate sind Marken von The Open Group. BIZBOK ist eine Marke der Business Architecture Guild.',
    },
    en: {
      skip: 'Skip to results',
      tagline: 'Capability map for architects',
      langLegend: 'Language',
      demoTitle: 'Demo data.',
      demoText: 'These entries only show how search works. They have not been reviewed yet.',
      searchLabel: 'Search capabilities',
      placeholder: 'Search, e.g. onboarding, KYC or payments',
      clear: 'Clear search',
      viewLegend: 'View',
      viewMap: 'Map',
      viewList: 'List',
      depthLegend: 'Levels up to',
      levelLegend: 'Level',
      stratumLegend: 'Stratum',
      all: 'All',
      strategic: 'Strategic',
      core: 'Core',
      supporting: 'Supporting',
      showDeprecated: 'Show deprecated',
      resultsTitle: 'Capabilities',
      loading: 'Loading capabilities …',
      themeDark: 'Dark theme',
      themeLight: 'Light theme',
      statusAll: (n) => `${n} capabilities`,
      statusHits: (n, q) => `${n} ${n === 1 ? 'result' : 'results'} for “${q}”`,
      statusLoose: 'No entry contains all words. Showing entries that match single words.',
      statusNone: (q) => `No results for “${q}”`,
      emptyTitle: 'Nothing found',
      emptyText: 'Check the spelling, try a synonym or reset the filters.',
      resetFilters: 'Reset search and filters',
      suggest: 'Suggest a missing capability',
      more: (n) => `Show ${n} more`,
      detailEmpty: 'Select a capability to see its description, synonyms and place in the map.',
      close: 'Close',
      location: 'Location in the map',
      level: (n) => `Level ${n}`,
      status: { proposed: 'Proposed', accepted: 'Accepted', deprecated: 'Deprecated' },
      sourceName: 'English source name',
      synonyms: 'Also known as',
      children: 'Contains',
      replacedBy: 'Replaced by',
      deprecatedNote: 'This capability is deprecated.',
      provenance: 'Provenance',
      provOriginal: 'Original wording',
      provOpen: (l) => `Open source (${l})`,
      since: 'Since version',
      copyLink: 'Copy link',
      copied: 'Link copied',
      copyHint: 'Link selected. Press Ctrl+C or Cmd+C to copy.',
      viewSource: 'View source file',
      propose: 'Suggest a change',
      hiddenBelow: (n) => `${n} more levels below`,
      hitsBelow: (n) => `${n} results in deeper levels`,
      matchedVia: 'Matched via',
      jump: 'Jump to first match',
      filters: 'View and filters',
      matchState: 'match',
      ctxState: 'contains a match',
      loadErrorTitle: 'The data could not be loaded.',
      loadErrorText: 'If you open this page straight from a file, the browser blocks loading. Run "npm run dev" locally or use the single file from "npm run build:standalone".',
      dataLinks: { csv: 'All as CSV', json: 'All as JSON', offline: 'Offline version', source: 'Source code' },
      version: (v) => `OpenCap ${v}`,
      license: 'MIT license',
      legal:
        'The model is informed by concepts from TOGAF and BIZBOK and takes no protected content from them. TOGAF and ArchiMate are trademarks of The Open Group. BIZBOK is a trademark of the Business Architecture Guild.',
    },
  };

  /* ---------------------------------------------------------------- helpers */
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };
  function h(tag, props = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  // Fold case, umlauts, ß and accents so "Prüfung", "pruefung" and "prufung" meet.
  const fold = (s) =>
    String(s).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/\p{M}/gu, '');
  const split = (t) => String(t).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

  // Index tokenizer: in translated names also index word endings, so "verwaltung"
  // finds "Kundenverwaltung" (German compounds).
  const COMPOUND_FIELDS = new Set(['nameL', 'synL']);
  function indexTokenize(text, field) {
    const toks = split(text);
    if (!COMPOUND_FIELDS.has(field)) return toks;
    const extra = [];
    for (const w of toks) for (let i = 3; i <= w.length - 5; i++) extra.push(w.slice(i));
    return toks.concat(extra);
  }

  /* ----------------------------------------------------------------- state */
  const state = {
    lang: 'de',
    q: '',
    view: 'map',
    depth: 2,
    level: 'all',
    stratum: 'all',
    showDeprecated: false,
    selected: null,
    listLimit: 60,
  };
  let DATA = null;
  let ITEMS = [];
  const BY_ID = new Map();
  let MS = null;
  let RESULT = null; // null when not searching, else { order: [ids], set: Set, loose: bool }
  let CTX = new Map(); // ancestor id -> number of matching descendants
  const tileEls = new Map();
  let bandEls = [];
  const t = () => STR[state.lang];

  const nameOf = (it) => (state.lang !== 'en' && it.labels?.[state.lang]?.name) || it.name;
  const descOf = (it) => (state.lang !== 'en' && it.labels?.[state.lang]?.description) || it.description;
  const synOf = (it) => {
    const own = it.synonyms || [];
    const tr = (state.lang !== 'en' && it.labels?.[state.lang]?.synonyms) || [];
    return state.lang === 'en' ? own : [...tr, ...own.filter((s) => !tr.includes(s))];
  };
  const strataName = (s) => t()[s] || s;

  /* ------------------------------------------------------------------ boot */
  async function loadData() {
    if (window.__OPENCAP_DATA__) return window.__OPENCAP_DATA__;
    const res = await fetch('catalog.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function buildIndex() {
    MS = new window.MiniSearch({
      idField: 'id',
      fields: ['name', 'syn', 'code', 'path', 'desc', 'tags', 'nameL', 'synL', 'descL'],
      tokenize: indexTokenize,
      processTerm: fold,
      searchOptions: {
        boost: { name: 5, nameL: 5, syn: 3.5, synL: 3.5, code: 3, tags: 1.5, path: 1.2, desc: 1, descL: 1 },
        prefix: true,
        fuzzy: (term) => (term.length > 4 ? 0.2 : false),
        tokenize: split,
        processTerm: fold,
      },
    });
    const docs = ITEMS.map((it) => {
      const langs = Object.values(it.labels || {});
      return {
        id: it.id,
        name: it.name,
        syn: (it.synonyms || []).join(' ; '),
        code: it.id,
        path: it.pathNames.join(' '),
        desc: it.description,
        tags: (it.tags || []).join(' '),
        nameL: langs.map((l) => l.name).join(' ; '),
        synL: langs.flatMap((l) => l.synonyms || []).join(' ; '),
        descL: langs.map((l) => l.description).join(' '),
      };
    });
    MS.addAll(docs);
  }

  /* ---------------------------------------------------------------- search */
  function passesFilters(it, { forList = false } = {}) {
    if (!state.showDeprecated && it.status === 'deprecated') return false;
    if (state.stratum !== 'all' && it.stratum !== state.stratum) return false;
    if (forList) {
      if (state.level === '1' && it.level !== 1) return false;
      if (state.level === '2' && it.level !== 2) return false;
      if (state.level === '3+' && it.level < 3) return false;
    }
    return true;
  }

  function computeResult() {
    const q = state.q.trim();
    RESULT = null;
    CTX = new Map();
    if (!q) return;
    let hits = MS.search(q, { combineWith: 'AND' });
    let loose = false;
    if (!hits.length && split(q).length > 1) {
      hits = MS.search(q, { combineWith: 'OR' });
      loose = hits.length > 0;
    }
    const forList = state.view === 'list';
    const order = [];
    for (const hit of hits) {
      const it = BY_ID.get(hit.id);
      if (it && passesFilters(it, { forList })) order.push(it.id);
    }
    RESULT = { order, set: new Set(order), loose };
    for (const id of order) for (const anc of BY_ID.get(id).path) CTX.set(anc, (CTX.get(anc) || 0) + 1);
  }

  /* ------------------------------------------------------------ map render */
  function visibleDescendants(id) {
    const out = [];
    const walk = (cid) => {
      for (const k of BY_ID.get(cid).children) {
        const kid = BY_ID.get(k);
        if (!state.showDeprecated && kid.status === 'deprecated') continue;
        out.push(kid);
        walk(k);
      }
    };
    walk(id);
    return out;
  }

  function tileEl(it) {
    const btn = h('button', { class: 'tile-btn', type: 'button', 'data-id': it.id, onclick: () => select(it.id, { fromMap: true }) },
      h('span', { class: 'tile-name' }, nameOf(it)),
      h('span', { class: 'count' }),
      h('span', { class: 'vh state-text' }),
    );
    const el = h('div', { class: `tile l${it.level}${it.status === 'deprecated' ? ' is-deprecated' : ''}`, 'data-id': it.id }, btn);
    tileEls.set(it.id, el);
    return el;
  }

  function renderMap() {
    tileEls.clear();
    const root = $('#map');
    root.replaceChildren();
    bandEls = [];
    const order = ['strategic', 'core', 'supporting'];
    for (const stratum of order) {
      const l1 = ITEMS.filter((i) => i.level === 1 && i.stratum === stratum && (state.showDeprecated || i.status !== 'deprecated'));
      if (!l1.length) continue;
      const total = l1.reduce((n, i) => n + 1 + visibleDescendants(i.id).length, 0);
      const groups = h('div', { class: 'groups' });
      for (const top of l1) {
        const group = h('div', { class: 'group' }, tileEl(top));
        for (const d of visibleDescendants(top.id)) group.append(tileEl(d));
        groups.append(group);
      }
      const band = h('section', { class: 'band', 'data-stratum': stratum, 'aria-label': strataName(stratum) },
        h('div', { class: 'band-label' }, h('strong', {}, strataName(stratum)), h('span', {}, t().statusAll(total))),
        groups,
      );
      bandEls.push(band);
      root.append(band);
    }
    applyMapState();
  }

  function applyMapState() {
    const searching = !!RESULT;
    // Pass 1: state classes and which tiles are shown. Levels below the chosen depth stay
    // collapsed, except when a search result (or the path to it) lives there.
    for (const [id, el] of tileEls) {
      const it = BY_ID.get(id);
      const isMatch = searching && RESULT.set.has(id);
      const ctxN = searching ? CTX.get(id) || 0 : 0;
      el.hidden = it.level > state.depth && !(isMatch || ctxN > 0);
      el.classList.toggle('is-match', isMatch);
      el.classList.toggle('is-ctx', !isMatch && ctxN > 0);
      el.classList.toggle('is-dim', searching && !isMatch && ctxN === 0);
      el.classList.toggle('is-selected', state.selected === id);
      $('.state-text', el).textContent = isMatch ? ` (${t().matchState})` : ctxN > 0 ? ` (${t().ctxState})` : '';
    }
    // Pass 2: a badge shows how many levels are collapsed below a tile. Not needed while searching.
    for (const [id, el] of tileEls) {
      const hiddenBelow = searching ? 0 : visibleDescendants(id).filter((d) => tileEls.get(d.id)?.hidden).length;
      const count = $('.count', el);
      count.textContent = hiddenBelow ? String(hiddenBelow) : '';
      count.title = hiddenBelow ? t().hiddenBelow(hiddenBelow) : '';
    }
    bandEls.forEach((band) => band.classList.toggle('is-dim', state.stratum !== 'all' && band.dataset.stratum !== state.stratum));
  }

  /* ----------------------------------------------------------- list render */
  function highlight(text, tokens) {
    if (!tokens.length) return text;
    const frag = document.createDocumentFragment();
    let last = 0;
    for (const m of String(text).matchAll(/[\p{L}\p{N}]+/gu)) {
      const f = fold(m[0]);
      if (tokens.some((tok) => f.startsWith(tok) || (tok.length >= 4 && f.includes(tok)))) {
        frag.append(text.slice(last, m.index), h('mark', {}, m[0]));
        last = m.index + m[0].length;
      }
    }
    frag.append(text.slice(last));
    return frag;
  }

  const textMatches = (text, tokens) =>
    Array.from(String(text).matchAll(/[\p{L}\p{N}]+/gu)).some((m) => {
      const f = fold(m[0]);
      return tokens.some((tok) => f.startsWith(tok) || (tok.length >= 4 && f.includes(tok)));
    });

  function matchedAlternatives(it, tokens) {
    if (!tokens.length) return [];
    const labels = Object.values(it.labels || {});
    const names = state.lang === 'en' ? labels.map((l) => l.name) : [it.name];
    const syns = [...(it.synonyms || []), ...labels.flatMap((l) => l.synonyms || [])];
    return [...new Set([...names, ...syns])].filter((x) => textMatches(x, tokens));
  }

  function renderList() {
    const root = $('#list');
    root.replaceChildren();
    let ids;
    if (RESULT) ids = RESULT.order;
    else ids = ITEMS.filter((i) => passesFilters(i, { forList: true })).map((i) => i.id);
    const tokens = RESULT ? split(state.q).map(fold) : [];
    const shown = ids.slice(0, state.listLimit);
    const ul = h('ul', { class: 'rows' });
    for (const id of shown) {
      const it = BY_ID.get(id);
      const alts = matchedAlternatives(it, tokens);
      const meta = h('span', { class: 'row-meta' },
        h('span', { class: 'id' }, highlight(it.id, tokens)),
        h('span', {}, `${t().level(it.level)}, ${strataName(it.stratum)}`),
        it.pathNames.length ? h('span', {}, it.path.map((p) => nameOf(BY_ID.get(p))).join(' › ')) : null,
        it.status !== 'accepted' ? h('span', {}, t().status[it.status]) : null,
      );
      const btn = h('button', {
        class: 'row-btn', type: 'button', 'data-id': id,
        'aria-current': state.selected === id ? 'true' : null,
        onclick: () => select(id),
      },
        h('span', { class: 'row-name' }, highlight(nameOf(it), tokens)),
        meta,
        h('span', { class: 'row-desc' }, highlight(descOf(it), tokens)),
        alts.length ? h('span', { class: 'row-alt' }, `${t().matchedVia}: `, highlight(alts.join(' · '), tokens)) : null,
      );
      ul.append(h('li', { class: it.status === 'deprecated' ? 'row-deprecated' : null }, btn));
    }
    root.append(ul);
    if (ids.length > shown.length) {
      root.append(h('button', {
        class: 'more', type: 'button',
        onclick: () => { state.listLimit += 60; renderList(); },
      }, t().more(ids.length - shown.length)));
    }
  }

  /* --------------------------------------------------------- empty + status */
  function repoUrl(path = '') {
    const r = DATA?.meta?.repository;
    return r ? `${r}${path}` : '';
  }

  function jumpToFirst() {
    const first = $('.tile.is-match:not([hidden])', $('#map'));
    if (!first) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    first.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' });
    $('.tile-btn', first).focus({ preventScroll: true });
  }

  function resetAll() {
    state.q = '';
    state.stratum = 'all';
    state.level = 'all';
    $('#q').value = '';
    syncControls();
    update();
  }

  function renderStatusAndEmpty() {
    const status = $('#status');
    const empty = $('#empty');
    const q = state.q.trim();
    const total = ITEMS.filter((i) => passesFilters(i)).length;
    let none = false;
    let text;
    if (!RESULT) text = t().statusAll(total);
    else if (!RESULT.order.length) { text = t().statusNone(q); none = true; }
    else text = t().statusHits(RESULT.order.length, q) + (RESULT.loose ? `. ${t().statusLoose}` : '');
    status.replaceChildren(text);
    if (RESULT && RESULT.order.length && state.view === 'map') {
      status.append(' ', h('button', { class: 'link-btn', type: 'button', onclick: jumpToFirst }, t().jump));
    }

    empty.replaceChildren();
    if (none) {
      const actions = h('div', { class: 'actions' },
        h('button', { class: 'more', type: 'button', style: 'margin:0', onclick: resetAll }, t().resetFilters),
      );
      if (repoUrl()) {
        const title = encodeURIComponent(`New capability: ${q}`);
        actions.append(h('a', { href: repoUrl(`/issues/new?template=capability-change.yml&title=${title}`), target: '_blank', rel: 'noopener', class: 'link-btn' }, t().suggest));
      }
      empty.append(h('div', { class: 'empty' }, h('h2', {}, t().emptyTitle), h('p', {}, t().emptyText), actions));
    }
    empty.hidden = !none;
    $('#map').hidden = none || state.view !== 'map';
    $('#list').hidden = none || state.view !== 'list';
  }

  /* ----------------------------------------------------------------- detail */
  function chipButton(id) {
    const it = BY_ID.get(id);
    return h('li', {}, h('button', { type: 'button', onclick: () => select(id) }, nameOf(it)));
  }

  function renderDetail() {
    const box = $('#detail');
    box.replaceChildren();
    const it = state.selected && BY_ID.get(state.selected);
    box.classList.toggle('is-empty', !it);
    if (!it) {
      box.append(h('p', { class: 'detail-empty' }, t().detailEmpty));
      return;
    }
    const crumbs = h('ol', { class: 'crumbs', 'aria-label': t().location },
      h('li', {}, strataName(it.stratum)),
      ...it.path.map((p) => h('li', {}, h('button', { type: 'button', onclick: () => select(p) }, nameOf(BY_ID.get(p))))),
    );

    const deprecatedNote = it.status === 'deprecated'
      ? h('p', { class: 'note' }, t().deprecatedNote, ' ',
          it.deprecation_note ? `${it.deprecation_note} ` : '',
          it.replaced_by && BY_ID.has(it.replaced_by)
            ? h('span', {}, `${t().replacedBy}: `, h('button', { type: 'button', onclick: () => select(it.replaced_by) }, nameOf(BY_ID.get(it.replaced_by))))
            : null)
      : null;
    const altName = state.lang !== 'en' && it.labels?.[state.lang] ? h('p', { class: 'alt-name' }, `${t().sourceName}: ${it.name}`) : null;
    box.append(
      ...[
        h('div', { class: 'detail-head' }, crumbs,
          h('button', { class: 'close', type: 'button', 'aria-label': t().close, title: t().close, onclick: () => select(null) }, '×')),
        h('h2', {}, nameOf(it)),
        altName,
        h('ul', { class: 'tags' },
          h('li', { class: 'id' }, it.id),
          h('li', {}, t().level(it.level)),
          h('li', { 'data-stratum': it.stratum }, strataName(it.stratum)),
          h('li', {}, t().status[it.status]),
        ),
        deprecatedNote,
        h('p', { class: 'desc' }, descOf(it)),
      ].filter(Boolean),
    );

    const dl = h('dl', {});
    const syns = synOf(it);
    if (syns.length) dl.append(h('div', {}, h('dt', {}, t().synonyms), h('dd', {}, syns.join(', '))));
    const kids = it.children.filter((k) => state.showDeprecated || BY_ID.get(k).status !== 'deprecated');
    if (kids.length) dl.append(h('div', {}, h('dt', {}, t().children), h('dd', {}, h('ul', { class: 'pill-list' }, ...kids.map(chipButton)))));
    const prov = it.provenance?.type === 'open-license'
      ? h('span', {}, t().provOpen(it.provenance.license), ' ', h('a', { href: it.provenance.source, target: '_blank', rel: 'noopener' }, new URL(it.provenance.source).hostname))
      : t().provOriginal;
    dl.append(h('div', {}, h('dt', {}, t().provenance), h('dd', {}, prov)));
    dl.append(h('div', {}, h('dt', {}, t().since), h('dd', {}, it.since)));
    box.append(dl);

    const actions = h('div', { class: 'actions-row' },
      h('button', { type: 'button', id: 'copy-link', onclick: copyLink }, t().copyLink),
    );
    if (repoUrl()) {
      const branch = DATA.meta.branch || 'main';
      actions.append(
        h('a', { href: repoUrl(`/blob/${branch}/${it.file}`), target: '_blank', rel: 'noopener' }, t().viewSource),
        h('a', {
          href: repoUrl(`/issues/new?template=capability-change.yml&title=${encodeURIComponent(`Change: ${it.name} (${it.id})`)}&capability=${encodeURIComponent(it.id)}`),
          target: '_blank', rel: 'noopener',
        }, t().propose),
      );
    }
    box.append(actions, h('p', { class: 'tiny', id: 'copy-msg', role: 'status' }));
  }

  function permalink() {
    let base = location.href.split('#')[0];
    return `${base}#${state.selected}`;
  }

  async function copyLink() {
    const msg = $('#copy-msg');
    const url = permalink();
    try {
      await navigator.clipboard.writeText(url);
      msg.textContent = t().copied;
    } catch {
      const input = h('input', { class: 'copy-fallback', readonly: true, value: url, 'aria-label': t().copyLink });
      msg.replaceChildren(input, h('span', {}, t().copyHint));
      input.focus();
      input.select();
    }
  }

  /* -------------------------------------------------------------- selection */
  function select(id, { fromMap = false } = {}) {
    state.selected = id && BY_ID.has(id) ? id : null;
    const it = state.selected && BY_ID.get(state.selected);
    if (it && state.view === 'map' && it.level > state.depth) {
      state.depth = Math.min(it.level, 6);
      syncControls();
    }
    renderDetail();
    $('#detail').scrollTop = 0;
    if (state.view === 'map') applyMapState();
    else $$('.row-btn').forEach((b) => (b.getAttribute('data-id') === state.selected ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    syncUrl();
    if (it && !fromMap && state.view === 'map') {
      const el = tileEls.get(it.id);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  function syncUrl() {
    try {
      const url = new URL(location.href);
      if (state.q.trim()) url.searchParams.set('q', state.q.trim());
      else url.searchParams.delete('q');
      url.hash = state.selected ? state.selected : '';
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch { /* URL cannot be changed in this context (sandboxed frame) */ }
  }

  /* ----------------------------------------------------------------- update */
  function update() {
    computeResult();
    renderStatusAndEmpty();
    if (state.view === 'map') applyMapState();
    else renderList();
    $('#clear').hidden = !state.q;
    syncUrl();
  }

  /* --------------------------------------------------------------- controls */
  function syncControls() {
    const set = (name, value) => $$(`input[name="${name}"]`).forEach((r) => (r.checked = r.value === String(value)));
    set('view', state.view);
    set('depth', state.depth);
    set('level', state.level);
    set('stratum', state.stratum);
    set('lang', state.lang);
    $('#deprecated').checked = state.showDeprecated;
    $('#depth-group').hidden = state.view !== 'map';
    $('#level-group').hidden = state.view !== 'list';
  }

  function applyI18n() {
    const s = t();
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach((el) => { if (typeof s[el.dataset.i18n] === 'string') el.textContent = s[el.dataset.i18n]; });
    $$('[data-i18n-placeholder]').forEach((el) => el.setAttribute('placeholder', s[el.dataset.i18nPlaceholder]));
    $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', s[el.dataset.i18nAria]));
    const dark = effectiveTheme() === 'dark';
    $('#theme').textContent = dark ? s.themeLight : s.themeDark;
    const links = $('#foot-links');
    links.replaceChildren(
      h('span', {}, s.version(DATA?.meta.version ?? '')),
      h('span', {}, s.license),
      // The single-file version has no sibling files to link to.
      window.__OPENCAP_DATA__ ? null : h('a', { href: 'capabilities.csv', download: '' }, s.dataLinks.csv),
      window.__OPENCAP_DATA__ ? null : h('a', { href: 'catalog.json', download: '' }, s.dataLinks.json),
      window.__OPENCAP_DATA__ ? null : h('a', { href: 'opencap.html', download: '' }, s.dataLinks.offline),
      repoUrl() ? h('a', { href: repoUrl(), target: '_blank', rel: 'noopener' }, s.dataLinks.source) : null,
    );
  }

  function effectiveTheme() {
    const explicit = document.documentElement.dataset.theme;
    if (explicit) return explicit;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function relabel() {
    applyI18n();
    if (DATA) {
      renderMap();
      renderDetail();
      update();
    }
  }

  function bind() {
    let timer;
    $('#q').addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.q = e.target.value;
        state.listLimit = 60;
        update();
      }, 60);
    });
    $('#search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      state.q = $('#q').value;
      update();
      if (RESULT?.order[0]) select(RESULT.order[0]);
    });
    $('#clear').addEventListener('click', () => {
      $('#q').value = '';
      state.q = '';
      update();
      $('#q').focus();
    });
    $$('input[name="view"]').forEach((r) => r.addEventListener('change', () => {
      state.view = r.value;
      syncControls();
      if (state.view === 'map') renderMap();
      update();
    }));
    $$('input[name="depth"]').forEach((r) => r.addEventListener('change', () => {
      state.depth = Number(r.value);
      applyMapState();
    }));
    $$('input[name="level"]').forEach((r) => r.addEventListener('change', () => {
      state.level = r.value;
      state.listLimit = 60;
      update();
    }));
    $$('input[name="stratum"]').forEach((r) => r.addEventListener('change', () => {
      state.stratum = r.value;
      state.listLimit = 60;
      update();
    }));
    $('#deprecated').addEventListener('change', (e) => {
      state.showDeprecated = e.target.checked;
      state.listLimit = 60;
      renderMap();
      update();
    });
    $$('input[name="lang"]').forEach((r) => r.addEventListener('change', () => {
      state.lang = r.value;
      store.set('opencap.lang', state.lang);
      relabel();
    }));
    $('#theme').addEventListener('click', () => {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      store.set('opencap.theme', next);
      applyI18n();
    });
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        $('#q').focus();
        $('#q').select();
      } else if (e.key === 'Escape') {
        if (document.activeElement === $('#q') && $('#q').value) {
          $('#q').value = '';
          state.q = '';
          update();
        } else if (state.selected) {
          select(null);
        }
      }
    });
    window.addEventListener('hashchange', () => {
      const id = location.hash.slice(1);
      if (id !== (state.selected || '')) select(BY_ID.has(id) ? id : null);
    });
  }

  /* ------------------------------------------------------------------- init */
  async function init() {
    const savedLang = store.get('opencap.lang');
    state.lang = savedLang === 'de' || savedLang === 'en' ? savedLang : (navigator.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';
    const savedTheme = store.get('opencap.theme');
    if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme;

    syncControls();
    applyI18n();
    bind();
    $('#controls').open = matchMedia('(min-width: 40rem)').matches;

    try {
      DATA = await loadData();
    } catch (err) {
      $('#loading').hidden = true;
      $('#empty').replaceChildren(h('div', { class: 'load-error' }, h('h2', {}, t().loadErrorTitle), h('p', {}, t().loadErrorText), h('p', { class: 'tiny' }, String(err.message || err))));
      $('#empty').hidden = false;
      return;
    }
    ITEMS = DATA.capabilities;
    for (const it of ITEMS) BY_ID.set(it.id, it);
    buildIndex();
    $('#loading').hidden = true;
    $('#demo-notice').hidden = !DATA.meta.demo;
    applyI18n();

    let q = '';
    try { q = new URLSearchParams(location.search).get('q') || ''; } catch { /* no query available */ }
    state.q = q;
    $('#q').value = q;
    const hash = location.hash.slice(1);
    if (BY_ID.has(hash)) state.selected = hash;

    if (state.selected && BY_ID.get(state.selected).level > state.depth) state.depth = Math.min(BY_ID.get(state.selected).level, 6);
    syncControls();
    renderMap();
    renderDetail();
    update();
  }

  init();
})();
