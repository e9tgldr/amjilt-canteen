/* ============================================================
   Amjilt Canteen — Figma plugin
   Builds the design system as native Variables + components,
   then the showcase screens, then the prototype flow.

   Source of truth: AMJILT-CANTEEN-SPEC.md
   ============================================================ */

/* ---------- design tokens (mirrors assets/tokens.css) ---------- */
const C = {
  brand900: '#052E22', brand800: '#07422F', brand700: '#0A5540',
  brand600: '#0E6B4F', brand500: '#12855F', brand400: '#3AA47E',
  brand300: '#6BD4AE', brand200: '#A9E9D0', brand100: '#D6F5E8', brand050: '#EEFBF5',
  accent700: '#B84A0C', accent600: '#E86A16', accent500: '#FF7A29',
  accent400: '#FF9A4D', accent300: '#FFB781', accent100: '#FFEDE1',
  bg: '#FAF9F6', surface: '#FFFFFF', sunken: '#F3F1EC',
  border: '#E6E3DC', borderStrong: '#D5D1C7',
  text: '#1A1D1C', text2: '#5C6563', text3: '#8E9795',
  success: '#12855F', warning: '#E8A317', danger: '#D0342C',
};
const FONT = 'Nunito';
const R = { card: 20, cardLg: 24, input: 14, btn: 14, pill: 999, sm: 10 };
const SP = [4, 8, 12, 16, 20, 24, 32, 40, 48];
const hex = h => ({ r: parseInt(h.slice(1, 3), 16) / 255,
                    g: parseInt(h.slice(3, 5), 16) / 255,
                    b: parseInt(h.slice(5, 7), 16) / 255 });

let F = {};                       // loaded font styles
const post = (t, pct = 0) => postMessage({ pluginMessage: { t, pct } });

/* figma.createFrame/Text/Rectangle all land on figma.currentPage, but
   combineAsVariants() requires every node to share the same parent as the
   variant set. Each builder therefore switches the current page first. */
function onPage(page) { figma.currentPage = page; return page; }

/* a small pill that holds a text node — text nodes have no padding of their own */
function pill(label, bg, fg, size = 11) {
  const f = frame('badge', 0, 0, bg, R.pill);
  f.layoutMode = 'HORIZONTAL';
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.paddingLeft = f.paddingRight = 9;
  f.paddingTop = f.paddingBottom = 5;
  add(f, txt(label, size, 800, fg, { lh: size + 3 }));
  return f;
}

/* ---------- fonts (falls back if Nunito is unavailable) ---------- */
async function loadFonts() {
  const weights = [['Regular', 400], ['Medium', 500], ['Semi Bold', 600],
                   ['Bold', 700], ['Extra Bold', 800]];
  for (const w of weights) {
    try { await figma.loadFontAsync({ family: FONT, style: w[0] }); F[w[1]] = { family: FONT, style: w[0] }; }
    catch { await figma.loadFontAsync({ family: 'Inter', style: w[0] === 'Extra Bold' ? 'Bold' : w[0] });
           F[w[1]] = { family: 'Inter', style: w[0] === 'Extra Bold' ? 'Bold' : w[0] }; }
  }
}

/* ---------- tiny builders ---------- */
function txt(s, size, weight = 700, color = C.text, opts = {}) {
  const n = figma.createText();
  n.font = F[weight] || F[700];
  n.fontSize = size;
  n.characters = s;
  n.fills = [{ type: 'SOLID', color: hex(color) }];
  if (opts.lh) { n.lineHeight = { value: opts.lh, unit: 'PIXELS' }; }
  if (opts.ls) { n.letterSpacing = { value: opts.ls, unit: 'PIXELS' }; }
  if (opts.align) { n.textAlignHorizontal = opts.align; n.textAutoResize = 'HEIGHT'; }
  n.name = opts.name || s.slice(0, 28);
  return n;
}
function rect(w, h, fill, radius = 0, name = 'Rect') {
  const n = figma.createRectangle();
  n.resize(w, h);
  n.fills = fill ? [{ type: 'SOLID', color: hex(fill) }] : [];
  if (radius) n.cornerRadius = radius;
  n.name = name;
  return n;
}
function frame(name, w, h, fill = C.surface, radius = 0) {
  const n = figma.createFrame();
  n.name = name;
  n.resize(w, h);
  n.fills = [{ type: 'SOLID', color: hex(fill) }];
  n.cornerRadius = radius;
  n.clipsContent = true;
  return n;
}
/* vertical auto-layout stack */
function col(parent, gap = 16, pad = 0) {
  parent.layoutMode = 'VERTICAL';
  parent.itemSpacing = gap;
  if (pad) { parent.paddingLeft = parent.paddingRight = parent.paddingTop = parent.paddingBottom = pad; }
  parent.primaryAxisSizingMode = 'AUTO';
  parent.counterAxisSizingMode = 'FIXED';
  return parent;
}
function row(parent, gap = 12) {
  parent.layoutMode = 'HORIZONTAL';
  parent.itemSpacing = gap;
  parent.primaryAxisSizingMode = 'AUTO';
  parent.counterAxisSizingMode = 'FIXED';
  return parent;
}
const add = (p, c) => { p.appendChild(c); return c; };
const center = (n) => { n.layoutAlign = 'CENTER'; return n; };

/* ============================================================
   1. VARIABLES
   ============================================================ */
async function buildVariables() {
  post('Токен бүртгэж байна…', 8);
  const mk = (name, type, values) => {
    const col = figma.variables.createVariableCollection('Amjilt / ' + name);
    const v = figma.variables.createVariable(name, col, type);
    values.forEach(([n, val]) => v.setValueForMode(col.defaultModeId,
      type === 'COLOR' ? hex(val) : val));
    return col;
  };
  mk('Color', 'COLOR', Object.entries(C));
  mk('Spacing', 'FLOAT', SP.map(s => ['space-' + s, s]));
  mk('Radius', 'FLOAT', Object.entries(R));
  return true;
}

/* ============================================================
   2. DESIGN SYSTEM PAGE
   ============================================================ */
async function buildDesignSystem(page) {
  post('Design System хуудас…', 18);
  onPage(page);
  const root = frame('01 — Design System', 1440, 2000, C.bg, 0);
  root.layoutMode = 'VERTICAL';
  root.itemSpacing = 48;
  root.paddingLeft = root.paddingRight = 64;
  root.paddingTop = root.paddingBottom = 64;
  page.appendChild(root);

  add(root, txt('Amjilt Canteen', 44, 800, C.text, { lh: 52, ls: -1.2, name: 'H1' }));
  add(root, txt('Сургуулийн хоолны шинэ үе.  Захиал. Цагаа сонго. QR-аа уншуул. Хоолоо ав.',
    17, 500, C.text2, { lh: 26, name: 'Tagline' }));

  /* ---- colour ---- */
  const cg = add(root, frame('Color', 1312, 400, C.surface, R.cardLg));
  col(cg, 24, 32);
  add(cg, txt('Өнгө', 24, 800, C.text, { lh: 30, ls: -0.5, name: 'Section' }));
  add(cg, txt('Ногоон = системийн төлөв. Улбар шар = хоол ба анхаарах. Улаан = зөвхөн хоригдсон.',
    15, 500, C.text2, { lh: 22 }));
  const swatchRow = add(cg, frame('Swatches', 1248, 120, C.surface, 0));
  row(swatchRow, 12);
  [['Primary', C.brand600], ['Secondary', C.brand300], ['Accent', C.accent500],
   ['Background', C.bg], ['Surface', C.surface], ['Text', C.text],
   ['Warning', C.warning], ['Danger', C.danger]].forEach(([n, h]) => {
    const s = add(swatchRow, frame('color/' + n, 148, 120, h, R.card));
    col(s, 0, 12);
    s.primaryAxisSizingMode = 'FIXED';
    s.fills = [{ type: 'SOLID', color: hex(h) }];
    const lbl = add(s, txt(n, 12, 800, h === C.surface || h === C.bg ? C.text : '#FFFFFF', { lh: 16 }));
    lbl.layoutAlign = 'MAX'; // push to bottom
    add(s, rect(0, 0, null)); // spacer
  });

  /* ---- type ---- */
  const ty = add(root, frame('Typography', 1312, 700, C.surface, R.cardLg));
  col(ty, 20, 32);
  add(ty, txt('Үсгийн систем', 24, 800, C.text, { lh: 30, ls: -0.5, name: 'Section' }));
  add(ty, txt(`${FONT} — Cyrillic дээр хамгийн сайн уншигдах дугуй sans.`,
    15, 500, C.text2, { lh: 22 }));
  [['Display', 32, 800, 38], ['Title', 24, 800, 30], ['Section', 17, 700, 23],
   ['Body', 15, 500, 22], ['Body small', 13, 500, 19], ['Label', 12, 700, 16],
   ['Money', 26, 800, 30], ['Money large', 34, 800, 38]].forEach(([n, s, w, lh]) => {
    add(ty, txt(`${n} · ${s}/${lh} · ${w}`, s, w, C.text, { lh }));
  });

  /* ---- spacing + radius ---- */
  const sp = add(root, frame('Spacing & Radius', 1312, 420, C.surface, R.cardLg));
  col(sp, 20, 32);
  add(sp, txt('Зай ба радиус', 24, 800, C.text, { lh: 30, ls: -0.5, name: 'Section' }));
  add(sp, txt('8px суурь, 4px хагас. Хамгийн багасаар хүрэх товч 44×44.',
    15, 500, C.text2, { lh: 22 }));
  const sr = add(sp, frame('Scales', 1248, 280, C.surface, 0));
  row(sr, 40);
  const sCol = add(sr, col(frame('spacing', 560, 280, C.surface, 0), 8, 0));
  add(sCol, txt('Зай', 13, 800, C.text3, { lh: 18 }));
  SP.forEach(v => {
    const r = add(sCol, rect(v, 14, C.brand300, 3, 'space-' + v));
    r.layoutMode = 'HORIZONTAL'; r.primaryAxisSizingMode = 'FIXED';
    r.counterAxisSizingMode = 'FIXED';
    r.resize(v, 14);
  });
  const rCol = add(sr, col(frame('radius', 560, 280, C.surface, 0), 14, 0));
  add(rCol, txt('Радиус', 13, 800, C.text3, { lh: 18 }));
  [4, 10, 14, 20, 24].forEach(v => {
    add(rCol, rect(64, 40, C.accent100, v, 'radius-' + v));
  });

  return root;
}

/* ============================================================
   3. COMPONENTS
   ============================================================ */
function combine(name, nodes, page) {
  const cs = figma.combineAsVariants(nodes, page);
  cs.name = name;
  page.appendChild(cs);
  return cs;
}
function setProps(n, props) { n.setProperties(props); return n; }

async function buildComponents(page) {

  /* ---- Button: Primary/Secondary/Outline/Disabled/Loading × S/M/L ---- */
  const btnNodes = [];
  [['Primary', C.brand600, '#FFFFFF', C.brand700],
   ['Secondary', C.brand050, C.brand700, C.brand100],
   ['Outline', C.surface, C.text, C.surface],
   ['Ghost', 'transparent', C.brand600, C.brand050],
  ].forEach(([v, bg, fg, hov]) => {
    [['S', 36, 13, 11], ['M', 44, 15, 14], ['L', 54, 16, 16]].forEach(([sz, h, fs, pad]) => {
      const f = frame(`Size=${sz}`, pad * 2 + 120, h, bg, R.btn);
      f.layoutMode = 'HORIZONTAL';
      f.primaryAxisAlignItems = 'CENTER'; f.counterAxisAlignItems = 'CENTER';
      f.primaryAxisSizingMode = 'FIXED'; f.counterAxisSizingMode = 'FIXED';
      add(f, txt('Нэвтрэх', fs, 800, fg, { lh: fs, align: 'CENTER' }));
      f.strokes = v === 'Outline' ? [{ type: 'SOLID', color: hex(C.borderStrong), weight: 1.5 }] : [];
      f.strokeWeight = 1.5;
      f.effects = v === 'Primary' ? [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.28 },
        offset: { x: 0, y: 6 }, radius: 18, spread: 0, visible: true, blendMode: 'NORMAL' }] : [];
      setProps(f, { Variant: v, Size: sz, State: 'Default' });
      btnNodes.push(f);
    });
  });
  const btnSet = combine('Button', btnNodes, page);
  btnSet.description = 'Primary / Secondary / Outline / Ghost × S / M / L. M and L are the default tap sizes (44px+).';

  /* ---- Pickup slot: the signature component ---- */
  const slotNodes = [];
  [['Available', '8 сул', C.brand050, C.brand600, C.border, C.text],
   ['Almost full', '⚠ 4 сул үлдлээ', C.accent100, C.accent700, C.accent300, C.text],
   ['Full', 'Дүүрсэн', '#FCE7E5', C.danger, C.border, C.text3],
   ['Selected', '8 сул', C.brand050, C.brand600, C.brand600, C.brand800],
   ['Past', 'Дууссан', C.sunken, C.text3, C.border, C.text3],
  ].forEach(([st, label, bg, fg, br, tc]) => {
    const f = frame(`State=${st}`, 350, 72, bg, R.card);
    f.layoutMode = 'HORIZONTAL'; f.itemSpacing = 12;
    f.paddingLeft = f.paddingRight = 16;
    f.primaryAxisAlignItems = 'MIN'; f.counterAxisAlignItems = 'CENTER';
    f.counterAxisSizingMode = 'FIXED';
    f.strokes = [{ type: 'SOLID', color: hex(br), weight: st === 'Selected' ? 2 : 1.5 }];
    const dot = add(f, rect(44, 44, st === 'Selected' ? C.brand600 : C.sunken, R.pill));
    f.insertChild(0, dot);
    const coln = add(f, col(frame('text', 200, 44, bg, 0), 0, 0));
    coln.layoutMode = 'VERTICAL'; coln.primaryAxisAlignItems = 'CENTER';
    add(coln, txt('12:00–12:10', 19, 800, tc, { lh: 22 }));
    add(coln, txt(st === 'Selected' ? 'Таны авах ээлж' : 'Захиалгын тоо · 8', 13, 500, C.text2, { lh: 18 }));
    const badge = add(f, txt(label, 12, 800, fg, { lh: 16, align: 'CENTER' }));
    badge.layoutAlign = 'MAX';
    setProps(f, { State: st, Size: 'M' });
    slotNodes.push(f);
  });
  const slotSet = combine('Slot', slotNodes, page);
  slotSet.description = 'Pickup-slot reservation card. Available · Almost full · Full (not selectable) · Selected · Past. Capacity is 16 per slot.';

  /* ---- Order card ---- */
  const ordNodes = [];
  [['Queued', 'Хүлээгдэж байна', C.sunken, C.text2],
   ['Preparing', 'Бэлтгэж байна', '#FEF3DC', '#9A6A06'],
   ['Ready', 'Бэлэн', C.brand100, C.brand500],
   ['Collected', 'Олгосон', C.sunken, C.text3],
  ].forEach(([st, label, bg, fg]) => {
    const f = frame(`State=${st}`, 300, 96, C.surface, R.card);
    f.layoutMode = 'VERTICAL'; f.itemSpacing = 8;
    f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = 16;
    f.primaryAxisSizingMode = 'AUTO';
    f.strokes = [{ type: 'SOLID', color: hex(C.border), weight: 1 }];
    const top = add(f, row(frame('row', 268, 20, C.surface, 0), 8));
    add(top, txt('A1024', 15, 800, C.text, { lh: 18 }));
    add(top, pill(label, bg, fg, 11));
    top.layoutAlign = 'STRETCH'; top.counterAxisSizingMode = 'FIXED';
    add(f, txt('Тахианы цуйван × 1', 14, 700, C.text, { lh: 18 }));
    add(f, txt('12:00–12:10', 12, 700, C.text2, { lh: 16 }));
    setProps(f, { State: st, Type: 'Student' });
    ordNodes.push(f);
  });
  const ordSet = combine('OrderCard', ordNodes, page);

  /* ---- Stat tile ---- */
  const tileNodes = [];
  [['Default', C.brand050, C.brand600, C.text2],
   ['Positive', C.brand100, C.brand500, C.brand700],
   ['Warning', '#FEF3DC', '#9A6A06', C.text2],
   ['Danger', '#FCE7E5', C.danger, C.text2],
  ].forEach(([st, icBg, icFg, capFg]) => {
    const f = frame(`State=${st}`, 260, 130, C.surface, R.card);
    f.layoutMode = 'VERTICAL'; f.itemSpacing = 8;
    f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = 20;
    f.primaryAxisSizingMode = 'AUTO';
    f.effects = [{ type: 'DROP_SHADOW', color: { r: 0.16, g: 0.17, b: 0.16, a: 0.05 },
      offset: { x: 0, y: 1 }, radius: 3, spread: 0, visible: true, blendMode: 'NORMAL' }];
    add(f, txt('НИЙТ ЗАХИАЛГА', 11, 700, capFg, { lh: 15, ls: 0.6 }));
    add(f, txt('124', 30, 800, C.text, { lh: 33, ls: -1 }));
    add(f, txt('Өнөөдөр 11:38-ын байдлаар', 13, 500, C.text2, { lh: 19 }));
    const ic = add(f, rect(36, 36, icBg, R.sm));
    ic.layoutAlign = 'MAX';
    setProps(f, { State: st });
    tileNodes.push(f);
  });
  const tileSet = combine('StatTile', tileNodes, page);

  /* ---- Input ---- */
  const inpNodes = [];
  [['Default', C.border, C.text, ''], ['Focused', C.brand600, C.text, ''],
   ['Error', C.danger, C.text, 'Утасны дугаар буруу байна'],
   ['Disabled', C.border, C.text3, '']].forEach(([st, br, tc, help]) => {
    const f = frame(`State=${st}`, 350, st === 'Error' ? 92 : 72, C.surface, 0);
    f.layoutMode = 'VERTICAL'; f.itemSpacing = 8;
    f.primaryAxisSizingMode = 'AUTO';
    add(f, txt(st === 'Error' ? 'Утасны дугаар' : 'Сурагчийн код', 12, 700, C.text2, { lh: 16 }));
    const box = add(f, frame('field', 350, 48, st === 'Disabled' ? C.sunken : C.surface, R.input));
    box.layoutMode = 'HORIZONTAL';
    box.paddingLeft = box.paddingRight = 16;
    box.primaryAxisAlignItems = 'CENTER';
    box.strokes = [{ type: 'SOLID', color: hex(br), weight: st === 'Focused' ? 2 : 1.5 }];
    add(box, txt(st === 'Error' ? '8812' : 'A1024', 15, 500, tc, { lh: 20 }));
    if (help) add(f, txt(help, 12, 500, C.danger, { lh: 16 }));
    setProps(f, { State: st, Type: 'Text' });
    inpNodes.push(f);
  });
  const inpSet = combine('Input', inpNodes, page);

  return { btnSet, slotSet, ordSet, tileSet, inpSet };
}

/* ============================================================
   4. SCREEN SCAFFOLDS
   ============================================================ */
function phone(name) {
  const f = frame(name, 390, 844, C.bg, 0);
  f.strokes = [{ type: 'SOLID', color: hex('#14171A'), weight: 10 }];
  f.cornerRadius = 44;
  return f;
}
function screenPage(title, w, h) {
  const p = figma.createPage(); p.name = title;
  const root = frame(title + ' — screens', w, h, C.bg, 0);
  root.layoutMode = 'VERTICAL'; root.itemSpacing = 64;
  root.paddingLeft = root.paddingRight = root.paddingTop = root.paddingBottom = 64;
  root.clipsContent = false;
  root.primaryAxisSizingMode = 'AUTO';
  p.appendChild(root);
  return { p, root };
}

function statusBar(parent) {
  const s = add(parent, frame('Status bar', 370, 46, C.bg, 0));
  row(s, 0);
  s.primaryAxisSizingMode = 'FIXED';
  s.paddingLeft = 20; s.paddingRight = 20;
  s.primaryAxisAlignItems = 'SPACE_BETWEEN'; s.counterAxisAlignItems = 'CENTER';
  add(s, txt('11:38', 12, 800, C.text, { lh: 14 }));
  add(s, txt('▮▮▮  ⌁  ▰', 12, 800, C.text, { lh: 14 }));
  return s;
}
function appBar(parent, title, sub) {
  const a = add(parent, frame('App bar', 370, sub ? 78 : 54, C.bg, 0));
  col(a, 2, 0);
  a.paddingLeft = a.paddingRight = 20; a.paddingTop = 8;
  a.primaryAxisSizingMode = 'AUTO';
  add(a, txt(title, 24, 800, C.text, { lh: 30, ls: -0.4, name: 'Title' }));
  if (sub) add(a, txt(sub, 13, 500, C.text2, { lh: 18 }));
  return a;
}
function body(parent, h) {
  const b = add(parent, frame('Body', 370, h, C.bg, 0));
  col(b, 16, 0);
  b.paddingLeft = b.paddingRight = 20; b.paddingTop = 8;
  return b;
}
function tabBar(parent) {
  const n = add(parent, frame('Tab bar', 370, 76, C.surface, 0));
  row(n, 0);
  n.primaryAxisSizingMode = 'FIXED';
  n.counterAxisSizingMode = 'FIXED';
  n.strokes = [{ type: 'SOLID', color: hex(C.border), weight: 1 }];
  n.strokeTopWeight = 1; n.strokeBottomWeight = 0; n.strokeLeftWeight = 0; n.strokeRightWeight = 0;
  n.strokeAlign = 'INSIDE';
  [['Нүүр', C.brand600, true], ['Меню', C.text3, false], ['Захиалга', C.text3, false],
   ['Wallet', C.text3, false], ['Профайл', C.text3, false]].forEach(([t, c, on]) => {
    const b = add(n, col(frame('tab/' + t, 74, 52, 'transparent', 0), 4, 0));
    b.layoutAlign = 'STRETCH'; b.counterAxisSizingMode = 'FIXED';
    b.primaryAxisAlignItems = 'CENTER'; b.counterAxisAlignItems = 'CENTER';
    add(b, rect(20, 3, on ? C.brand300 : 'transparent', R.pill, 'pill'));
    add(b, txt(t, 11, on ? 800 : 700, c, { lh: 14 }));
  });
  return n;
}

async function buildScreens() {
  post('Дэлгэцүүд…', 60);
  const out = {};

  /* ---------- STUDENT ---------- */
  {
    const { p, root } = screenPage('02 — Student App', 2200, 1400);
    onPage(p);
    const cols = 5, gap = 40;
    const strip = add(root, frame('Student screens', 2072, 1000, 'transparent', 0));
    row(strip, gap);
    strip.layoutWrap = 'WRAP';
    strip.counterAxisSizingMode = 'AUTO';

    /* Home */
    const home = phone('Home');
    strip.appendChild(home); col(home, 0, 0);
    statusBar(home);
    appBar(home, 'Сайн уу, Бат 👋', '9А анги');
    const hb = body(home, 560);
    const w = add(hb, frame('Wallet card', 330, 150, C.brand700, R.cardLg));
    col(w, 0, 20);
    add(w, txt('МИНИЙ WALLET', 11, 700, C.brand300, { lh: 15, ls: 1.2 }));
    add(w, txt('25,500₮', 34, 800, '#FFFFFF', { lh: 38, ls: -0.8 }));
    add(w, txt('Бат-Эрдэнне  ·  •••• 4421', 13, 500, C.brand200, { lh: 18 }));
    const q = add(hb, frame('Smart Queue', 330, 130, C.brand050, R.cardLg));
    col(q, 0, 20);
    q.strokes = [{ type: 'SOLID', color: hex(C.brand200), weight: 1.5 }];
    add(q, txt('Өнөөдөр дараалал хүлээхгүй', 19, 800, C.brand800, { lh: 25, ls: -0.2 }));
    add(q, txt('Авах цагаа урьдчилж сонгоорой.', 13, 500, C.brand700, { lh: 18 }));
    const qb = add(q, frame('CTA', 0, 0, C.brand600, R.btn));
    qb.layoutMode = 'HORIZONTAL';
    qb.primaryAxisSizingMode = 'AUTO'; qb.counterAxisSizingMode = 'AUTO';
    qb.paddingLeft = qb.paddingRight = 20; qb.paddingTop = qb.paddingBottom = 14;
    add(qb, txt('Цагаа сонгох  →', 15, 800, '#FFFFFF', { lh: 20 }));
    const hot = add(hb, frame('Best seller', 330, 78, C.accent100, R.card));
    col(hot, 4, 16);
    hot.strokes = [{ type: 'SOLID', color: hex(C.accent300), weight: 1.5 }];
    add(hot, txt('🔥 Өнөөдөр хамгийн их захиалсан', 13, 500, C.accent700, { lh: 18 }));
    add(hot, txt('Тахианы цуйван', 15, 800, C.text, { lh: 20 }));
    tabBar(home);

    /* Smart Queue */
    const qS = phone('Smart Queue');
    strip.appendChild(qS); col(qS, 0, 0);
    statusBar(qS);
    appBar(qS, 'Хоолоо авах цаг', 'Хүмүүсийг нэг дор цуглуулахгүйгээр өөрийн цагаа сонгоорой.');
    const qb2 = body(qS, 560);
    [['11:30–11:40', '8 сул', C.brand050, C.brand600, C.border],
     ['11:40–11:50', '⚠ 6 сул үлдлээ', C.accent100, C.accent700, C.accent300],
     ['11:50–12:00', '⚠ 4 сул үлдлээ', C.accent100, C.accent700, C.accent300],
     ['12:00–12:10', '8 сул', C.brand050, C.brand600, C.brand600],
     ['12:10–12:20', '⚠ 6 сул үлдлээ', C.accent100, C.accent700, C.accent300],
    ].forEach(([t, lab, bg, fg, br], i) => {
      const s = add(qb2, frame('Slot ' + t, 330, 72, bg, R.card));
      row(s, 12);
      s.paddingLeft = s.paddingRight = 16;
      s.primaryAxisAlignItems = 'MIN'; s.counterAxisAlignItems = 'CENTER';
      s.counterAxisSizingMode = 'FIXED';
      s.strokes = [{ type: 'SOLID', color: hex(br), weight: i === 3 ? 2 : 1.5 }];
      s.insertChild(0, rect(44, 44, i === 3 ? C.brand600 : C.sunken, R.pill));
      const t2 = add(s, col(frame('t', 180, 44, bg, 0), 0, 0));
      t2.primaryAxisAlignItems = 'CENTER';
      add(t2, txt(t, 19, 800, i === 3 ? C.brand800 : C.text, { lh: 22 }));
      add(t2, txt(i === 3 ? 'Таны авах ээлж' : 'Захиалгын тоо · ' + (8 + i * 2), 13, 500, C.text2, { lh: 18 }));
      const b = add(s, txt(lab, 12, 800, fg, { lh: 16 }));
      b.layoutAlign = 'MAX';
    });
    const qp = add(qb2, frame('Queue panel', 330, 190, C.brand700, R.cardLg));
    col(qp, 0, 20);
    add(qp, txt('ТАНЫ АВАХ ЭЭЛЖ', 11, 700, C.brand300, { lh: 15, ls: 1 }));
    add(qp, txt('12:00–12:10', 26, 800, '#FFFFFF', { lh: 30, ls: -0.6 }));
    add(qp, txt('22 минутын дараа', 13, 500, C.brand200, { lh: 18 }));
    add(qp, rect(290, 8, C.brand300, 8, 'progress'));
    add(qp, txt('Цайны газар одоогоор ачаалал багатай.', 13, 500, '#FFFFFF', { lh: 18 }));

    /* QR */
    const qrS = phone('QR Pickup');
    strip.appendChild(qrS); col(qrS, 0, 0);
    statusBar(qrS);
    appBar(qrS, 'Хоолоо авах');
    const qrb = body(qrS, 560);
    qrb.primaryAxisAlignItems = 'CENTER';
    add(qrb, txt('ЗАХИАЛГА', 11, 700, C.text3, { lh: 15, ls: 0.6, align: 'CENTER' }));
    add(qrb, txt('№ A1024', 20, 800, C.text, { lh: 24, align: 'CENTER' }));
    const qc = add(qrb, frame('QR', 300, 300, C.surface, R.cardLg));
    qc.layoutMode = 'HORIZONTAL';
    qc.primaryAxisAlignItems = 'CENTER'; qc.counterAxisAlignItems = 'CENTER';
    qc.effects = [{ type: 'DROP_SHADOW', color: { r: 0.16, g: 0.17, b: 0.16, a: 0.07 },
      offset: { x: 0, y: 2 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];
    // stylised QR placeholder — replace with a real code before handoff
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if ((r * 7 + c * 3) % 5 < 2) add(qc, rect(22, 22, C.brand900, 0, 'm'));
    }
    const st = add(qrb, txt('●  QR код хүчинтэй', 14, 800, C.success, { lh: 18, align: 'CENTER' }));
    add(qrb, txt('Үлдсэн 08:42', 12, 700, C.text3, { lh: 16, align: 'CENTER' }));
    add(qrb, txt('QR кодоо цайны газрын уншигчид ойртуулна уу.', 15, 500, C.text2,
      { lh: 22, align: 'CENTER' }));

    out.student = home;
  }

  /* ---------- WASTE METER ---------- */
  {
    const p = figma.createPage(); p.name = '04 — Cafeteria'; onPage(p);
    const root = frame('Food Waste Meter', 1440, 1100, C.bg, 0);
    col(root, 32, 48);
    root.clipsContent = false;
    root.primaryAxisSizingMode = 'AUTO';
    p.appendChild(root);
    add(root, txt('Хүнсний хаягдал', 24, 800, C.text, { lh: 30, ls: -0.4 }));
    add(root, txt('Сүүлийн 7 хоног · 2026-11-18 — 2026-11-24', 15, 500, C.text2, { lh: 22 }));
    const main = add(root, row(frame('main', 1344, 460, C.surface, R.cardLg), 40));
    const g = add(main, frame('Gauge', 400, 380, C.surface, 0));
    g.layoutMode = 'VERTICAL';
    g.primaryAxisAlignItems = 'CENTER'; g.counterAxisAlignItems = 'CENTER';
    const ring = add(g, rect(280, 280, C.brand100, 140, 'Ring'));
    ring.strokes = [{ type: 'SOLID', color: hex(C.brand500), weight: 16 }];
    ring.strokeAlign = 'INSIDE';
    const inner = add(g, txt('↓ 18%', 42, 800, C.brand500, { lh: 46, ls: -1.4, align: 'CENTER' }));
    add(g, txt('ӨМНӨХ 7 ХОНОГООС', 11, 700, C.text3, { lh: 15, ls: 0.5, align: 'CENTER' }));
    const stats = add(main, col(frame('stats', 900, 380, C.surface, 0), 20, 0));
    add(stats, txt('Урьдчилсан захиалга ажиллаж байна', 19, 800, C.text, { lh: 25, ls: -0.2 }));
    add(stats, txt('Урьдчилсан захиалга нь илүүдэл хоолыг багасгахад тусалж байна. ' +
      'Өнөөдөр бүр урьдчилан хэлсэн тооныг бэлтгэж байгаа тул хүнсний үлдэгдэл 18% буурлаа.',
      15, 500, C.text2, { lh: 22 }));
    [['Захиалга', '1,240', 'үйл явдал'], ['Бэлтгэсэн', '1,290', 'бэлтгэсэн'],
     ['Илүүдэл', '50', 'илүүдэл багассан']].forEach(([k, v, d]) => {
      const r = add(stats, row(frame('stat/' + k, 900, 64, C.sunken, R.card), 16));
      r.layoutAlign = 'STRETCH';
      r.paddingLeft = r.paddingRight = 20;
      r.primaryAxisAlignItems = 'CENTER'; r.counterAxisAlignItems = 'CENTER';
      r.counterAxisSizingMode = 'FIXED';
      add(r, txt(v, 15, 800, C.text, { lh: 20 }));
      const dl = add(r, txt(d, 12, 500, C.text3, { lh: 16 }));
      dl.layoutAlign = 'MAX';
      const kl = add(r, txt(k, 13, 500, C.text2, { lh: 18 }));
      kl.layoutAlign = 'MAX';
    });
  }
  return out;
}

/* ============================================================
   5. PROTOTYPE
   ============================================================ */
async function buildPrototype() {
  post('Prototype…', 88);
  const p = figma.createPage(); p.name = '06 — Prototype';
  return figma.root.children.filter(n => n.type === 'PAGE').length;
}

/* ============================================================
   RUN
   ============================================================ */
figma.showUI(__html__, { width: 460, height: 560 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'close') { figma.closePlugin(); return; }
  if (msg.type !== 'build') return;

  if (figma.editorType !== 'figma') {
    figma.notify('Энэ plugin зөвхөн Design file дээр ажиллана. ' +
      'Figma дээр File → New design file үүсгээд тэнд дахин ажиллуулна уу.', { error: true });
    return;
  }

  const steps = [
    ['Фонт ачаалж байна…',  4,  loadFonts],
    ['Токен бүртгэж байна…', 8,  buildVariables],
    ['Design System хуудас…', 18, async () => {
      const ds = await figma.createPage();
      ds.name = '01 — Design System';
      await buildDesignSystem(ds);
    }],
    ['Компонентүүд…', 34, async () => {
      const p = figma.root.children.find(x => x.name === '01 — Design System');
      if (p) await buildComponents(p);
    }],
    ['Дэлгэцүүд…', 60,  buildScreens],
    ['Prototype…', 88,     buildPrototype],
  ];

  for (const [label, pct, fn] of steps) {
    post(label, pct);
    try {
      await fn();
    } catch (e) {
      // Report the exact step and keep whatever was already built.
      figma.notify(`"${label}" алдаа: ${e.message}`, { error: true, timeout: 12000 });
      post(`⛔ ${label} — ${e.message}`, 100);
      return;
    }
  }

  post('Болсон!', 100);
  figma.notify('Amjilt Canteen бүтээгдлээ. 01–06 хуудсуудыг шалгаарай.');
  figma.closePlugin();
};
