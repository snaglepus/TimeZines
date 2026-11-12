(() => {
'use strict';

const H = 36e5, MAX = 8, KEY = 'timezines:v1';
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WDS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad = n => String(n).padStart(2, '0');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* ---------- timezone maths (Intl only, DST-safe) ---------- */
const validTz = tz => { try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch { return false; } };
const LEGACY = { 'Europe/Kyiv': 'Europe/Kiev', 'America/Nuuk': 'America/Godthab', 'Asia/Yangon': 'Asia/Rangoon', 'Asia/Kathmandu': 'Asia/Katmandu', 'Asia/Kolkata': 'Asia/Calcutta', 'Asia/Ho_Chi_Minh': 'Asia/Saigon' };

const partsF = new Map();
function parts(tz, t) {
  let f = partsF.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', weekday: 'short' });
    partsF.set(tz, f);
  }
  const o = {};
  for (const p of f.formatToParts(t)) o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute, wd: o.weekday };
}
// Minutes ahead of UTC for tz at instant t.
function offMin(tz, t) {
  const p = parts(tz, t);
  return Math.round((Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - Math.floor(t / 6e4) * 6e4) / 6e4);
}
// The instant local midnight starts on y-m-d in tz.
function midnight(tz, y, m, d) {
  const base = Date.UTC(y, m - 1, d);
  let g = base;
  for (let i = 0; i < 3; i++) g = base - offMin(tz, g) * 6e4;
  return g;
}
const abbrF = new Map();
function abbr(tz, t) {
  const get = (loc, opt) => {
    const k = loc + opt + tz;
    let f = abbrF.get(k);
    if (!f) { f = new Intl.DateTimeFormat(loc, { timeZone: tz, timeZoneName: opt }); abbrF.set(k, f); }
    return f.formatToParts(t).find(x => x.type === 'timeZoneName').value;
  };
  for (const loc of ['en-US', 'en-AU', 'en-GB']) {
    const v = get(loc, 'short');
    if (!/^(GMT|UTC)[+-]/.test(v)) return v;
  }
  return get('en-US', 'shortOffset');
}
function diffStr(tz, t) {
  const d = (offMin(tz, t) - offMin(home().tz, t)) / 60;
  if (!d) return 'same time';
  const a = Math.abs(d), h = Math.floor(a), m = Math.round((a - h) * 60);
  return (d > 0 ? '+' : '−') + h + (m ? ':' + pad(m) : '') + 'h';
}
function heat(h, wd) {
  if ((wd === 'Sat' || wd === 'Sun') && h >= 6 && h < 20) return 'wkd';
  if (h >= 9 && h < 17) return 'biz';
  if (h === 8 || h === 17) return 'o1';
  if (h === 7 || h === 18) return 'o2';
  if (h === 6 || h === 19) return 'o3';
  return 'night';
}

/* ---------- cities ---------- */
const CITIES = window.TZ_CITIES.map(c => validTz(c.tz) ? c : (LEGACY[c.tz] && validTz(LEGACY[c.tz]) ? { ...c, tz: LEGACY[c.tz] } : null)).filter(Boolean);
// Every other IANA zone the browser knows, so any timezone is findable.
const EXTRA = (() => {
  try {
    // Browsers disagree on spellings (Asia/Kathmandu vs Asia/Katmandu), so compare canonical names.
    const canon = tz => new Intl.DateTimeFormat('en-US', { timeZone: tz }).resolvedOptions().timeZone;
    const have = new Set(CITIES.flatMap(c => [c.tz, canon(c.tz)]));
    return Intl.supportedValuesOf('timeZone').filter(z => z.includes('/') && !have.has(z) && !have.has(canon(z))).map(tz => ({
      name: tz.split('/').pop().replace(/_/g, ' '), country: tz.split('/')[0].replace(/_/g, ' '), tz, alias: tz, extra: true,
    }));
  } catch { return []; }
})();
const ALL = CITIES.concat(EXTRA);
const POPULAR = ['London','New York','Tokyo','Singapore','Los Angeles','Paris','Dubai','Hong Kong','Berlin','Mumbai','Sydney','Auckland'];

const DEVICE_TZ = (() => { const z = Intl.DateTimeFormat().resolvedOptions().timeZone; return z && validTz(z) ? z : 'UTC'; })();
const deviceHome = () => CITIES.find(c => c.tz === DEVICE_TZ) || ALL.find(c => c.tz === DEVICE_TZ)
  || { name: DEVICE_TZ.split('/').pop().replace(/_/g, ' '), country: '', tz: DEVICE_TZ, alias: '' };

/* ---------- state + persistence ---------- */
const hc = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hourCycle;
const S = {
  homeOverride: null, zones: [], h12: hc ? hc === 'h12' || hc === 'h11' : true, mode: 'auto', meet: null,
  day: 0, cursor: null, drag: null,
};
const home = () => S.homeOverride || deviceHome();
const rows = () => [home(), ...S.zones];
const slim = c => ({ name: String(c.name).slice(0, 80), country: String(c.country || '').slice(0, 80), tz: c.tz });

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (!d) return;
    if (d.home && validTz(d.home.tz)) S.homeOverride = slim(d.home);
    if (Array.isArray(d.zones)) S.zones = d.zones.filter(z => z && validTz(z.tz)).map(slim).slice(0, MAX - 1);
    if (typeof d.h12 === 'boolean') S.h12 = d.h12;
    if (['auto', 'light', 'dark'].includes(d.mode)) S.mode = d.mode;
    if (['good', 'best'].includes(d.meet)) S.meet = d.meet;
  } catch { /* storage blocked or corrupt: start fresh */ }
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 1, home: S.homeOverride && slim(S.homeOverride), zones: S.zones.map(slim), h12: S.h12, mode: S.mode, meet: S.meet }));
  } catch { /* private mode etc. */ }
}

/* ---------- formatting ---------- */
const hm = (h, m) => S.h12 ? `${h % 12 || 12}:${pad(m)}<small>${h < 12 ? 'am' : 'pm'}</small>` : `${pad(h)}:${pad(m)}`;
const timeHTML = (tz, t) => { const p = parts(tz, t); return hm(p.h, p.min); };
const hourLabel = h => S.h12 ? `${h % 12 || 12}<small>${h < 12 ? 'a' : 'p'}</small>` : pad(h);

/* ---------- layout ---------- */
const sc = $('#sc'), grid = $('#grid');
const px = t => (t - S.start) / H * S.hw;

function range() {
  const p = parts(home().tz, Date.now());
  const a = new Date(Date.UTC(p.y, p.m - 1, p.d + S.day)), b = new Date(Date.UTC(p.y, p.m - 1, p.d + S.day + 1));
  return {
    start: midnight(home().tz, a.getUTCFullYear(), a.getUTCMonth() + 1, a.getUTCDate()),
    end: midnight(home().tz, b.getUTCFullYear(), b.getUTCMonth() + 1, b.getUTCDate()),
    date: a,
  };
}

function header(r) {
  const a = r.date, ds = `${WDS[a.getUTCDay()]} ${a.getUTCDate()} ${MON[a.getUTCMonth()]}`;
  const rel = { 0: 'Today', 1: 'Tomorrow', '-1': 'Yesterday' }[S.day];
  const modeTxt = { auto: '◐ Auto', light: '☀ Light', dark: '☾ Dark' }[S.mode];
  return `<h1 class="brand"><span class="logo" aria-hidden="true"></span>TimeZines</h1>
  <nav class="day" aria-label="Day">
    <button class="arrow" data-act="prev" aria-label="Previous day">‹</button>
    <button class="today" data-act="today" title="Jump to now (T)">${rel ? rel + ' · ' : ''}${ds}</button>
    <button class="arrow" data-act="next" aria-label="Next day">›</button>
  </nav>
  <div class="meet" role="group" aria-label="Meeting times">
    <span class="mlabel">Meeting times</span>
    <button class="tbtn${S.meet === 'good' ? ' on' : ''}" data-act="meet" data-m="good" aria-pressed="${S.meet === 'good'}" title="Black out night hours (G)">Good</button>
    <button class="tbtn${S.meet === 'best' ? ' on' : ''}" data-act="meet" data-m="best" aria-pressed="${S.meet === 'best'}" title="Black out everything but business hours (B)">Best</button>
    ${S.meet ? '<button class="tbtn clear" data-act="meet" data-m="" aria-label="Clear meeting times" title="Clear (C)">×</button>' : ''}
  </div>
  <div class="tools">
    <button class="tbtn" data-act="mode" title="Theme" aria-label="Theme: ${S.mode}">${modeTxt}</button>
    <button class="tbtn" data-act="fmt" aria-label="Switch to ${S.h12 ? '24' : '12'}-hour time">${S.h12 ? '12h' : '24h'}</button>
    <button class="tbtn add" data-act="add" ${rows().length >= MAX ? 'disabled title="Up to 8 timezones"' : 'title="Add a city (/)"'}>+ Add</button>
  </div>`;
}

function label(c, i, now) {
  const p = parts(c.tz, now);
  return `${i ? `<span class="grip" data-grip="${i}" title="Drag to reorder" aria-hidden="true">⠿</span>` : ''}
  <button class="city" data-act="edit" data-i="${i}" title="${i ? 'Change or remove' : 'Change home city'}">
    <span class="name"><span>${esc(c.name)}</span></span>
    <span class="meta">${i ? `${esc(abbr(c.tz, now))} · ${diffStr(c.tz, now)}` : `Home · ${esc(abbr(c.tz, now))}`}</span>
  </button>
  <div class="clock"><span class="time">${hm(p.h, p.min)}</span><span class="date">${p.wd} ${p.d} ${MON[p.m - 1]}</span></div>
  ${i ? `<button class="del" data-act="del" data-i="${i}" aria-label="Remove ${esc(c.name)}">×</button>` : ''}`;
}

function blocks(tz) {
  let t = S.start, o = '';
  while (t < S.end) {
    const p = parts(tz, t), nx = Math.min(t + (60 - p.min) * 6e4, S.end);
    const x = px(t), w = px(nx) - x, mid = p.h === 0 && p.min === 0;
    const txt = (p.min || w < 22) ? '' : mid ? `${p.wd} ${p.d}` : hourLabel(p.h);
    o += `<div class="b c-${heat(p.h, p.wd)}${mid ? ' mid' : ''}" style="left:${x.toFixed(1)}px;width:${w.toFixed(1)}px"><span>${txt}</span></div>`;
    t = nx;
  }
  return o;
}

// One-tap suggestions while the list is short.
function suggestions() {
  if (S.zones.length > 2) return [];
  const have = new Set(rows().map(c => c.tz));
  return POPULAR.map(n => CITIES.find(c => c.name === n)).filter(c => c && !have.has(c.tz)).slice(0, 4);
}

function render() {
  if (S.drag) return;
  const cs = getComputedStyle(document.documentElement);
  const L = parseFloat(cs.getPropertyValue('--labelW')) || 0, minH = parseFloat(cs.getPropertyValue('--minHour')) || 48;
  const r = range(), now = Date.now(), vis = sc.clientWidth, hours = (r.end - r.start) / H;
  Object.assign(S, { start: r.start, end: r.end, L, vis, hw: Math.max(minH, (vis - L) / hours) });
  S.trackW = hours * S.hw;

  $('#top').innerHTML = header(r);
  let h = '<div class="row gutter"><div class="label"></div></div>';
  rows().forEach((c, i) => {
    h += `<div class="row${i ? ' z' : ' home'}" data-i="${i}"><div class="label">${label(c, i, now)}</div>` +
      `<div class="track" style="width:${S.trackW}px">${blocks(c.tz)}<span class="chip" hidden></span></div></div>`;
  });
  h += `<div class="row addrow"><div class="label">${rows().length < MAX
    ? '<button class="addbtn" data-act="add">+ Add city</button>' + suggestions().map(c =>
        `<button class="sugg" data-act="quick" data-name="${esc(c.name)}" title="Add ${esc(c.name)}">+ ${esc(c.name)}</button>`).join('')
    : '<span class="full">8 of 8 timezones</span>'}</div></div>`;
  if (now >= r.start && now < r.end) h += `<div class="now" style="left:${L + px(now)}px"><i>${timeHTML(home().tz, now)}</i></div>`;
  h += '<div class="cursor" hidden></div>';
  grid.style.width = (S.trackW + L) + 'px';
  grid.dataset.meet = S.meet || '';
  grid.innerHTML = h;
  drawCursor();
  document.title = `${timeHTML(home().tz, now).replace(/<[^>]+>/g, '')} · TimeZines`;
}

function scrollToNow(smooth) {
  const now = Date.now(), inDay = now >= S.start && now < S.end, t = inDay ? now : S.start + 8 * H;
  sc.scrollTo({ left: Math.max(0, px(t) - (S.vis - S.L) * (inDay ? 0.3 : 0)), behavior: smooth ? 'smooth' : 'auto' });
}

function applyMode() {
  const el = document.documentElement;
  if (S.mode === 'auto') delete el.dataset.mode; else el.dataset.mode = S.mode;
  const bg = getComputedStyle(el).getPropertyValue('--bg').trim();
  $('meta[name="theme-color"]').setAttribute('content', bg);
}

/* ---------- hover / tap to compare ---------- */
function tAt(e) {
  if (e.target.closest('.label, button, .gutter, .addrow')) return null;
  const x = e.clientX - grid.getBoundingClientRect().left - S.L;
  if (x < 0 || x > S.trackW) return null;
  return Math.round((S.start + x / S.hw * H) / 9e5) * 9e5;   // snap to 15 minutes
}
function drawCursor() {
  const cur = $('.cursor'), chips = $$('.chip'), t = S.cursor;
  if (!cur) return;
  if (t == null || t < S.start || t >= S.end) { cur.hidden = true; chips.forEach(c => c.hidden = true); return; }
  const x = px(t), hd = parts(home().tz, t).d;
  cur.hidden = false;
  cur.style.left = (S.L + x) + 'px';
  rows().forEach((c, i) => {
    const p = parts(c.tz, t), ch = chips[i];
    if (!ch) return;
    ch.hidden = false;
    ch.style.left = x + 'px';
    ch.innerHTML = hm(p.h, p.min) + (p.d !== hd ? `<b>${p.wd}</b>` : '');
  });
}
const canHover = matchMedia('(hover:hover)');
sc.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && !S.drag) { S.cursor = tAt(e); drawCursor(); } });
sc.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { S.cursor = null; drawCursor(); } });
sc.addEventListener('click', e => {
  if (canHover.matches && e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
  const t = tAt(e);
  S.cursor = (t != null && t === S.cursor) ? null : t;
  drawCursor();
});

/* ---------- drag to reorder ---------- */
grid.addEventListener('pointerdown', e => {
  const g = e.target.closest('[data-grip]');
  if (!g || e.button > 0) return;
  e.preventDefault();
  const from = +g.dataset.grip, rowEl = g.closest('.row');
  const step = rowEl.offsetHeight + (parseFloat(getComputedStyle(grid).rowGap) || 0);
  S.drag = { from, to: from, y0: e.clientY, step, rowEl, els: $$('.row.z') };
  S.cursor = null; drawCursor();
  rowEl.classList.add('dragging');
  try { g.setPointerCapture(e.pointerId); } catch { /* synthetic events have no capturable pointer */ }
});
grid.addEventListener('pointermove', e => {
  const d = S.drag;
  if (!d) return;
  const dy = e.clientY - d.y0, n = S.zones.length;
  d.to = Math.max(1, Math.min(n, d.from + Math.round(dy / d.step)));
  d.els.forEach(el => {
    const j = +el.dataset.i;
    let off = 0;
    if (j === d.from) off = dy;
    else if (d.from < d.to && j > d.from && j <= d.to) off = -d.step;
    else if (d.to < d.from && j >= d.to && j < d.from) off = d.step;
    el.style.transform = off ? `translateY(${off}px)` : '';
  });
});
const endDrag = () => {
  const d = S.drag;
  if (!d) return;
  S.drag = null;
  if (d.to !== d.from) { const [z] = S.zones.splice(d.from - 1, 1); S.zones.splice(d.to - 1, 0, z); save(); }
  render();
};
grid.addEventListener('pointerup', endDrag);
grid.addEventListener('pointercancel', endDrag);
// Keyboard reorder: Alt + ↑/↓ on a city name.
grid.addEventListener('keydown', e => {
  const b = e.target.closest('.city');
  if (!b || !e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
  const i = +b.dataset.i, j = i + (e.key === 'ArrowUp' ? -1 : 1);
  if (i < 1 || j < 1 || j > S.zones.length) return;
  e.preventDefault();
  [S.zones[i - 1], S.zones[j - 1]] = [S.zones[j - 1], S.zones[i - 1]];
  save(); render();
  $(`.city[data-i="${j}"]`)?.focus();
});

/* ---------- city picker ---------- */
const PK = { mode: null, list: [], on: 0, back: null };
function openPicker(mode) {
  const r = rows(), isRow = typeof mode === 'number';
  PK.mode = mode; PK.back = document.activeElement;
  $('#ptitle').textContent = mode === 'add' ? 'Add a city' : mode === 'home' ? 'Set your home city' : `Change ${r[mode].name}`;
  const rm = $('#remove');
  rm.hidden = !isRow;
  if (isRow) rm.textContent = `Remove ${r[mode].name}`;
  const rs = $('#reset'), dev = deviceHome();
  rs.hidden = !(mode === 'home' && S.homeOverride);
  rs.textContent = `Use this device's timezone (${dev.name})`;
  $('#picker').hidden = false;
  $('#q').value = '';
  search();
  $('#q').focus();
}
function closePicker() {
  $('#picker').hidden = true;
  PK.mode = null;
  PK.back?.focus?.();
}
function search() {
  const q = norm($('#q').value.trim()), have = new Set(rows().map(c => c.tz + c.name));
  let list;
  if (!q) list = POPULAR.map(n => CITIES.find(c => c.name === n)).filter(c => c && !have.has(c.tz + c.name));
  else list = ALL.map(c => {
    const n = norm(c.name), hay = norm(`${c.country} ${c.alias} ${c.tz}`);
    let s = n.startsWith(q) ? 0 : n.split(/[\s\-.,]+/).some(w => w.startsWith(q)) ? 1 : hay.split(/[\s/_]+/).some(w => w.startsWith(q)) ? 2 : hay.includes(q) ? 3 : -1;
    if (s >= 0 && c.extra) s += 4;
    return { c, s };
  }).filter(x => x.s >= 0).sort((a, b) => a.s - b.s || a.c.name.localeCompare(b.c.name)).map(x => x.c);
  PK.list = list.slice(0, 30);
  PK.on = 0;
  drawResults();
}
function drawResults() {
  const now = Date.now(), ul = $('#results');
  ul.innerHTML = PK.list.length ? PK.list.map((c, k) => `<li><button role="option" data-act="pick" data-k="${k}" class="${k === PK.on ? 'on' : ''}" aria-selected="${k === PK.on}">
    <span class="r-name">${esc(c.name)}</span>
    <span class="r-time">${timeHTML(c.tz, now)}<em>${diffStr(c.tz, now)}</em></span>
    <span class="r-sub">${esc(c.country)} · ${esc(abbr(c.tz, now))}</span></button></li>`).join('')
    : '<li class="empty">No matching city. Try a nearby city, the country or a timezone like “EST”.</li>';
  ul.querySelector('.on')?.scrollIntoView({ block: 'nearest' });
}
function choose(c) {
  const m = PK.mode, z = slim(c);
  if (m === 'add') { if (rows().length < MAX) S.zones.push(z); }
  else if (m === 'home') { S.homeOverride = z.tz === DEVICE_TZ && z.name === deviceHome().name ? null : z; }
  else S.zones[m - 1] = z;
  save();
  closePicker();
  render();
  scrollToNow(false);
}
$('#q').addEventListener('input', search);
$('#q').addEventListener('keydown', e => {
  const n = PK.list.length;
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && n) {
    e.preventDefault();
    PK.on = (PK.on + (e.key === 'ArrowDown' ? 1 : n - 1)) % n;
    drawResults();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (PK.list[PK.on]) choose(PK.list[PK.on]);
  }
});
$('#picker').addEventListener('click', e => { if (e.target.id === 'picker') closePicker(); });

/* ---------- actions ---------- */
$('#app').addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const i = +b.dataset.i;
  switch (b.dataset.act) {
    case 'prev': S.day--; render(); scrollToNow(true); break;
    case 'next': S.day++; render(); scrollToNow(true); break;
    case 'today': S.day = 0; render(); scrollToNow(true); break;
    case 'fmt': S.h12 = !S.h12; save(); render(); break;
    case 'meet': S.meet = b.dataset.m && b.dataset.m !== S.meet ? b.dataset.m : null; save(); render(); break;
    case 'mode': S.mode = { auto: 'light', light: 'dark', dark: 'auto' }[S.mode]; save(); applyMode(); render(); break;
    case 'add': if (rows().length < MAX) openPicker('add'); break;
    case 'edit': openPicker(i === 0 ? 'home' : i); break;
    case 'del': S.zones.splice(i - 1, 1); save(); render(); break;
    case 'close': closePicker(); break;
    case 'pick': choose(PK.list[+b.dataset.k]); break;
    case 'quick': { const c = CITIES.find(x => x.name === b.dataset.name); if (c && rows().length < MAX) { S.zones.push(slim(c)); save(); render(); } break; }
    case 'remove': S.zones.splice(PK.mode - 1, 1); save(); closePicker(); render(); break;
    case 'reset': S.homeOverride = null; save(); closePicker(); render(); scrollToNow(false); break;
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#picker').hidden) { closePicker(); return; }
  if (e.target.closest('input, textarea') || e.metaKey || e.ctrlKey || e.altKey || !$('#picker').hidden) return;
  if (e.key === '/' || e.key === 'a') { e.preventDefault(); if (rows().length < MAX) openPicker('add'); }
  else if (e.key === 't') { S.day = 0; render(); scrollToNow(true); }
  else if (e.key === '[') { S.day--; render(); scrollToNow(true); }
  else if (e.key === ']') { S.day++; render(); scrollToNow(true); }
  else if (e.key === 'g' || e.key === 'b') { S.meet = S.meet === (e.key === 'g' ? 'good' : 'best') ? null : e.key === 'g' ? 'good' : 'best'; save(); render(); }
  else if (e.key === 'c' && S.meet) { S.meet = null; save(); render(); }
});

/* ---------- boot ---------- */
load();
applyMode();
let lastW = 0;
new ResizeObserver(() => { const w = sc.clientWidth; if (w !== lastW) { const first = !lastW; lastW = w; render(); if (first) scrollToNow(false); } }).observe(sc);
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyMode);
// Re-render on the minute so clocks and the now-line stay current.
const tick = () => { render(); setTimeout(tick, 60000 - Date.now() % 60000 + 50); };
setTimeout(tick, 60000 - Date.now() % 60000 + 50);
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
})();
