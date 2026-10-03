/* ============================================================
   Amjilt Canteen — Shell, Router, Interactions
   ============================================================ */

/* ------------------------------------------------------------
   SCREEN REGISTRY
   Every screen file adds to SCREENS. Contract:

   SCREENS['key'] = {
     name : 'Mongolian title shown in the rail',
     group: 'Onboarding' | 'Student' | 'Parent' | 'Cafeteria' | 'Admin' | 'States',
     note : 'short English note for the header',
     dev  : 'phone' (default) | 'tablet' | 'desktop',
     w, h : optional frame overrides (px),
     nav  : 'home'|'menu'|'orders'|'wallet'|'profile' | null,
     render: (param) => htmlString,
     after: (param) => void   // optional post-paint hooks
   }
   ------------------------------------------------------------ */
const SCREENS = {};
let order = [];

/* A silent render failure used to leave the viewport blank. Surface it. */
function fatal(where, err) {
  const el = document.getElementById('stage');
  if (!el) return;
  el.innerHTML = `<div style="max-width:560px;margin:40px auto;padding:20px;border-radius:16px;
    background:#FCE7E5;box-shadow:inset 0 0 0 1.5px #F3C6C3;font:500 13px/1.6 var(--font);color:#8E201B">
    <b style="font-size:15px">Ачаалагдсангүй: ${where}</b>
    <pre style="margin-top:10px;white-space:pre-wrap;font:500 12px/1.5 ui-monospace,monospace">${String(err && err.stack || err)}</pre></div>`;
}
window.addEventListener('error', e => { if (document.getElementById('stage')) fatal('JS алдаа', e.error || e.message); });

function defineScreen(key, def) { SCREENS[key] = { key, ...def }; order.push(key); }

/* ------------------------------------------------------------
   App state
   ------------------------------------------------------------ */
const APP = {
  route: 'onb1',
  param: null,
  tab: 'home',
  sheet: null,          // active sheet id (overlay only, scroll preserved)
  slot: SELECTED_SLOT,  // smart-queue selection
  cat: 'all',
  search: '',
  allergensFilter: [],
  favoritesOnly: false,
  payState: 'idle',     // idle | processing | success | failed
  qrState: 'valid',     // valid | scanned | expired
  orderStatus: 'preparing',
  rating: 0,
  ratingTags: [],
  onbStep: 0,
  orderTab: 'live',
  limitInput: PARENT.limit,
  topupAmount: 10000,
  flow: null,
};

/* ------------------------------------------------------------
   Router
   ------------------------------------------------------------ */
function go(route, param = null) {
  if (!SCREENS[route]) { console.warn('Unknown route:', route); route = ['home', order[0]].find(k => SCREENS[k]) || order[0]; }
  APP.route = route; APP.param = param; APP.sheet = null;
  if (SCREENS[route].nav) APP.tab = SCREENS[route].nav;
  if (location.hash.replace('#', '') !== route) history.replaceState(null, '', '#' + route);
  paint();
}

function paint() {
  const s = SCREENS[APP.route];
  const dev = s.dev || 'phone';          // phone unless a screen opts out
  const isPhone = dev === 'phone';

  document.getElementById('screenName').textContent = s.name;
  document.getElementById('screenNote').textContent = s.note || '';
  markRail();

  const frameW = s.w  || (isPhone ? 390 : dev === 'tablet' ? 1024 : 1440);
  const frameH = s.h  || (isPhone ? 844 : dev === 'tablet' ? 768 : 900);

  const status = isPhone ? `
    <div class="notch"></div>
    <div class="statusbar">
      <span>11:38</span>
      <span class="sig">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 10.6 9.9 8.5a2.8 2.8 0 0 0-3.8 0L8 10.6Z"/><path d="M3.6 5.2a6.6 6.6 0 0 1 8.8 0l1.3-1.4a8.5 8.5 0 0 0-11.4 0l1.3 1.4Z" opacity=".95"/><path d="M.6 2.1a10.5 10.5 0 0 1 14.8 0l1.3-1.4a12.4 12.4 0 0 0-17.4 0L.6 2.1Z" opacity=".95"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3.2" stroke="currentColor" opacity=".38"/><rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor"/><path d="M23 4.2v3.6a2 2 0 0 0 0-3.6Z" fill="currentColor" opacity=".4"/></svg>
      </span>
    </div>` : '';

  const chrome = isPhone ? '' : `
    <div class="chrome">
      <div class="dots"><i></i><i></i><i></i></div>
      <div class="url">${dev === 'tablet' ? 'canteen.amjilt.mn/sambar' : 'admin.amjilt.mn'}</div>
    </div>`;

  document.getElementById('stage').innerHTML = `
    <div class="device ${isPhone ? '' : 'bare'}" style="width:${frameW}px;height:${frameH}px">
      ${status}${chrome}
      <div class="screen anim-in" id="screen">${s.render(APP.param)}</div>
      <div id="overlay"></div>
    </div>`;

  const sc = document.querySelector('#screen .scroll');
  if (sc) sc.scrollTop = 0;
  if (s.after) s.after(APP.param);
  paintOverlay();
  fitFrame();
}

/* Scale large console frames down so a 1440px dashboard is reviewable
   on a laptop screen without horizontal scrolling. */
function fitFrame() {
  const dev = document.querySelector('#stage .device');
  const view = document.querySelector('.view');
  if (!dev || !view) return;
  if (document.body.classList.contains('export')) {   // capture at exact size
    dev.style.transform = 'none'; dev.style.marginBottom = '0';
    return;
  }
  dev.style.transform = 'none';
  const cs = getComputedStyle(view);
  const availW = view.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const availH = window.innerHeight - 190;
  const w = dev.offsetWidth, h = dev.offsetHeight;
  const k = Math.min(1, availW / w, availH / h);
  dev.style.transformOrigin = 'top center';
  dev.style.transform = k < 1 ? `scale(${k.toFixed(4)})` : 'none';
  dev.style.marginBottom = k < 1 ? `${-(1 - k) * h}px` : '0';
}
window.addEventListener('resize', fitFrame);

/* ------------------------------------------------------------
   Overlay (sheets) — repainted independently so the scroll
   position of the screen underneath is never lost.
   ------------------------------------------------------------ */
function paintOverlay() {
  const ov = document.getElementById('overlay');
  if (!ov) return;
  const s = SCREENS[APP.route];
  if (!APP.sheet) { ov.innerHTML = ''; return; }
  const body = s.sheet ? s.sheet(APP.sheet, APP.param) : null;
  if (!body) { APP.sheet = null; ov.innerHTML = ''; return; }
  ov.innerHTML = body.html;
  if (body.after) body.after();
}
const openSheet  = (id) => { APP.sheet = id; paintOverlay(); };
const closeSheet = ()   => { APP.sheet = null; paintOverlay(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

/* ------------------------------------------------------------
   Rail
   ------------------------------------------------------------ */
function paintRail() {
  const groups = {};
  order.forEach(k => { (groups[SCREENS[k].group] ||= []).push(k); });
  document.getElementById('rail').innerHTML = Object.entries(groups).map(([g, keys]) => `
    <div class="rail-group"><h4>${g}</h4></div>
    ${keys.map(k => `<button class="rail-item" data-k="${k}" onclick="go('${k}')">
      <span class="n">${keys.indexOf(k) + 1}</span>${SCREENS[k].name}
    </button>`).join('')}`).join('');
}
function markRail() {
  document.querySelectorAll('.rail-item').forEach(b =>
    b.classList.toggle('on', b.dataset.k === APP.route));
}

/* ------------------------------------------------------------
   Shared actions
   ------------------------------------------------------------ */
function toggleFav(id, el) {
  const i = STATE.favorites.indexOf(id);
  if (i >= 0) STATE.favorites.splice(i, 1); else STATE.favorites.push(id);
  if (el) el.classList.toggle('on', STATE.favorites.includes(id));
  if (APP.route.startsWith('fav')) go('fav');
}
function quickAdd(id, el) {
  const it = CART.items.find(i => i.id === id);
  if (it) it.qty++;
  else CART.items.push({ id, qty: 1 });
  el.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(.82)' }, { transform: 'scale(1)' }],
    { duration: 240, easing: 'cubic-bezier(.32,.72,0,1)' });
}
function setQty(id, d) {
  const it = CART.items.find(i => i.id === id); if (!it) return;
  it.qty += d;
  if (it.qty <= 0) CART.items = CART.items.filter(i => i.id !== id);
  go(APP.route, APP.param);
}
function pickSlot(i) { if (slotState(SLOTS[i]) === 'full') return; APP.slot = i; go(APP.route); }
function setCat(c)   { APP.cat = c; go(APP.route); }

function doPay() {
  APP.payState = 'processing'; go('payment');
  setTimeout(() => {
    APP.payState = 'success';
    const bal = WALLET.balance - cartSubtotal();
    CART.items.forEach(i => WALLET.tx.unshift({ amt: -MENU.find(m => m.id === i.id).price * i.qty, label: MENU.find(m => m.id === i.id).name, when: 'Өнөөдөр · 11:40', kind: 'order', id: 'A1024' }));
    WALLET.balance = bal;
    go('success');
  }, 1500);
}
function advanceOrder() {
  const order = ['queued', 'preparing', 'ready', 'collected'];
  const i = order.indexOf(APP.orderStatus);
  if (i < order.length - 1) { APP.orderStatus = order[i + 1]; go(APP.route); }
}
function resetAll() {
  APP.slot = SELECTED_SLOT; APP.cat = 'all'; APP.search = ''; APP.allergensFilter = [];
  APP.favoritesOnly = false; APP.payState = 'idle'; APP.qrState = 'valid';
  APP.orderStatus = 'preparing'; APP.rating = 0; APP.ratingTags = [];
  APP.sheet = null; APP.flow = null;
  go('home');
}

/* ------------------------------------------------------------
   Prototype flow — the critical spine (§11)
   ------------------------------------------------------------ */
const FLOW = [
  'onb1', 'onb2', 'onb3', 'onb4', 'login', 'home', 'food',
  'cart', 'queue', 'payment', 'success', 'track', 'qr',
];
function flowStart() { APP.flow = 0; stepFlow(); }
function stepFlow() {
  if (APP.flow == null) return;
  const r = FLOW[APP.flow];
  if (APP.flow >= FLOW.length) { APP.flow = null; return; }
  APP.flow++;
  if (r === 'payment') { APP.payState = 'processing'; }
  go(r);
  if (r === 'payment') setTimeout(() => { if (APP.flow) { APP.payState = 'success'; stepFlow(); } }, 1500);
}
function flowStop() { APP.flow = null; }

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  try {
    if (location.search.indexOf('export') > -1) document.body.classList.add('export');
    if (!order.length) throw new Error('No screens defined — check that screens-*.js loaded and defineScreen() was in scope.');
    if (!SCREENS[APP.route]) APP.route = ['onb1', 'home'].find(k => SCREENS[k]) || order[0];
    const h = location.hash.replace('#', '');
    if (h && SCREENS[h]) APP.route = h;
    paintRail();
    paint();
  } catch (e) { fatal('Эхлүүлэлт', e); }
});

/* Deep links: index.html#queue opens that screen directly. */
window.addEventListener('hashchange', () => {
  const h = location.hash.replace('#', '');
  if (SCREENS[h] && h !== APP.route) go(h);
});
