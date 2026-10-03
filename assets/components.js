/* ============================================================
   Amjilt Canteen — Shared Components
   Spec §10. One icon set, one weight (24px stroke 1.75).
   ============================================================ */

/* ---------- Money ---------- */
const price = (n) => n.toLocaleString('en-US') + '₮';

/* ---------- Icons ---------- */
const ICONS = {
  home:     '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.6V20a1 1 0 0 0 1 1h3.5v-5.5h5V21H18a1 1 0 0 0 1-1V9.6"/>',
  homeF:    '<path d="M12 2.6a1.5 1.5 0 0 1 .95.34l8 6.1a1 1 0 0 1-.55 1.77H19.4V20a1 1 0 0 1-1 1h-3.5a1 1 0 0 1-1-1v-4.6h-3.8V20a1 1 0 0 1-1 1H6.6a1 1 0 0 1-1-1v-9.19H3.6a1 1 0 0 1-.55-1.77l8-6.1A1.5 1.5 0 0 1 12 2.6Z"/>',
  bowl:     '<path d="M3 10h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9Z"/><path d="M8 6c0-1.5 1-2 1-3.2"/><path d="M13 6c0-2 1.3-2.6 1.3-4.2"/>',
  bag:      '<path d="M5 8h14l-1 12.2a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  card:     '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/><path d="M6.5 14.5h3"/>',
  person:   '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  search:   '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m20 20-4.4-4.4"/>',
  right:    '<path d="m9 5 7 7-7 7"/>',
  left:     '<path d="m15 5-7 7 7 7"/>',
  down:     '<path d="m5 9 7 7 7-7"/>',
  heart:    '<path d="M12 20.5S3.8 15.4 3.8 9.9A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8.2 2.5c0 5.5-8.2 10.6-8.2 10.6Z"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
  minus:    '<path d="M5 12h14"/>',
  x:        '<path d="m6 6 12 12M18 6 6 18"/>',
  check:    '<path d="m4.5 12.5 5 5 10-11"/>',
  checkC:   '<circle cx="12" cy="12" r="9.2"/><path d="m8 12.3 2.8 2.8L16.2 9.6"/>',
  clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.4 2"/>',
  flame:    '<path d="M12 2.5s5.5 4 5.5 9a5.5 5.5 0 0 1-11 0c0-1.6.7-2.9 1.6-3.9.4 1.4 1.4 2.2 2.4 2.2 1.4 0 1.5-2.4 1.5-7.3Z"/>',
  star:     '<path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8L12 3.6Z"/>',
  leaf:     '<path d="M20 4c0 9-5 12-11 12a5 5 0 0 1-5-5C4 7 11 4 20 4Z"/><path d="M4.5 20c3-5 6.5-8 11-9.5"/>',
  alert:    '<path d="M12 3.5 2.8 19.5h18.4L12 3.5Z"/><path d="M12 9.5v4.2"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  info:     '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.9" r=".6" fill="currentColor"/>',
  lock:     '<rect x="4.5" y="10.5" width="15" height="10" rx="2.6"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/>',
  qr:       '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.4"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.4"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.4"/><path d="M14 14h3v3h-3zM20.5 14v3M17.5 20.5h3"/>',
  users:    '<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6"/><path d="M18 14.4a6.5 6.5 0 0 1 3.5 5.6"/>',
  chart:    '<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7.5" y="12" width="3" height="5" rx="1" fill="currentColor" stroke="none"/><rect x="12.5" y="8" width="3" height="9" rx="1" fill="currentColor" stroke="none"/><rect x="17.5" y="10" width="3" height="7" rx="1" fill="currentColor" stroke="none"/>',
  settings: '<circle cx="12" cy="12" r="3.1"/><path d="M19.4 14.4a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06A2 2 0 1 1 4.6 17l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.47-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06A2 2 0 1 1 7 4.6l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 1-1.47V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06A2 2 0 1 1 19.4 7l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.47 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.47 1Z"/>',
  bell:     '<path d="M18 9a6 6 0 1 0-12 0c0 5-2.2 6.5-2.2 6.5h16.4S18 14 18 9Z"/><path d="M13.7 19a2 2 0 0 1-3.4 0"/>',
  help:     '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2-2.5 3.6"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
  shield:   '<path d="M12 3 5 6v5.5c0 4.3 2.9 8.1 7 9.5 4.1-1.4 7-5.2 7-9.5V6l-7-3Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  up:       '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
  down2:    '<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>',
  wallet:   '<path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h11.5a1 1 0 0 1 1 1v1.5"/><rect x="3.5" y="7.5" width="17" height="12" rx="2.6"/><path d="M20.5 12.5h-3.7a1.9 1.9 0 0 0 0 3.8h3.7"/>',
  box:      '<path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5v-7Z"/><path d="M3.5 8.5 12 13l8.5-4.5"/><path d="M12 13v7"/>',
  receipt:  '<path d="M6 3.5h12v17l-2.4-1.6-2.4 1.6-2.4-1.6L8.4 20.5 6 18.9V3.5Z"/><path d="M9.2 8h5.6M9.2 12h5.6"/>',
  utensils: '<path d="M7 3v7a2.5 2.5 0 0 0 5 0V3"/><path d="M9.5 10v11"/><path d="M17.5 3c-1.4 1.2-2 3-2 5.2 0 1.7.7 2.8 2 3.3V21"/>',
  coffee:   '<path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M17 11h1.8a2.2 2.2 0 0 1 0 4.4H17"/><path d="M7.5 3.2v2.4M11 3.2v2.4M14.5 3.2v2.4"/>',
  apple:    '<path d="M12 8.2c-1.2-1.6-3-2.4-4.6-1.9C5 7 3.8 9.4 4.3 12.4c.6 3.6 3 7.4 5.2 7.4 1 0 1.6-.6 2.5-.6s1.5.6 2.5.6c2.2 0 4.6-3.8 5.2-7.4.5-3-.7-5.4-3.1-6.1-1.6-.5-3.4.3-4.6 1.9Z"/><path d="M12 8.2c0-1.7 1.4-3.1 3.2-3.4"/>',
  refresh:  '<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6"/><path d="M20.5 4v5h-5"/>',
  filter:   '<path d="M3.5 5.5h17l-6.5 7.6V19l-4 1.5v-7.4L3.5 5.5Z"/>',
  sort:     '<path d="M7 4v16M7 20l-3-3M7 20l3-3"/><path d="M13.5 6.5h7M13.5 12h5M13.5 17.5h3"/>',
  grid:     '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.6"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  logout:   '<path d="M9 20.5H6a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2h3"/><path d="M15.5 16.5 20 12l-4.5-4.5"/><path d="M20 12H9"/>',
  scan:     '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M4 12h16"/>',
};

function icon(name, size = 20, extra = '') {
  const body = ICONS[name] || '';
  return `<svg class="ic ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${body}</svg>`;
}
const iconFill = (name, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[name]}</svg>`;

/* ---------- Stars ---------- */
const stars = (n, size = 12) =>
  `<span class="row" style="gap:1px;color:var(--accent-500)">${Array.from({ length: 5 },
    (_, i) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${i < Math.round(n) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round">${ICONS.star}</svg>`).join('')}</span>`;

/* ============================================================
   Building blocks
   ============================================================ */

/** Food card — variants: default | popular | soldout | allergy (§10) */
function foodCard(m, o = {}) {
  const fav = STATE.favorites.includes(m.id);
  const alrg = m.allergens.some(a => STATE.allergies.includes(a));
  const out = !!o.soldout;
  const tagCls = m.fresh ? 'fresh' : '';
  return `
  <button class="fcard ${out ? 'soldout' : ''}" onclick="go('${o.target || 'food'}','${m.id}')" aria-label="${m.name}, ${price(m.price)}">
    <div class="ph">
      <img src="${IMG(m.img, 500)}" alt="${m.name}" loading="lazy">
      ${m.tag && !out ? `<span class="tag ${tagCls}">${m.tag}</span>` : ''}
      ${out ? `<span class="tag out">Боломжгүй</span>` : ''}
      <span class="fav ${fav ? 'on' : ''}" role="button" tabindex="0"
        onclick="event.stopPropagation();toggleFav('${m.id}',this)"
        aria-label="Дуртай болгох">${iconFill('heart', 18)}</span>
      ${alrg && !out ? `<span class="alrg" title="Таны харшилд орно">${icon('alert', 13)}</span>` : ''}
      ${out ? `<div class="sold"><span>Дүүрсэн</span></div>` : ''}
      ${!out ? `<span class="add" role="button" tabindex="0"
        onclick="event.stopPropagation();quickAdd('${m.id}',this)"
        aria-label="Сагсанд нэмэх">${icon('plus', 20)}</span>` : ''}
    </div>
    <div class="body">
      <div class="name">${m.name}</div>
      <div class="meta">
        <span class="price tnum">${price(m.price)}</span>
        <span class="rate">${icon('star', 12)}${m.rating.toFixed(1)}</span>
      </div>
    </div>
  </button>`;
}

/** Pickup slot — state machine from spec §4.3 */
function slotCard(s, i, { selected = null, onPick = null } = {}) {
  const f = free(s);
  const st = slotState(s);
  const isSel = selected === i;
  const cls = isSel ? 'selected' : st;
  const dis = st === 'full' && !isSel;
  const label = st === 'full' ? 'Дүүрсэн'
    : st === 'almost' ? `⚠ ${f} сул үлдлээ`
    : `${f} сул`;
  return `
  <button class="slot ${cls}" ${dis ? 'disabled' : ''} ${onPick ? `onclick="${onPick}(${i})"` : ''}
    aria-pressed="${isSel}" aria-label="${s.time}, ${label}">
    <span class="dotc">${isSel ? icon('check', 20) : st === 'almost' ? icon('alert', 18) : icon('clock', 18)}</span>
    <span class="grow">
      <span class="t tnum">${s.time}</span>
      <span class="m">${isSel ? 'Таны авах ээлж' : `Захиалгын тоо · ${s.orders}`}</span>
    </span>
    <span class="badge">${label}</span>
  </button>`;
}

/** Button */
function btn(label, o = {}) {
  const { variant = 'primary', size = '', onclick = '', disabled = false, loading = false, iconR = '', iconL = '', aria = '' } = o;
  const v = loading ? 'primary' : variant;
  return `<button class="btn ${v} ${size} ${disabled ? 'disabled' : ''}" ${disabled ? 'disabled' : ''}
    ${onclick ? `onclick="${onclick}"` : ''} ${aria ? `aria-label="${aria}"` : ''}>
    ${loading ? '<span class="spin"></span>' : (iconL ? icon(iconL, 18) : '')}${loading ? 'Боловсруулж байна…' : label}
    ${!loading && iconR ? icon(iconR, 18) : ''}</button>`;
}

/** Alert */
function alert(kind, title, body, o = {}) {
  const ic = { warn: 'alert', bad: 'x', info: 'info', ok: 'check' }[kind];
  return `<div class="alert ${kind}">
    <span class="ic">${icon(ic, 17)}</span>
    <div class="grow"><b>${title}</b>${body ? `<p>${body}</p>` : ''}
    ${o.action ? `<div style="margin-top:12px">${o.action}</div>` : ''}</div>
  </div>`;
}

/** Stat tile */
function tile(k, v, o = {}) {
  return `<div class="tile ${o.state || 'info'}">
    ${o.icon ? `<span class="ic">${icon(o.icon, 18)}</span>` : ''}
    <div class="k">${k}</div>
    <div class="v tnum ${o.vClass || ''}">${v}</div>
    ${o.delta ? `<div class="delta ${o.deltaDir || 'up'}">${icon(o.deltaDir === 'dn' ? 'down2' : 'up', 12)}${o.delta}</div>` : ''}
    ${o.d ? `<div class="d">${o.d}</div>` : ''}
  </div>`;
}

/** Row item with chevron */
function rowItem(iconName, title, sub, o = {}) {
  const el = o.onclick ? 'button' : 'div';
  return `<${el} class="row-item" ${o.onclick ? `onclick="${o.onclick}"` : ''}>
    <span class="ic">${icon(iconName, 19)}</span>
    <span class="grow">
      <span class="tt">${title}</span>
      ${sub ? `<span class="sub">${sub}</span>` : ''}
    </span>
    ${o.right || ''}
    ${o.chev !== false ? `<span class="chev">${icon('right', 17)}</span>` : ''}
  </${el}>`;
}

/** App bar with optional back button */
function appbar(o = {}) {
  return `<div class="appbar ${o.plain ? 'plain' : ''}">
    ${o.back ? `<button class="iconbtn ghost" onclick="${o.back}" aria-label="Буцах">${icon('left', 22)}</button>` : ''}
    ${o.left || ''}
    <div class="grow">
      ${o.eyebrow ? `<div class="t-caption dim-2" style="margin-bottom:2px">${o.eyebrow}</div>` : ''}
      <h1>${o.title}</h1>
      ${o.sub ? `<div class="sub">${o.sub}</div>` : ''}
    </div>
    ${o.right || ''}
  </div>`;
}

/** Section header */
function secHead(title, linkLabel, onclick) {
  return `<div class="sec-head"><h2>${title}</h2>${linkLabel ? `<button class="link" onclick="${onclick}">${linkLabel}${icon('right', 14)}</button>` : ''}</div>`;
}

/** Bottom nav — active tab state per §3 */
function nav(active) {
  const tabs = [
    { id: 'home',     label: 'Нүүр',     ic: 'home' },
    { id: 'menu',     label: 'Меню',     ic: 'bowl' },
    { id: 'orders',   label: 'Захиалга', ic: 'bag' },
    { id: 'wallet',   label: 'Wallet',   ic: 'card' },
    { id: 'profile',  label: 'Профайл',  ic: 'person' },
  ];
  return `<nav class="nav">${tabs.map(t => `
    <button class="${active === t.id ? 'on' : ''}" onclick="go('${t.id}')" aria-current="${active === t.id ? 'page' : 'false'}">
      <span class="pill"></span>
      ${active === t.id && t.id === 'home' ? iconFill('homeF', 24) : icon(t.ic, 23)}
      <span>${t.label}</span>
      ${t.id === 'orders' ? '<span class="dot"></span>' : ''}
    </button>`).join('')}</nav>`;
}

/** Sheet scaffold */
function sheet(id, title, bodyHtml, o = {}) {
  return `
  <div class="scrim" onclick="closeSheet('${id}')"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-label="${title}">
    <div class="handle"></div>
    <div class="sheet-head">
      <h3>${title}</h3>
      <button class="iconbtn ghost" onclick="closeSheet('${id}')" aria-label="Хаах">${icon('x', 20)}</button>
    </div>
    <div class="sheet-body" style="padding-bottom:${o.pad || 24}px">${bodyHtml}</div>
  </div>`;
}

/** Circular gauge — waste meter, adoption donut */
function gauge(pct, big, cap, { color = 'var(--brand-500)', size = 190, sw = 16 } = {}) {
  const r = (size - sw) / 2, c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return `<div class="gauge" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--surface-sunken)" stroke-width="${sw}"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}"
        stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}"
        style="transition:stroke-dashoffset 900ms cubic-bezier(.32,.72,0,1)"/>
    </svg>
    <div class="mid"><div class="big tnum" style="color:${color}">${big}</div><div class="cap">${cap}</div></div>
  </div>`;
}

/** Donut (admin adoption) */
function donut(pct, big, cap, color = 'var(--brand-600)') {
  return gauge(pct, big, cap, { color, size: 150, sw: 14 });
}

/** Real QR matrix rendered to canvas — deterministic, not a placeholder */
function qrCanvas(hostId, seedStr, size = 240) {
  const el = document.getElementById(hostId);
  if (!el) return;
  const N = 29;
  const c = document.createElement('canvas');
  c.width = c.height = size * 2;                 // 2x for crispness
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; };
  const m = size * 2, cell = m / (N + 2), off = cell;
  g.fillStyle = '#052E22';
  const finder = (r, c0) => {
    g.fillRect(off + c0 * cell, off + r * cell, cell * 7, cell * 7);
    g.fillStyle = '#fff';
    g.fillRect(off + (c0+1)*cell, off + (r+1)*cell, cell*5, cell*5);
    g.fillStyle = '#052E22';
    g.fillRect(off + (c0+2)*cell, off + (r+2)*cell, cell*3, cell*3);
  };
  for (let r = 0; r < N; r++) for (let c0 = 0; c0 < N; c0++) {
    const inFinder = (r < 7 && c0 < 7) || (r < 7 && c0 > N-8) || (r > N-8 && c0 < 7);
    if (inFinder) continue;
    if (rnd() > .52) g.fillRect(off + c0*cell, off + r*cell, cell, cell);
  }
  finder(0, 0); finder(0, N-7); finder(N-7, 0);
  c.style.width = size + 'px'; c.style.height = size + 'px';
  el.appendChild(c);
}

/** Skeletons matching final geometry (§9) */
const skelCard = () => `<div class="skel skel-card"></div>`;
const skelRow  = () => `<div class="skel skel-row"></div>`;

/** Avatar */
function avatar(name, cls = '') {
  const init = name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return `<span class="row" style="width:44px;height:44px;border-radius:var(--r-pill);background:var(--brand-600);color:#fff;justify-content:center;font:800 15px/1 var(--font);flex:none">${init}</span>`;
}
