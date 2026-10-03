/* Amjilt Canteen — Student + Parent mobile screens.
   Onboarding · Login · Student (menu→rate) · States gallery · Parent.
   Reads assets/data.js, assets/components.js, assets/app.js. Adds no CSS.
   Signatures: defineScreen() from app.js, components from components.js. */

/* ============================================================
   Shared local helpers (no collision with app.js / components.js)
   ============================================================ */
let mSort = 'popular';            // menu sort: popular|low|high|rate|name|kcal
let cartLow = false;              // cart reviewer affordance: low balance

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function favFlip(id) { toggleFav(id); go(APP.route, APP.param); }

/* ---------- Onboarding scaffold (§5.1) ---------- */
function onbDots(i) {
  return `<div class="onb-dots" role="tablist" aria-label="Алхам">
    ${[0, 1, 2, 3].map(n => `<i class="${n === i ? 'on' : ''}"></i>`).join('')}
  </div>`;
}

/* ============================================================
   ONBOARDING (§5.1) — 4 screens, no nav, no skip
   ============================================================ */

defineScreen('onb1', {
  name: 'Тавталын 1', group: 'Onboarding',
  note: 'Onboarding 1/4 — brand, wallet, today\'s menu',
  render() {
    const m = MENU.find(x => x.id === 'tsuvan');
    return `
    <div class="onb">
      <div class="onb-art">
        <div class="mini-phone">
          <div style="padding:18px 14px 0;display:flex;gap:8px;align-items:center">
            <span class="rail-mark" style="width:26px;height:26px;border-radius:8px">${icon('bowl', 15)}</span>
            <b style="font:800 12px/1 var(--font)">Amjilt Canteen</b>
          </div>
          <div style="padding:14px 14px 0">
            <div class="wallet-card" style="padding:14px;border-radius:16px">
              <span class="glyph">${icon('wallet', 90, '')}</span>
              <div class="lbl">МИНИЙ WALLET</div>
              <div class="amt" style="font:800 22px/1 var(--font)">${price(WALLET.balance)}</div>
              <div class="row-b" style="margin-top:12px">
                <span style="font:800 10px/1.2 var(--font)">${CAST.student.name}</span>
                <span class="btn-add" style="height:28px;padding:0 10px;font-size:11px">${icon('plus', 12)} Цэнэглэх</span>
              </div>
            </div>
          </div>
          <div style="padding:16px 0 0">
            <div style="padding:0 14px;font:800 11px/1 var(--font)">Өнөөдрийн меню</div>
            <div class="rail-x" style="padding:10px 14px 0">
              <span style="display:block;flex:none;width:172px">${foodCard(m, { target: 'food' })}</span>
            </div>
          </div>
        </div>
      </div>

      <h2>Сургуулийн хоолны шинэ үе.</h2>
      <p>Захиал. Цагаа сонго. QR-аа уншуул. Хоолоо ав.</p>
      <div style="height:26px"></div>
      ${onbDots(0)}
      <div class="foot">
        ${btn('Дараагийн', { size: 'lg block', onclick: "go('onb2')" })}
      </div>
    </div>`;
  },
});

defineScreen('onb2', {
  name: 'Тавталын 2', group: 'Onboarding',
  note: 'Onboarding 2/4 — the slot list, capacity in the open',
  render() {
    return `
    <div class="onb">
      <div class="onb-art">
        <div class="mini-phone">
          <div style="padding:18px 14px 10px">
            <div style="font:800 14px/1.2 var(--font)">Хоолоо авах цаг</div>
            <div style="font:500 10px/1.35 var(--font);color:var(--text-secondary);margin-top:3px">
              Өнөөдөр бүр 16 сул орон байна. Хэн ч үргэлжлэлгүй зогсохгүй.
            </div>
          </div>
          <div class="stack-sm" style="padding:4px 14px 0">
            ${slotCard(SLOTS[1], 1, { selected: null })}
            ${slotCard(SLOTS[2], 2, { selected: null })}
            ${slotCard(SLOTS[3], 3, { selected: null })}
          </div>
          <div class="pad" style="padding-top:14px">
            ${alert('info', 'Ачаалал урьдчилан харагдана', 'Дүүрсэн цаг нь автоматаар хаагддаа.')}
          </div>
        </div>
      </div>

      <h2>Дараалалд бага зогсоно.</h2>
      <p>Слот бүрт 16 сул орон. Дуусахад цаг нь өөрөө хаагддаг.</p>
      <div style="height:26px"></div>
      ${onbDots(1)}
      <div class="foot">
        ${btn('Дараагийн', { size: 'lg block', onclick: "go('onb3')" })}
      </div>
    </div>`;
  },
});

defineScreen('onb3', {
  name: 'Тавталын 3', group: 'Onboarding',
  note: 'Onboarding 3/4 — the reserved slot as a physical block',
  render() {
    const s = SLOTS[APP.slot];
    const mins = s.from - CURRENT_MIN;
    return `
    <div class="onb">
      <div class="onb-art">
        <div class="mini-phone">
          <div style="padding:18px 14px 0">
            <div style="font:800 14px/1.2 var(--font)">Таны авах ээлж</div>
            <div style="font:500 10px/1.35 var(--font);color:var(--text-secondary);margin-top:3px">
              Энэ цаг зөвхөн танд харгалзахна.
            </div>
          </div>
          <div class="pad" style="padding-top:14px">
            <div class="qpanel" style="margin-top:0;padding:16px;border-radius:18px">
              <div class="k">ТАНЫ АВАХ ЭЭЛЖ</div>
              <div class="t tnum" style="font:800 22px/1.1 var(--font)">${s.time}</div>
              <div style="font:500 11px/1.3 var(--font);opacity:.8">${free(s)} сул үлдсэн</div>
              <div class="track" style="height:6px;margin-top:14px"><div class="fill" style="width:0"></div></div>
              <div class="legend" style="font-size:10px"><span class="tnum">${s.time.split('–')[0]}</span><span>${mins} минутын дараа</span><span class="tnum">${s.time.split('–')[1]}</span></div>
              <div class="load" style="margin-top:12px;padding-top:12px;font-size:11px">
                <span class="pulse-dot"></span> Цайны газар ачаалал багатай.
              </div>
            </div>
          </div>
          <div class="pad" style="padding-top:16px">
            <div class="card flat" style="padding:12px">
              <div class="row gap-3">
                <span class="ic" style="width:34px;height:34px;border-radius:11px;background:var(--brand-050);color:var(--brand-600);display:grid;place-items:center;flex:none">${icon('scan', 18)}</span>
                <span class="grow">
                  <span class="tt" style="font:700 13px/1.2 var(--font);display:block">Хүлээх хэрэггүй</span>
                  <span style="font:500 11px/1.3 var(--font);color:var(--text-tertiary);display:block;margin-top:2px">Өөрийн цагт ирээд QR-аа уншуулна уу.</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2>Өөрийн авах цагаа сонгоно.</h2>
      <p>Слот сонгоход ээлж таны нэр дээр туслагдана. Өөр хүүхэд бүрд орохгүй.</p>
      <div style="height:26px"></div>
      ${onbDots(2)}
      <div class="foot">
        ${btn('Дараагийн', { size: 'lg block', onclick: "go('onb4')" })}
      </div>
    </div>`;
  },
  after() {
    const f = document.querySelector('.mini-phone .qpanel .fill');
    if (f) requestAnimationFrame(() => { f.style.width = '46%'; });
  },
});

defineScreen('onb4', {
  name: 'Тавталын 4', group: 'Onboarding',
  note: 'Onboarding 4/4 — QR pickup, the «Эхлэх» CTA',
  render() {
    return `
    <div class="onb">
      <div class="onb-art">
        <div class="mini-phone">
          <div style="padding:18px 14px 0;text-align:center">
            <div style="font:800 14px/1.2 var(--font)">Хоолоо авах</div>
            <div style="font:500 10px/1.35 var(--font);color:var(--text-secondary);margin-top:3px">№ ${ORDERS.live.id} · ${ORDERS.live.from}</div>
          </div>
          <div class="pad" style="padding-top:14px">
            <div class="qr-wrap" style="padding:12px;border-radius:18px">
              <div id="onbq"></div>
            </div>
            <div style="text-align:center;margin-top:12px">
              <span class="qr-status ok" style="height:32px;font-size:12px">${icon('checkC', 14)}<span class="d"></span>QR код хүчинтэй</span>
            </div>
            <div style="font:700 10px/1 var(--font);color:var(--text-tertiary);margin-top:8px" class="tnum">Үлдсэн 08:42</div>
          </div>
          <div class="pad" style="padding-top:14px">
            <div class="trust" style="font-size:10px">${icon('lock', 13)} Дараалалгүй. Нэг скан.</div>
          </div>
        </div>
      </div>

      <h2>QR-аа уншуулаад хоолоо авна.</h2>
      <p>Цайны газрын уншигчид кодыг зураадаг. Нэг скан — дуусна.</p>
      <div style="height:26px"></div>
      ${onbDots(3)}
      <div class="foot">
        ${btn('Эхлэх', { size: 'lg block', onclick: "go('login')" })}
      </div>
    </div>`;
  },
  after() { qrCanvas('onbq', ORDERS.live.id + '|onb4', 148); },
});

/* ============================================================
   LOGIN (§5.2) — first impression, role switch, demo credentials
   ============================================================ */
function setRole(r) { APP.role = r; STATE.role = r; go('login'); }

defineScreen('login', {
  name: 'Нэвтрэх', group: 'Onboarding',
  note: 'Login — Сурагч / Эцэг эх, prefilled demo credentials',
  render() {
    const parent = APP.role === 'parent';
    return `
    <div class="scroll">
      <div class="pad stack" style="padding-top:34px;padding-bottom:56px">
        <div style="text-align:center">
          <div style="display:flex;justify-content:center">
            <span class="rail-mark">${icon('bowl', 19)}</span>
          </div>
          <h1 class="t-title" style="margin-top:18px">Amjilt Canteen-д тавтай морил 👋</h1>
          <p class="t-body-sm dim" style="margin-top:6px">Сургуулийн хоолны шинэ үе</p>
        </div>

        <div class="seg" role="tablist" aria-label="Хэрэглэгчийн төрөл">
          <button class="${parent ? '' : 'on'}" role="tab" aria-selected="${!parent}" onclick="setRole('student')">Сурагч</button>
          <button class="${parent ? 'on' : ''}" role="tab" aria-selected="${parent}" onclick="setRole('parent')">Эцэг эх</button>
        </div>

        <div>
          <div class="t-label dim-2" style="margin:0 0 6px 2px">${parent ? 'Хүүхдийн код' : 'Сурагчийн код'}</div>
          <div class="search">
            <span class="ic">${icon('scan', 19)}</span>
            <input inputmode="text" autocomplete="off" aria-label="${parent ? 'Хүүхдийн код' : 'Сурагчийн код'}"
              placeholder="A1024" value="${esc(CAST.student.code)}">
          </div>
        </div>

        <div>
          <div class="t-label dim-2" style="margin:0 0 6px 2px">Утасны дугаар</div>
          <div class="search">
            <span class="ic">${icon('person', 19)}</span>
            <input inputmode="numeric" autocomplete="off" aria-label="Утасны дугаар"
              placeholder="88129944" value="${esc(CAST.student.phone)}">
          </div>
        </div>

        <button class="link" style="align-self:flex-end;margin-top:-6px">Нууц үгээ мартсан?</button>

        <div class="card flat" style="background:var(--brand-050);box-shadow:none">
          <div class="row gap-2" style="color:var(--brand-700)">
            <span style="flex:none">${icon('info', 16)}</span>
            <b style="font:800 12px/1.3 var(--font)">ДЕМО НЭВТРЭЛ</b>
          </div>
          <p class="t-body-sm" style="color:var(--brand-800);margin-top:6px">
            Сурагчийн код <b class="tnum">${CAST.student.code}</b> ·
            Утас <b class="tnum">${CAST.parent.phone}</b> ·
            Нууц үг шаардлагагүй.
          </p>
        </div>

        <div class="trust" style="margin-top:2px">${icon('lock', 14)} Мэдээлэл зөвхөн сургуулийн серверт хадгалагдана.</div>
      </div>
    </div>

    <div class="sticky-cta">
      <div class="stack-sm" style="flex:1">
        ${btn('Нэвтрэх', {
          size: 'lg block',
          onclick: parent ? "go('parent-home')" : "go('home')"
        })}
        ${btn('Бүртгэл үүсгэх', { variant: 'outline', size: 'block', onclick: "go('onb1')" })}
      </div>
    </div>`;
  },
});

/* ============================================================
   MENU (§5.4) — real filtering against MENU / APP.cat / APP.search /
   STATE.allergies / APP.favoritesOnly
   ============================================================ */
function setSort(k) { mSort = k; closeSheet(); go('menu'); }
function toggleFavOnly() { APP.favoritesOnly = !APP.favoritesOnly; go('menu'); }
function toggleSafeOnly() {
  APP.allergensFilter = APP.allergensFilter.length ? [] : STATE.allergies.slice();
  go('menu');
}
function clearSearch() {
  APP.search = ''; APP.cat = 'all'; APP.favoritesOnly = false; APP.allergensFilter = [];
  go('menu');
}
function sortSheet() {
  const opts = [['popular', 'Санал болох', 'bowl'], ['low', 'Үнэ өсөхөөр', 'up'],
                ['high', 'Үнэ буурахаар', 'down2'], ['rate', 'Үнэлгээгээр', 'star'],
                ['name', 'Нэрээр (А–Я)', 'sort'], ['kcal', 'Илчлэгээр', 'flame']];
  return {
    html: sheet('sort', 'Эрэмбэлэх', `
      <div class="rows">
        ${opts.map(([k, l, ic]) => rowItem(ic, l, mSort === k ? 'Одоо сонгогдсон' : '', {
          onclick: `setSort('${k}')`, chev: false,
          right: mSort === k ? `<span class="green">${icon('check', 20)}</span>` : '',
        })).join('')}
      </div>
      <p class="t-body-sm dim-2" style="margin:10px 2px 0">${MENU.length} хоол бүхэлдээ эрэмбэлэгдэнэ.</p>`),
  };
}

function menuRow(m) {
  const fav = STATE.favorites.includes(m.id);
  const hits = m.allergens.filter(a => STATE.allergies.includes(a));
  return `
  <button class="card" style="position:relative;display:flex;gap:12px;align-items:center;padding:10px;width:100%;text-align:left"
    onclick="go('food','${m.id}')" aria-label="${m.name}, ${price(m.price)}">
    <img src="${IMG(m.img, 200)}" alt="${m.name}" loading="lazy"
      style="width:84px;height:84px;border-radius:14px;object-fit:cover;flex:none;background:var(--brand-050)">
    <span class="grow col gap-1">
      <span class="row gap-2">
        <span style="font:800 15px/1.2 var(--font);letter-spacing:-.2px">${m.name}</span>
        ${hits.length ? `<span title="Таны харшилд орно" style="width:20px;height:20px;border-radius:50%;background:var(--accent-500);color:#fff;display:grid;place-items:center;flex:none">${icon('alert', 12)}</span>` : ''}
      </span>
      <span class="t-body-sm trunc" style="color:var(--text-secondary)">${m.ing.join(' · ')}</span>
      <span class="row gap-2 nowrap" style="margin-top:3px">
        <span class="tnum" style="font:800 15px/1 var(--font);letter-spacing:-.3px">${price(m.price)}</span>
        <span class="row gap-1 nowrap" style="color:var(--accent-600);font:700 12px/1 var(--font)">${icon('star', 12)}${m.rating.toFixed(1)}</span>
        <span class="row gap-1 nowrap dim-2" style="font:700 12px/1 var(--font)">${icon('flame', 12)}${m.kcal} kcal</span>
      </span>
    </span>
    <span role="button" tabindex="0" aria-label="Дуртай болгох" class="iconbtn"
      style="position:absolute;top:2px;right:2px;background:rgba(255,255,255,.94);box-shadow:var(--sh-sm);color:${fav ? 'var(--danger)' : 'var(--text-tertiary)'}"
      onclick="event.stopPropagation();favFlip('${m.id}')">${iconFill('heart', 20)}</span>
  </button>`;
}

function menuResults() {
  const q = APP.search.trim().toLowerCase();
  const safe = APP.allergensFilter.length > 0;
  let list = MENU.filter(m => {
    if (APP.cat !== 'all' && m.cat !== APP.cat) return false;
    if (APP.favoritesOnly && !STATE.favorites.includes(m.id)) return false;
    if (safe && m.allergens.some(a => APP.allergensFilter.includes(a))) return false;
    if (q) {
      const hay = (m.name + ' ' + m.ing.join(' ') + ' ' + m.cat + ' ' + m.desc).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
  const s = mSort;
  list = list.slice().sort((a, b) => {
    if (s === 'low')  return a.price - b.price;
    if (s === 'high') return b.price - a.price;
    if (s === 'rate') return b.rating - a.rating;
    if (s === 'kcal') return a.kcal - b.kcal;
    if (s === 'name') return a.name.localeCompare(b.name, 'mn');
    return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || b.rating - a.rating;
  });

  const conflicts = list.filter(m => m.allergens.some(a => STATE.allergies.includes(a))).length;
  const head = `<div class="t-label dim-2" style="margin:0 2px 10px" aria-live="polite">
    ${list.length} хоол олдсон${conflicts ? ` · ${conflicts} нь таны харшилд орно` : ''}</div>`;

  if (!list.length) {
    return head + `
      <div class="empty">
        <div class="ic">${icon('search', 30)}</div>
        <h3>${q ? `«${esc(APP.search)}» гэсэн үгээр юу ч олдсонгүй` : 'Нэг ч хоол олдсонгүй'}</h3>
        <p>Бусад үгээр хайж үзээрэй. Мөн өдөр бүр өдрийн хоол шинэчлэгдэнэ.</p>
        ${btn('Хайдалтыг цэвэрлэх', { variant: 'secondary', onclick: 'clearSearch()' })}
      </div>`;
  }
  return head + `<div class="stack-sm">${list.map(menuRow).join('')}</div>`;
}

defineScreen('menu', {
  name: 'Меню', group: 'Student', nav: 'menu',
  note: 'Menu — live search, category, sort sheet, favourites-only, allergy-safe',
  render() {
    const safe = APP.allergensFilter.length > 0;
    return `
    ${appbar({
      eyebrow: `${OPS.nowLabel} · Өнөөдөр`,
      title: 'Хоол сонгоно уу',
      right: `<button class="iconbtn ghost" style="color:${APP.favoritesOnly ? 'var(--danger)' : 'inherit'}"
        onclick="toggleFavOnly()" aria-label="Дуртай хоолнууд л">${iconFill('heart', 21)}</button>`,
    })}

    <div class="scroll">
      <div class="pad">
        <div class="row gap-2">
          <div class="search" style="flex:1">
            <span class="ic">${icon('search', 19)}</span>
            <input aria-label="Хоол хайх" placeholder="Хоол хайх..." value="${esc(APP.search)}"
              oninput="APP.search=this.value;document.getElementById('mres').innerHTML=menuResults()">
          </div>
          <button class="iconbtn" onclick="openSheet('sort')" aria-label="Эрэмбэлэх">${icon('sort', 20)}</button>
        </div>
      </div>

      <div style="margin-top:14px">
        <div class="chips">
          ${CATEGORIES.map(c => `<button class="chip ${APP.cat === c.id ? 'on' : ''}" onclick="setCat('${c.id}')">${c.label}</button>`).join('')}
        </div>
      </div>

      <div style="margin-top:8px">
        <div class="chips">
          <button class="alrg-chip ${safe ? 'on' : ''}" onclick="toggleSafeOnly()">
            ${icon('shield', 15)} Харшил үүсгэгчгүй
          </button>
          ${STATE.allergies.map(a => `<span class="chip" style="height:40px">${a}</span>`).join('')}
          <button class="chip" onclick="clearSearch()">Цэвэрлэх</button>
        </div>
      </div>

      <div class="pad" id="mres" style="margin-top:16px">${menuResults()}</div>
      <div style="height:26px"></div>
    </div>

    ${nav('menu')}`;
  },
  sheet(id) { return id === 'sort' ? sortSheet() : null; },
});

/* ============================================================
   FOOD DETAIL (§5.5) — normal + skeleton + error
   ============================================================ */
function foodQty(id) { const it = CART.items.find(i => i.id === id); return it ? it.qty : 0; }
function bumpDish(id, d) {
  const it = CART.items.find(i => i.id === id);
  const cur = it ? it.qty : 0;
  const next = cur + d;
  if (next <= 0) { CART.items = CART.items.filter(i => i.id !== id); }
  else if (it) { it.qty = next; }
  else { CART.items.push({ id, qty: next }); }
  go('food', id);
}
function addAnyway(id) {
  const it = CART.items.find(i => i.id === id);
  if (it) it.qty++; else CART.items.push({ id, qty: 1 });
  go('cart');
}
function retryFood() { go('food', MENU[0].id); }
function stepper(id, qty) {
  return `<span class="stepper" role="group" aria-label="Тоо">
    <button style="width:44px;height:44px" onclick="bumpDish('${id}',-1)" ${qty ? '' : 'disabled'} aria-label="Нэгээр багасгах">${icon('minus', 18)}</button>
    <span class="n tnum" style="min-width:40px;font:800 17px/1 var(--font)">${qty || 1}</span>
    <button style="width:44px;height:44px" onclick="bumpDish('${id}',1)" aria-label="Нэгээр нэмэх">${icon('plus', 18)}</button>
  </span>`;
}

function foodSkeleton() {
  return `
    ${appbar({ back: "go('menu')", title: '' })}
    <div class="scroll">
      <div class="pad"><div class="skel skel-card" style="height:230px;border-radius:var(--r-card-lg)"></div></div>
      <div class="pad stack" style="margin-top:18px">
        <div class="skel skel-line" style="width:62%;height:24px;margin-top:0"></div>
        <div class="skel skel-line" style="width:40%"></div>
        <div class="skel skel-line" style="width:88%;margin-top:8px"></div>
        <div class="skel skel-line" style="width:74%"></div>
        <div class="row gap-2" style="margin-top:10px">
          <span class="chip">Орц</span><span class="chip">Илчлэг</span><span class="chip">Харшил үүсгэгч</span>
        </div>
      </div>
      <div class="pad stack-sm" style="margin-top:20px">
        ${skelRow()}${skelRow()}${skelRow()}
      </div>
      <div style="height:26px"></div>
    </div>
    <div class="sticky-cta">
      <span class="skel" style="height:54px;flex:1;border-radius:16px"></span>
    </div>`;
}

function foodError() {
  return `
    ${appbar({ back: "go('menu')", title: '' })}
    <div class="scroll">
      <div class="pad" style="padding-top:36px">
        <div class="empty">
          <div class="ic">${icon('alert', 30)}</div>
          <h3>Хоолны мэдээллийг ачааж чадсангүй.</h3>
          <p>Интернет холболтоо шалгаад дахин оролдох но уу.</p>
          ${btn('Дахин оролдох', { onclick: 'retryFood()' })}
        </div>
      </div>
      <div class="pad">
        ${alert('info', 'Холболт хэвийн үед', 'Цайны газарын Wi-Fi эсвэл өөрийн утасны интернетийг туршина уу.')}
      </div>
      <div style="height:26px"></div>
    </div>`;
}

defineScreen('food', {
  name: 'Хоолны дэлгэрэнгүй', group: 'Student', nav: 'menu',
  note: 'Food detail — hero, ingredients, stepper, sticky CTA, allergen swap',
  render(param) {
    if (param === 'skeleton') return foodSkeleton();
    if (param === 'error')   return foodError();
    const m = MENU.find(x => x.id === param) || MENU.find(x => x.id === 'tsuvan');
    if (!m) return foodError();

    const qty = foodQty(m.id);
    const hits = m.allergens.filter(a => STATE.allergies.includes(a));

    const sticky = hits.length
      ? `<div class="sticky-cta">
          <div style="flex:1">
            ${alert('warn', `Энэ хоолонд ${hits.join(', ')} агуулагдана.`,
              'Таны хадгалсан харшилтэй тэнцэх байна.',
              { action: btn('Үл харших хэвээр үргэлжлэх', { variant: 'outline', onclick: `addAnyway('${m.id}')` }) })}
          </div>
        </div>`
      : `<div class="sticky-cta">
          ${btn(`Сагсанд нэмэх · ${price(m.price * (qty || 1))}`, { size: 'lg block', onclick: "go('cart')", iconL: 'bowl' })}
        </div>`;

    return `
    <div class="scroll">
      <div style="position:relative;background:var(--brand-050)">
        <img src="${IMG(m.img, 900)}" alt="${m.name}"
          style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block">
        <div class="row" style="position:absolute;left:12px;right:12px;top:12px;justify-content:space-between">
          <button class="iconbtn" onclick="go('menu')" aria-label="Буцах">${icon('left', 22)}</button>
          <button class="iconbtn" onclick="favFlip('${m.id}')" aria-label="Дуртай болгох"
            style="color:${STATE.favorites.includes(m.id) ? 'var(--danger)' : 'inherit'}">${iconFill('heart', 21)}</button>
        </div>
        ${m.tag ? `<span style="position:absolute;left:12px;bottom:12px;height:24px;padding:0 10px;border-radius:999px;background:var(--accent-500);color:#fff;font:800 11px/24px var(--font)">${m.tag}</span>` : ''}
      </div>

      <div class="pad stack" style="margin-top:18px">
        <div>
          <h1 class="t-title">${m.name}</h1>
          <div class="row gap-3 wrap" style="margin-top:10px">
            <span class="t-money tnum">${price(m.price)}</span>
            <span class="row gap-1" style="color:var(--accent-600);font:700 14px/1 var(--font)">${icon('star', 14)}${m.rating.toFixed(1)}</span>
            <span class="row gap-1 dim" style="font:700 13px/1 var(--font)">${icon('flame', 13)}${m.kcal} kcal</span>
          </div>
          <div class="row gap-2 wrap" style="margin-top:12px">
            ${m.tag ? `<span class="st warn">${m.tag}</span>` : ''}
            ${m.fresh ? `<span class="st ok">Шинэ</span>` : ''}
            ${m.popular ? `<span class="st warn">🔥 Өнөөдөр хамгийн их</span>` : ''}
          </div>
        </div>

        <p class="t-body dim">${m.desc}</p>

        <div>
          <div class="t-label dim-2" style="margin:0 0 8px 2px">ОРЦ</div>
          <div class="row gap-2 wrap">${m.ing.map(i => `<span class="chip">${i}</span>`).join('')}</div>
        </div>

        <div>
          <div class="t-label dim-2" style="margin:0 0 8px 2px">ИЛЧЛЭГ</div>
          <div class="card flat">
            <div class="row-b">
              <span class="t-body-sm dim">${m.name}</span>
              <span class="tnum" style="font:800 15px/1 var(--font)">${m.kcal} kcal</span>
            </div>
            <div class="meter" style="margin-top:10px"><i class="${m.kcal > 550 ? 'orange' : ''}" style="width:${Math.round(m.kcal / 700 * 100)}%"></i></div>
            <div class="row-b" style="margin-top:6px">
              <span class="t-caption dim-2">0</span><span class="t-caption dim-2">700 kcal</span>
            </div>
          </div>
        </div>

        <div>
          <div class="t-label dim-2" style="margin:0 0 8px 2px">ХАРШИЛ ҮҮСГЭГЧ</div>
          <div class="row gap-2 wrap">
            ${m.allergens.length
              ? m.allergens.map(a => `<span class="alrg-chip ${hits.includes(a) ? 'on' : ''}">${icon('alert', 14)} ${a}</span>`).join('')
              : `<span class="chip on">${icon('check', 14)} Харшил үүсгэгчгүй</span>`}
          </div>
        </div>

        <div class="card">
          <div class="row-b">
            <span class="t-section">Тоо</span>
            ${stepper(m.id, qty)}
          </div>
          <div class="row-b" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="t-body-sm dim tnum">${price(m.price)} × ${qty || 1}</span>
            <span class="t-money tnum">${price(m.price * (qty || 1))}</span>
          </div>
        </div>
      </div>
      <div style="height:26px"></div>
    </div>
    ${sticky}`;
  },
});

/* ============================================================
   CART (§5.7) — steppers, slot, wallet, insufficient balance
   ============================================================ */
function rmItem(id) { CART.items = CART.items.filter(i => i.id !== id); go('cart'); }
function setCartLow(v) { cartLow = v; go('cart'); }

defineScreen('cart', {
  name: 'Сагс', group: 'Student',
  note: 'Cart — line steppers, slot, wallet, insufficient-balance state',
  render() {
    const sub = cartSubtotal();
    const slot = SLOTS[APP.slot];
    const bal = cartLow ? Math.max(0, sub - 1000) : WALLET.balance;
    const low = bal < sub;

    if (!CART.items.length) {
      return `
      ${appbar({ back: "go('menu')", title: 'Сагс' })}
      <div class="scroll">
        <div class="empty">
          <div class="ic">${icon('bowl', 30)}</div>
          <h3>Сагс хоосон байна</h3>
          <p>Өнөөдрийн менюгоос хоолоо сонгоод эндээ нэмээрэй.</p>
          ${btn('Меню үзэх', { onclick: "go('menu')" })}
        </div>
      </div>`;
    }

    return `
    ${appbar({ back: "go('menu')", title: 'Сагс', sub: `${cartCount()} хоол · ${price(sub)}` })}

    <div class="scroll">
      <div class="pad stack" style="margin-top:6px">
        <div class="rows">
          ${CART.items.map(it => {
            const m = MENU.find(x => x.id === it.id);
            if (!m) return '';
            const hit = m.allergens.some(a => STATE.allergies.includes(a));
            return `
            <div class="row-item" style="gap:10px;align-items:flex-start">
              <button onclick="go('food','${m.id}')" aria-label="${m.name}"
                style="width:56px;height:56px;border-radius:13px;overflow:hidden;flex:none;background:var(--brand-050)">
                <img src="${IMG(m.img, 160)}" alt="${m.name}" loading="lazy"
                  style="width:100%;height:100%;object-fit:cover;display:block">
              </button>
              <span class="grow">
                <span class="row" style="gap:8px">
                  <span class="tt grow nowrap">${m.name}</span>
                  <span class="tnum nowrap" style="font:800 14px/1 var(--font);flex:none">${price(m.price * it.qty)}</span>
                </span>
                <span class="row gap-2" style="margin-top:4px">
                  ${hit ? `<span style="width:16px;height:16px;border-radius:50%;background:var(--accent-500);color:#fff;display:grid;place-items:center;flex:none" title="Таны харшилд орно">${icon('alert', 9)}</span>` : ''}
                  <span class="sub tnum nowrap">${price(m.price)} · ${m.kcal} kcal</span>
                </span>
                <span style="display:block;margin-top:8px">
                  <span class="stepper">
                    <button style="width:44px;height:44px" onclick="bumpDish('${m.id}',-1)" aria-label="Нэгээр багасгах">${icon('minus', 18)}</button>
                    <span class="n tnum" style="min-width:30px;font:800 15px/1 var(--font)">${it.qty}</span>
                    <button style="width:44px;height:44px" onclick="bumpDish('${m.id}',1)" aria-label="Нэгээр нэмэх">${icon('plus', 18)}</button>
                  </span>
                </span>
              </span>
              <button class="iconbtn ghost" onclick="rmItem('${m.id}')" aria-label="${m.name} хасах"
                style="flex:none;margin-top:-10px;color:var(--text-tertiary)">${icon('x', 18)}</button>
            </div>`;
          }).join('')}
        </div>

        <button class="card" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px"
          onclick="go('queue')" aria-label="Авах цаг сонгох">
          <span class="ic" style="width:40px;height:40px;border-radius:12px;background:var(--brand-050);color:var(--brand-600);display:grid;place-items:center;flex:none">${icon('clock', 19)}</span>
          <span class="grow">
            <span class="tt" style="font:800 14px/1.2 var(--font);display:block">Авах цаг</span>
            <span class="tnum" style="font:500 13px/1.3 var(--font);color:var(--text-tertiary);display:block;margin-top:2px">${slot.time} · ${free(slot)} сул</span>
          </span>
          <span class="dim-2">${icon('right', 17)}</span>
        </button>

        <div class="card">
          <div class="row-b" style="padding-bottom:12px">
            <span class="t-body-sm dim">Дэлгэгдэл</span>
            <span class="tnum" style="font:700 15px/1 var(--font)">${price(sub)}</span>
          </div>
          <div class="row-b" style="padding:12px 0;border-bottom:1px solid var(--border)">
            <span class="t-body-sm dim">Авах цаг</span>
            <span class="tnum t-body-sm" style="font-weight:700">${slot.time}</span>
          </div>
          <div class="row-b" style="padding-top:12px">
            <span class="row gap-2 t-body-sm dim">${icon('wallet', 18)} Amjilt Wallet</span>
            <span class="tnum t-body-sm" style="font-weight:700">${price(bal)}</span>
          </div>
        </div>

        ${low ? alert('warn', 'Wallet-ийн үлдэгдэл хүрэлцэхгүй байна',
          `Дэлгэгдэл ${price(sub)} · Үлдэгдэл ${price(bal)}. Цэнэглээд үргэлжлүүлнэ үү.`) : ''}

        <div class="row-b" style="padding:2px 2px 0">
          <span class="t-section">Нийт</span>
          <span class="t-money-lg tnum">${price(sub)}</span>
        </div>
      </div>

      <div class="pad" style="margin-top:26px">
        <div class="t-caption dim-2" style="text-align:center;margin-bottom:8px">Wallet-ийн үлдэгдэл</div>
        <div class="seg">
          <button class="${cartLow ? '' : 'on'}" onclick="setCartLow(false)">Хангалттай</button>
          <button class="${cartLow ? 'on' : ''}" onclick="setCartLow(true)">Дутуу</button>
        </div>
      </div>
      <div style="height:86px"></div>
    </div>

    <div class="sticky-cta" style="flex-direction:column;align-items:stretch;gap:10px">
      ${btn(`Төлөх · ${price(sub)}`, { size: 'lg block', disabled: low, onclick: "go('payment')" })}
      ${low ? btn('Цэнэглэх', { variant: 'outline', size: 'lg block', onclick: "openSheet('topup')", iconL: 'wallet' }) : ''}
    </div>`;
  },
  sheet(id) { return id === 'topup' ? topupSheet() : null; },
});

/* ============================================================
   PAYMENT (§5.8) — idle | processing | failed (+ success hand-off)
   ============================================================ */
function setPayState(s) { APP.payState = s; go('payment'); }

defineScreen('payment', {
  name: 'Төлбөр', group: 'Student',
  note: 'Payment — order summary, wallet method, idle/processing/failed',
  render() {
    const st = APP.payState;
    const sub = cartSubtotal();
    const slot = SLOTS[APP.slot];
    const busy = st === 'processing';

    const method = `
      <div class="rows">
        <button class="row-item" aria-pressed="true">
          <span class="ic">${icon('wallet', 19)}</span>
          <span class="grow">
            <span class="tt">Amjilt Wallet</span>
            <span class="sub tnum">${WALLET.card} · Үлдэгдэл ${price(WALLET.balance)}</span>
          </span>
          <span style="width:22px;height:22px;border-radius:50%;background:var(--brand-600);color:#fff;display:grid;place-items:center;flex:none">${icon('check', 14)}</span>
        </button>
        <button class="row-item" aria-pressed="false" onclick="alert('info','Хувийн карт', 'Сургуулийн бодлогогоор зөвхөн Amjilt Wallet-ээр төлнө.')">
          <span class="ic" style="background:var(--surface-sunken);color:var(--text-tertiary)">${icon('card', 19)}</span>
          <span class="grow">
            <span class="tt">Банкны карт</span>
            <span class="sub">Энэ байгууллагад идэвхгүй</span>
          </span>
          <span style="width:22px;height:22px;border-radius:50%;box-shadow:inset 0 0 0 2px var(--border-strong);flex:none"></span>
        </button>
      </div>`;

    const body = {
      idle: '',
      processing: alert('info', 'Төлбөр хийгдэж байна…', 'Amjilt Wallet-ээс хүлээн авна. Хуудаа орхиж болохгүй.'),
      success: alert('ok', 'Төлбөр амжилттай боллоо.', 'Захиалга бэлэн болж байна.'),
      failed: alert('bad', 'Төлбөр амжилтгүй боллоо.',
        'Холболт тасарсан байж магадгүй. Өөр төлбөрийн арга сонгоод дахин оролдоно уу.'),
    }[st] || '';

    const cta = busy
      ? btn('', { loading: true })
      : st === 'success'
        ? btn('Захиалгаа үзэх', { size: 'lg block', onclick: "go('success')" })
        : st === 'failed'
          ? btn('Өөр төлбөрийн арга сонгох', { variant: 'outline', size: 'lg block', onclick: "setPayState('idle')" })
          : btn('Захиалгаа баталгаажуулах', { size: 'lg block', onclick: 'doPay()', disabled: !CART.items.length });

    return `
    ${appbar({ back: busy ? '' : "go('cart')", title: 'Төлбөр', sub: `№ ${ORDERS.live.id} · ${slot.time}` })}

    <div class="scroll">
      <div class="pad stack" style="margin-top:6px">
        <div class="card">
          <div class="t-label dim-2" style="margin-bottom:12px">ЗАХИАЛГЫН ДЭЛГЭГДЭЛ</div>
          ${CART.items.length ? CART.items.map(it => {
            const m = MENU.find(x => x.id === it.id);
            if (!m) return '';
            return `<div class="row-b" style="padding:8px 0">
              <span class="row gap-3">
                <img src="${IMG(m.img, 120)}" alt="${m.name}" loading="lazy"
                  style="width:40px;height:40px;border-radius:11px;object-fit:cover;flex:none;background:var(--brand-050)">
                <span>
                  <span style="font:700 14px/1.2 var(--font);display:block">${m.name}</span>
                  <span class="tnum t-body-sm" style="color:var(--text-tertiary)">${price(m.price)} × ${it.qty}</span>
                </span>
              </span>
              <span class="tnum" style="font:800 14px/1 var(--font)">${price(m.price * it.qty)}</span>
            </div>`;
          }).join('') : `<p class="t-body-sm dim">Сагс хоосон байна.</p>`}
          <div class="row-b" style="margin-top:10px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="row gap-2 t-body-sm dim">${icon('clock', 17)} ${slot.time}</span>
            <span class="t-body-sm dim" style="font-weight:700">Авах цаг</span>
          </div>
        </div>

        ${body}

        <div>
          <div class="t-label dim-2" style="margin:0 0 8px 2px">ТӨЛБӨРИЙН АРГА</div>
          ${method}
        </div>

        <div class="card flat">
          <div class="row-b" style="padding:2px 0">
            <span class="t-body-sm dim">Дэлгэгдэл</span>
            <span class="tnum" style="font:700 15px/1 var(--font)">${price(sub)}</span>
          </div>
          <div class="row-b" style="margin-top:12px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="t-section">Нийт</span>
            <span class="t-money-lg tnum">${price(sub)}</span>
          </div>
        </div>

        <div class="trust">${icon('lock', 14)} Төлбөрийн мэдээлэл хамгаалагдсан.</div>
      </div>

      <div class="pad" style="margin-top:26px">
        <div class="t-caption dim-2" style="text-align:center;margin-bottom:8px">Төлбөрийн төлөв</div>
        <div class="seg">
          <button class="${st === 'idle' ? 'on' : ''}" onclick="setPayState('idle')">Хүлээх</button>
          <button class="${st === 'processing' ? 'on' : ''}" onclick="setPayState('processing')">Боловсруулж байна</button>
          <button class="${st === 'failed' ? 'on' : ''}" onclick="setPayState('failed')">Амжилтгүй</button>
        </div>
      </div>
      <div style="height:86px"></div>
    </div>

    <div class="sticky-cta">${cta}</div>`;
  },
});

/* ============================================================
   ORDER SUCCESS (§5.9)
   ============================================================ */
defineScreen('success', {
  name: 'Амжилт', group: 'Student',
  note: 'Order placed — mint check, № , slot, QR and detail CTAs',
  render() {
    const o = ORDERS.live;
    return `
    <div class="scroll">
      <div class="pad" style="padding-top:44px;text-align:center">
        <div class="hero-ok" style="width:88px;height:88px">${icon('check', 40)}</div>
        <h1 class="t-title" style="margin-top:22px">Захиалга амжилттай! 🎉</h1>
        <p class="t-body dim" style="margin-top:8px">Таны хоолыг бэлтгэж эхэллээ.</p>
      </div>

      <div class="pad" style="margin-top:26px">
        <div class="card">
          <div class="row-b">
            <span class="t-body-sm dim">Захиалгын дугаар</span>
            <span class="tnum" style="font:800 17px/1 var(--font);letter-spacing:-.3px">№ ${o.id}</span>
          </div>
          <div class="row-b" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="row gap-2 t-body-sm dim">${icon('clock', 17)} Авах цаг</span>
            <span class="st ok">${o.from}</span>
          </div>
          <div class="row-b" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="t-body-sm dim">Төлсөн</span>
            <span class="t-money tnum">${price(cartSubtotal())}</span>
          </div>
          <div class="row-b" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="t-body-sm dim">Wallet-ийн үлдэгдэл</span>
            <span class="tnum" style="font:800 15px/1 var(--font)">${price(WALLET.balance)}</span>
          </div>
        </div>
      </div>

      <div class="pad" style="margin-top:16px">
        ${alert('info', 'Хүлээх шаардлагагүй', 'Авах цаг дутсан үед QR кодоо цайны газрын уншигчид ойртуулна уу.')}
      </div>
      <div style="height:26px"></div>
    </div>

    <div class="sticky-cta">
      <div class="stack-sm" style="flex:1">
        ${btn('QR кодоо харах', { size: 'lg block', onclick: "go('qr')", iconL: 'qr' })}
        ${btn('Захиалгын дэлгэрэнгүй', { variant: 'outline', size: 'block', onclick: "go('track')" })}
      </div>
    </div>`;
  },
});

/* ============================================================
   ORDER TRACKING (§5.10) — 5-step timeline
   ============================================================ */
const TRACK_STEPS = [
  'Захиалга баталгаажсан',
  'Гал тогоонд хүлээн авсан',
  'Бэлтгэж байна',
  'Бэлэн болсон',
  'Хоолоо авсан',
];
const TRACK_SUBS = ['Amjilt Wallet-ээс төлсөн', 'Агуулах хэсэгт хүлээгдэж байна',
                    'Туушуур дээр байна', 'QR кодоо авна уу', 'Дараагийн өдөр баярлана уу'];
function trackNow(st) { return { queued: 1, preparing: 2, ready: 3, collected: 4 }[st] ?? 2; }
function trackHead(st) {
  return {
    queued:    { t: 'Дараалалд', s: `${ORDERS.live.from} ээлжлэгдэж байна`, c: 'queued' },
    preparing: { t: 'Бэлтгэж байна 🍜', s: 'Туушуур дээр байна', c: 'preparing' },
    ready:     { t: 'Бэлэн боллоо 🎉', s: 'QR кодоо хараарай', c: 'ready' },
    collected: { t: 'Хоолоо авсан', s: 'Сайхан хооллоорой!', c: 'collected' },
  }[st];
}
function pushCard() {
  return `
  <div class="card flat" style="overflow:hidden;padding:0">
    <div class="row-b" style="padding:10px 14px 0">
      <span class="t-caption dim-2">Одоо</span>
      <span class="t-caption dim-2">${OPS.nowLabel}</span>
    </div>
    <div class="row gap-3" style="padding:12px 14px 16px;align-items:flex-start">
      <span class="rail-mark" style="width:40px;height:40px;border-radius:12px;flex:none">${icon('bowl', 19)}</span>
      <span class="grow">
        <span style="font:800 14px/1.2 var(--font);display:block">Amjilt Canteen</span>
        <span class="t-body-sm" style="display:block;margin-top:3px">
          Таны захиалга ${ORDERS.live.id} бэлэн боллоо. QR кодоо ашиглан хоолоо аваарай.
        </span>
      </span>
    </div>
  </div>`;
}

defineScreen('track', {
  name: 'Захиалга бараа', group: 'Student', nav: 'orders',
  note: 'Order tracking — 5-step timeline, ready banner, push card',
  render() {
    const st = APP.orderStatus;
    const now = trackNow(st);
    const h = trackHead(st);

    return `
    ${appbar({
      back: "go('orders')",
      title: `Захиалга №${ORDERS.live.id}`,
      sub: `${ORDERS.live.from} · ${free(SLOTS[APP.slot])} сул`,
      right: `<button class="iconbtn ghost" onclick="go('qr')" aria-label="QR код">${icon('qr', 21)}</button>`,
    })}

    <div class="scroll">
      <div class="pad" style="margin-top:6px">
        <div class="card" style="text-align:center" aria-live="polite">
          <span class="st ${h.c}">${icon(st === 'ready' ? 'checkC' : st === 'collected' ? 'check' : 'clock', 12)}${h.t}</span>
          <div class="t-money tnum" style="margin-top:12px">${st === 'ready' ? '0' : st === 'collected' ? '—' : ORDERS.live.eta}<span style="font:800 15px/1 var(--font)"> ${st === 'ready' || st === 'collected' ? '' : 'минут'}</span></div>
          <div class="t-body-sm dim" style="margin-top:4px">${h.s}</div>
        </div>
      </div>

      ${st === 'ready' ? `
      <div class="pad" style="margin-top:16px">
        ${alert('ok', 'Таны хоол бэлэн боллоо! 🎉', `${ORDERS.live.from} цэгийн авах ээлжээр ирж, QR кодоо уншуулна уу.`,
          { action: btn('QR кодоо харах', { size: 'lg block', onclick: "go('qr')", iconL: 'qr' }) })}
      </div>` : ''}

      <div class="pad" style="margin-top:20px">
        ${secHead('Захиалгын явдал')}
        <div class="tl">
          ${TRACK_STEPS.map((t, i) => {
            const done = i < now || (i === now && st === 'collected');
            const cur = i === now && st !== 'collected';
            return `
            <div class="tl-node ${done ? 'done' : cur ? 'now' : ''}">
              <span class="tl-dot">${done ? icon('check', 20) : cur ? icon('clock', 20) : icon('clock', 18)}</span>
              <span class="grow">
                <span class="tl-t" style="display:block">${t}</span>
                <span class="tl-d" style="display:block">${cur ? h.s : done ? TRACK_SUBS[i] : 'Хүлээгдэж байна'}</span>
              </span>
            </div>`;
          }).join('')}
        </div>
      </div>

      ${st === 'ready' ? `
      <div class="pad" style="margin-top:20px">
        ${secHead('Push мэдэгдэл')}
        ${pushCard()}
      </div>` : ''}

      <div class="pad" style="margin-top:22px">
        <div class="t-caption dim-2" style="text-align:center;margin-bottom:8px">Захиалгын төлөв</div>
        <div class="seg">
          ${[['queued', 'Дараалал'], ['preparing', 'Бэлтгэж'], ['ready', 'Бэлэн'], ['collected', 'Олгосон']]
            .map(([k, l]) => `<button class="${st === k ? 'on' : ''}" onclick="APP.orderStatus='${k}';go('track')">${l}</button>`).join('')}
        </div>
        <div style="height:10px"></div>
        ${btn('Дараагийн төлөв', { variant: 'outline', size: 'lg block', onclick: 'advanceOrder()', iconR: 'right' })}
      </div>
      <div style="height:26px"></div>
    </div>

    ${nav('orders')}`;
  },
});

/* ============================================================
   ORDER HISTORY (§5.12) — Идэвхтэй | Өмнөх
   ============================================================ */
function setOrderTab(t) { APP.orderTab = t; go('orders'); }
function reorderByName(name) {
  const m = MENU.find(x => x.name === name);
  if (!m) return;
  const it = CART.items.find(i => i.id === m.id);
  if (it) it.qty++; else CART.items.push({ id: m.id, qty: 1 });
  go('queue');
}
function orderCard(o) {
  const m = MENU.find(x => x.name === o.name);
  const slot = SLOTS[o.slot];
  return `
  <div class="card">
    <div class="row gap-3" style="align-items:flex-start">
      ${m ? `<img src="${IMG(m.img, 160)}" alt="${o.name}" loading="lazy"
        style="width:56px;height:56px;border-radius:13px;object-fit:cover;flex:none;background:var(--brand-050)">` : ''}
      <span class="grow">
        <span class="row-b" style="gap:8px">
          <b style="font:800 15px/1.2 var(--font)">${o.name}</b>
          <span class="st collected">Олгосон</span>
        </span>
        <span class="tnum" style="font:700 13px/1.3 var(--font);color:var(--text-secondary);display:block;margin-top:3px">
          № ${o.id} · ${slot ? slot.time : ''}
        </span>
        <span class="t-body-sm dim" style="display:block;margin-top:2px">${o.when}</span>
      </span>
      <span class="tnum" style="font:800 15px/1 var(--font);flex:none">${price(o.price)}</span>
    </div>
    <div style="margin-top:12px">
      ${btn('Дахин захиалах', { variant: 'outline', size: 'block', onclick: `reorderByName('${o.name}')`, iconR: 'refresh' })}
    </div>
  </div>`;
}
function pastGroups(list) {
  const g = [];
  list.forEach(o => {
    let b = g.find(x => x.k === o.when);
    if (!b) { b = { k: o.when, items: [] }; g.push(b); }
    b.items.push(o);
  });
  return g;
}

defineScreen('orders', {
  name: 'Захиалгууд', group: 'Student', nav: 'orders',
  note: 'Order history — active tab with QR, past tab grouped by day',
  render() {
    const live = APP.orderTab === 'live';
    const o = ORDERS.live;
    return `
    ${appbar({
      title: 'Захиалга',
      sub: live ? `${o.id} · ${o.from}` : `${ORDERS.past.length} өмнөх захиалга`,
      right: `<button class="iconbtn ghost" onclick="go('queue')" aria-label="Цагаа сонгох">${icon('clock', 21)}</button>`,
    })}

    <div class="scroll">
      <div class="pad" style="margin-top:4px">
        <div class="seg">
          <button class="${live ? 'on' : ''}" onclick="setOrderTab('live')">Идэвхтэй</button>
          <button class="${live ? '' : 'on'}" onclick="setOrderTab('past')">Өмнөх</button>
        </div>
      </div>

      ${live ? `
      <div class="pad stack" style="margin-top:18px" aria-live="polite">
        <div class="card">
          <div class="row-b">
            <span class="t-caption dim-2">ЗАХИАЛГА</span>
            <span class="tnum" style="font:800 15px/1 var(--font)">№ ${o.id}</span>
          </div>
          <div style="margin-top:14px">
            ${CART.items.length ? CART.items.map(it => {
              const m = MENU.find(x => x.id === it.id);
              return m ? `<div class="row gap-3" style="padding:8px 0">
                <img src="${IMG(m.img, 120)}" alt="${m.name}" loading="lazy"
                  style="width:44px;height:44px;border-radius:12px;object-fit:cover;flex:none;background:var(--brand-050)">
                <span class="grow">
                  <span style="font:700 14px/1.2 var(--font);display:block">${m.name}</span>
                  <span class="t-body-sm dim">${it.qty} ш</span>
                </span>
                <span class="tnum" style="font:800 14px/1 var(--font)">${price(m.price * it.qty)}</span>
              </div>` : '';
            }).join('') : `
              <div class="row gap-3" style="padding:8px 0">
                <span style="width:44px;height:44px;border-radius:12px;background:var(--brand-050);display:grid;place-items:center;flex:none;color:var(--brand-600)">${icon('bowl', 20)}</span>
                <span class="grow">
                  <span style="font:700 14px/1.2 var(--font);display:block">Тахианы цуйван</span>
                  <span class="t-body-sm dim">${ORDERS.past[0] ? '1 ш' : ''}</span>
                </span>
              </div>`}
          </div>
          <div class="row-b" style="margin-top:10px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="row gap-2 t-body-sm dim">${icon('clock', 17)} ${o.from}</span>
            <span class="st preparing">${icon('clock', 12)}Бэлтгэж байна</span>
          </div>
        </div>

        <div class="card flat" style="background:var(--brand-050);box-shadow:none">
          <div class="row gap-3">
            <span style="width:40px;height:40px;border-radius:12px;background:var(--brand-600);color:#fff;display:grid;place-items:center;flex:none">${icon('qr', 20)}</span>
            <span class="grow">
              <span style="font:800 14px/1.2 var(--font);display:block">QR код бэлэн байна</span>
              <span class="t-body-sm" style="color:var(--brand-700);display:block;margin-top:2px">${o.from} цэгт ирж уншуулна уу.</span>
            </span>
          </div>
          <div style="margin-top:12px">
            ${btn('QR кодоо харах', { size: 'lg block', onclick: "go('qr')", iconL: 'qr' })}
          </div>
        </div>

        <div class="row gap-2">
          ${btn('Захиалгын дэлгэрэнгүй', { variant: 'outline', size: 'lg grow', onclick: "go('track')" })}
        </div>
      </div>
      ` : `
      <div class="pad stack" style="margin-top:18px">
        ${ORDERS.past.length ? pastGroups(ORDERS.past).map(g => `
          <div>
            ${secHead(g.k.toUpperCase(), `${g.items.length} захиалга`)}
            <div class="stack-sm">${g.items.map(orderCard).join('')}</div>
          </div>`).join('') : `
          <div class="empty">
            <div class="ic">${icon('box', 30)}</div>
            <h3>Өмнөх захиалга байхгүй.</h3>
            <p>Эхний удааа захиалга өгөхөд энд харагдана.</p>
            ${btn('Меню үзэх', { onclick: "go('menu')" })}
          </div>`}
      </div>
      `}
      <div style="height:26px"></div>
    </div>

    ${nav('orders')}`;
  },
});

/* ============================================================
   FAVOURITES (§5.36)
   ============================================================ */
defineScreen('fav', {
  name: 'Дуртай хоол', group: 'Student', nav: 'menu',
  note: 'Favourites — one-tap re-order',
  render() {
    const list = STATE.favorites.map(id => MENU.find(m => m.id === id)).filter(Boolean);
    return `
    ${appbar({
      title: 'Дуртай хоолнууд',
      sub: `${list.length} хоол · Дахин захиалах`,
      back: "go('home')",
      right: `<button class="iconbtn ghost" onclick="go('menu')" aria-label="Меню">${icon('bowl', 21)}</button>`,
    })}

    <div class="scroll">
      ${list.length ? `
      <div class="pad stack" style="margin-top:6px">
        ${list.map(m => `
        <div class="card">
          <div class="row gap-3" style="align-items:flex-start">
            <button onclick="go('food','${m.id}')" aria-label="${m.name}"
              style="width:72px;height:72px;border-radius:14px;overflow:hidden;flex:none;background:var(--brand-050)">
              <img src="${IMG(m.img, 200)}" alt="${m.name}" loading="lazy"
                style="width:100%;height:100%;object-fit:cover;display:block">
            </button>
            <span class="grow">
              <span class="row gap-2">
                <b style="font:800 15px/1.2 var(--font)">${m.name}</b>
                <span class="row gap-1" style="color:var(--accent-600);font:700 12px/1 var(--font)">${icon('star', 12)}${m.rating.toFixed(1)}</span>
              </span>
              <span class="t-body-sm trunc" style="color:var(--text-secondary);display:block;margin-top:4px">${m.ing.join(' · ')}</span>
              <span class="row-b" style="margin-top:8px">
                <span class="tnum" style="font:800 16px/1 var(--font);letter-spacing:-.3px">${price(m.price)}</span>
                <span class="t-body-sm dim tnum">${m.kcal} kcal</span>
              </span>
            </span>
            <button class="iconbtn ghost" onclick="favFlip('${m.id}')" aria-label="Дуртай цэвэрлэх"
              style="flex:none;color:var(--danger)">${iconFill('heart', 21)}</button>
          </div>
          <div style="margin-top:12px">
            ${btn('Дахин захиалах', { variant: 'secondary', size: 'block', onclick: `quickAdd('${m.id}',this)` })}
          </div>
        </div>`).join('')}
        <div class="t-body-sm dim-2" style="text-align:center;padding:6px 0 0">
          ${btn('Мөн хоолоо нэмэх', { variant: 'ghost', onclick: "go('menu')", iconL: 'plus' })}
        </div>
      </div>` : `
      <div class="empty">
        <div class="ic">${icon('heart', 30)}</div>
        <h3>Дуртай хоол байхгүй байна</h3>
        <p>Хоолны хуудсан дээрх зүрх дээр дарж, дуртай хоолнуудаа хуримтлаарай.</p>
        ${btn('Меню үзэх', { onclick: "go('menu')" })}
      </div>`}
      <div style="height:26px"></div>
    </div>

    ${nav('menu')}`;
  },
});

/* ============================================================
   WALLET (§5.13) + top-up
   ============================================================ */
function txRows(list) {
  if (!list.length) {
    return `<div class="empty">
      <div class="ic">${icon('receipt', 30)}</div>
      <h3>Гүйлгээ одоогоор алга.</h3>
      <p>Эхний цэнэглэлтээс эхлэн гүйлгээ энд харагдана.</p>
    </div>`;
  }
  let run = WALLET.balance;
  return `<div class="rows">
    ${list.map(t => {
      const up = t.amt > 0;
      run -= t.amt;
      return `
      <div class="row-item" style="min-height:62px">
        <span class="ic" style="background:${up ? 'var(--success-bg)' : 'var(--brand-050)'};color:${up ? 'var(--success)' : 'var(--brand-600)'}">
          ${icon(t.kind === 'topup' ? 'wallet' : 'bowl', 18)}
        </span>
        <span class="grow">
          <span class="tt">${t.label}</span>
          <span class="sub tnum">${t.when}${t.id ? ` · № ${t.id}` : ''}</span>
        </span>
        <span class="col" style="flex:none;align-items:flex-end;gap:2px">
          <span class="tnum" style="font:800 15px/1.1 var(--font);color:${up ? 'var(--success)' : 'var(--text-primary)'}">
            ${up ? '+' : '−'}${price(Math.abs(t.amt))}</span>
          <span class="t-caption dim-2 tnum">${price(run)}</span>
        </span>
      </div>`;
    }).join('')}
  </div>`;
}

function setTopup(n) { APP.topupAmount = n; paintOverlay(); }
function setTopupCustom(v) {
  const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10);
  APP.topupAmount = isNaN(n) ? 0 : n;
  paintOverlay();
}
function confirmTopup() {
  const a = APP.topupAmount;
  if (a < 1000) return;
  WALLET.balance += a;
  WALLET.tx.unshift({ amt: a, label: 'Цэнэглэлт', when: 'Үүгээр', kind: 'topup' });
  APP.topupAmount = TOPUP_PRESETS[1];
  go('wallet');
}

/** Bottom-sheet body used by home, cart and parent-home (openSheet('topup')). */
function topupSheet() {
  const amt = APP.topupAmount || 0;
  const bad = amt < 1000;
  const after = WALLET.balance + (bad ? 0 : amt);
  return {
    html: sheet('topup', 'Цэнэглэх', `
      <div class="row-b" style="margin-bottom:14px">
        <span class="t-body-sm dim">Одоогийн үлдэгдэл</span>
        <span class="t-money tnum" style="font:800 19px/1 var(--font)">${price(WALLET.balance)}</span>
      </div>

      <div class="tiles c2" style="gap:10px">
        ${TOPUP_PRESETS.map(p => `
          <button aria-pressed="${amt === p}" onclick="setTopup(${p})"
            style="background:${amt === p ? 'var(--brand-050)' : 'var(--surface)'};box-shadow:${amt === p ? 'inset 0 0 0 2px var(--brand-600)' : 'var(--sh-sm)'};
                   border-radius:var(--r-card);padding:16px 8px;text-align:center">
            <span class="tnum" style="font:800 17px/1 var(--font);letter-spacing:-.4px;color:${amt === p ? 'var(--brand-700)' : 'var(--text-primary)'}">${price(p)}</span>
          </button>`).join('')}
      </div>

      <div class="t-label dim-2" style="margin:18px 0 6px 2px">ДУРСЫН ДҮН</div>
      <div class="search">
        <span class="ic">${icon('card', 19)}</span>
        <input inputmode="numeric" aria-label="Цэнэглэх дүн" placeholder="Жишээ: 15000"
          value="${esc(String(amt || ''))}" onchange="setTopupCustom(this.value)">
      </div>
      <p class="t-body-sm dim-2" style="margin:8px 2px 0">Хамгийн бага дүн ${price(1000)}.</p>

      ${bad ? alert('warn', 'Дүн оруулна уу', `${price(1000)}-аас бага байж болохгүй.`) : `
        <div class="row-b" style="margin-top:18px;padding-top:16px;border-top:1px solid var(--border)">
          <span class="t-body-sm dim">Дараагийн үлдэгдэл</span>
          <span class="t-money tnum">${price(after)}</span>
        </div>`}

      <div style="margin-top:16px">
        ${bad ? btn('Дүн оруулна уу', { size: 'lg block', disabled: true })
              : btn(`Цэнэглэх · ${price(amt)}`, { size: 'lg block', onclick: "closeSheet();go('topupConfirm')" })}
      </div>
    `),
  };
}

function txSheet() {
  return { html: sheet('tx', 'Гүйлгээ', txRows(WALLET.tx)) };
}

defineScreen('wallet', {
  name: 'Wallet', group: 'Student', nav: 'wallet',
  note: 'Amjilt Wallet — balance, top-up, transactions with running balance',
  render() {
    const low = WALLET.balance < PARENT.todaySpend;
    return `
    ${appbar({
      title: 'Amjilt Wallet',
      sub: CAST.student.name,
      right: `<button class="iconbtn ghost" onclick="go('notifs')" aria-label="Мэдэгдэл">${icon('bell', 21)}</button>`,
    })}

    <div class="scroll">
      <div class="pad" style="margin-top:4px">
        <div class="wallet-card">
          <span class="glyph">${icon('wallet', 120, '')}</span>
          <div class="lbl">AMJILT WALLET</div>
          <div class="amt tnum">${price(WALLET.balance)}</div>
          <div class="row-b">
            <div>
              <div style="font:800 13px/1.2 var(--font)">${CAST.student.name} · ${CAST.student.klass}</div>
              <div class="num" style="margin-top:3px">${WALLET.card}</div>
            </div>
            <span class="btn-add">${icon('shield', 15)} Хамгаалагдсан</span>
          </div>
        </div>
      </div>

      <div class="pad" style="margin-top:16px">
        <div class="row gap-3">
          <div class="grow">${btn('Цэнэглэх', { size: 'lg block', onclick: "openSheet('topup')", iconL: 'wallet' })}</div>
          <div class="grow">${btn('Гүйлгээ харах', { variant: 'outline', size: 'lg block', onclick: "openSheet('tx')", iconL: 'receipt' })}</div>
        </div>
      </div>

      ${low ? `<div class="pad" style="margin-top:16px">${alert('warn', 'Үлдэгдэл бага байна', 'Дараагийн хоолнуудаа авахын тулд цэнэглээрэй.')}</div>` : ''}

      <div style="margin-top:24px">
        ${secHead('Сүүлийн үйлдлүүд', 'Бүгдийг', "openSheet('tx')")}
        <div class="pad">${txRows(WALLET.tx)}</div>
      </div>
      <div style="height:26px"></div>
    </div>

    ${nav('wallet')}`;
  },
  sheet(id) {
    if (id === 'topup') return topupSheet();
    if (id === 'tx') return txSheet();
    return null;
  },
});

/* ============================================================
   TOP-UP CONFIRM (§5.13)
   ============================================================ */
defineScreen('topupConfirm', {
  name: 'Цэнэглэх баталгаа', group: 'Student',
  note: 'Top-up confirmation — new balance preview before committing',
  render() {
    const amt = APP.topupAmount || 0;
    const ok = amt >= 1000;
    return `
    ${appbar({ back: "go('wallet')", title: 'Цэнэглэлт', sub: 'Amjilt Wallet' })}

    <div class="scroll">
      <div class="pad" style="margin-top:18px;text-align:center">
        <div class="t-caption dim-2">ЦЭНЭГЛЭХ ДҮН</div>
        <div class="t-money-lg tnum" style="margin-top:8px">${price(amt)}</div>
      </div>

      <div class="pad" style="margin-top:22px">
        <div class="card">
          <div class="row-b">
            <span class="t-body-sm dim">Одоогийн үлдэгдэл</span>
            <span class="tnum" style="font:700 15px/1 var(--font)">${price(WALLET.balance)}</span>
          </div>
          <div class="row-b" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="t-body-sm dim">Нэмэх</span>
            <span class="tnum" style="font:800 15px/1 var(--font);color:var(--success)">+${price(ok ? amt : 0)}</span>
          </div>
          <div class="row-b" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="t-section">Дараагийн үлдэгдэл</span>
            <span class="t-money tnum">${price(WALLET.balance + (ok ? amt : 0))}</span>
          </div>
        </div>
      </div>

      <div class="pad" style="margin-top:16px">
        <div class="rows">
          <div class="row-item">
            <span class="ic">${icon('wallet', 19)}</span>
            <span class="grow">
              <span class="tt">Amjilt Wallet</span>
              <span class="sub tnum">${WALLET.card} · ${CAST.student.name}</span>
            </span>
            <span style="width:22px;height:22px;border-radius:50%;background:var(--brand-600);color:#fff;display:grid;place-items:center;flex:none">${icon('check', 14)}</span>
          </div>
        </div>
      </div>

      <div class="pad" style="margin-top:16px">
        ${alert('info', 'Хугацаа', 'Цэнэглэлт батлагдсны дараа шууд Wallet-т орно. Буцаах боломжгүй.')}
      </div>
      <div class="pad" style="margin-top:14px">
        <div class="trust">${icon('lock', 14)} Төлбөрийн мэдээлэл хамгаалагдсан.</div>
      </div>
      <div style="height:26px"></div>
    </div>

    <div class="sticky-cta">
      ${ok ? btn(`Цэнэглэх · ${price(amt)}`, { size: 'lg block', onclick: 'confirmTopup()' })
           : btn('Дүн оруулна уу', { size: 'lg block', disabled: true })}
    </div>`;
  },
});

/* ============================================================
   PROFILE (§5.14)
   ============================================================ */
defineScreen('profile', {
  name: 'Профайл', group: 'Student', nav: 'profile',
  note: 'Profile — settings rows, no nesting deeper than one level',
  render() {
    return `
    ${appbar({ title: 'Профайл' })}

    <div class="scroll">
      <div class="pad">
        <div class="card" style="display:flex;align-items:center;gap:14px">
          ${avatar(CAST.student.name)}
          <span class="grow">
            <b style="font:800 17px/1.2 var(--font);display:block;letter-spacing:-.3px">${CAST.student.name}</b>
            <span class="t-body-sm dim">${CAST.student.klass} · ${CAST.student.code}</span>
          </span>
          <button class="iconbtn ghost" onclick="openSheet('me')" aria-label="Хувийн мэдээлэл">${icon('settings', 20)}</button>
        </div>
      </div>

      <div class="pad" style="margin-top:20px">
        ${secHead('Тохиргоо')}
        <div class="rows">
          ${rowItem('person', 'Хувийн мэдээлэл', `${CAST.student.name} · ${CAST.student.klass}`, { onclick: "openSheet('me')" })}
          ${rowItem('card', 'Wallet', `${price(WALLET.balance)}`, { onclick: "go('wallet')" })}
          ${rowItem('bag', 'Захиалгын түүх', `№ ${ORDERS.live.id} · ${ORDERS.live.from}`, { onclick: "go('orders')" })}
          ${rowItem('alert', 'Хүнсний харшил', STATE.allergies.length ? STATE.allergies.join(', ') : 'Байхгүй', { onclick: "go('allergies')" })}
          ${rowItem('chart', 'Зарцуулалтын лимит', `${price(PARENT.todaySpend)} / ${price(PARENT.limit)}`, { onclick: "go('limit')" })}
        </div>
      </div>

      <div class="pad" style="margin-top:20px">
        ${secHead('Дэмжлэг')}
        <div class="rows">
          ${rowItem('bell', 'Мэдэгдэл', `${NOTIFICATIONS.filter(n => n.unread).length} уншсангүй`, { onclick: "go('notifs')" })}
          ${rowItem('help', 'Тусламж', 'Түгээмжлэл, асуулт', { onclick: "openSheet('help')" })}
          ${rowItem('lock', 'Нууцлал', 'Нууц үг, QR дүүргэлт', { onclick: "openSheet('sec')" })}
        </div>
      </div>

      <div class="pad" style="margin-top:22px">
        ${btn('Гаргах', { variant: 'outline', size: 'lg block', onclick: "APP.role='student';go('login')", iconL: 'logout' })}
        <div class="t-body-sm dim-2" style="text-align:center;margin-top:16px">
          Amjilt Canteen · ${CAST.student.klass}
        </div>
      </div>
      <div style="height:26px"></div>
    </div>

    ${nav('profile')}`;
  },
  sheet(id) {
    if (id === 'me') return {
      html: sheet('me', 'Хувийн мэдээлэл', `
        <div class="rows">
          ${rowItem('person', 'Нэр', CAST.student.name, { chev: false })}
          ${rowItem('grid', 'Анги', CAST.student.klass, { chev: false })}
          ${rowItem('scan', 'Сурагчийн код', CAST.student.code, { chev: false })}
          ${rowItem('card', 'Утас', CAST.student.phone, { chev: false })}
        </div>
        ${alert('info', 'Өөрчлөх', 'Мэдээллийг ангийн багш эсвэл сургуулийн админ эсвэл засаж болно.')}`),
    };
    if (id === 'help') return {
      html: sheet('help', 'Тусламж', `
        <div class="rows">
          ${rowItem('qr', 'QR код хэрхэн ашиглах вэ?', 'Цайны газарт ирээд уншигчийн дээр зураагдана', { chev: false })}
          ${rowItem('clock', 'Авах цаг солих', 'Сагсны «Авах цаг» дээр дарна', { chev: false })}
          ${rowItem('card', 'Wallet цэнэглэх', 'Нүүр дээрх Wallet картаас', { chev: false })}
          ${rowItem('bell', 'Мэдэгдэл хаана', 'Нүүр дээд талын хоншны дүрэнд', { chev: false })}
        </div>
        <div style="margin-top:16px">
          ${btn('Асуудал хэвээр байна', { variant: 'outline', size: 'lg block', onclick: "closeSheet();go('profile')", iconL: 'help' })}
        </div>`),
    };
    if (id === 'sec') return {
      html: sheet('sec', 'Нууцлал', `
        <div class="rows">
          ${rowItem('qr', 'QR кодыг дүүргэх', 'Авах ээлжээр QR автоматаар шинэчилнэ', { chev: false, right: '<span class="sw on"></span>' })}
          ${rowItem('scan', 'Авах цаг сануулга', 'Авах цаг ээлжлэхэд мэдэгдэнэ', { chev: false, right: '<span class="sw on"></span>' })}
          ${rowItem('users', 'Гэр бүлийн үзэх эрх', 'Эцэг эх захиалгыг харж болно', { chev: false, right: '<span class="sw"></span>' })}
        </div>
        ${alert('info', 'Нууц үг солих', 'Нууц үгээ мартсан бол нэвтрэлтийн хуудсанд холбоно уу.')}`),
    };
    return null;
  },
});

/* ============================================================
   ALLERGIES (§5.15) — writes STATE.allergies, live dish preview
   ============================================================ */
function pickAllergy(a) {
  if (a === '__none') { STATE.allergies = []; go(APP.route, APP.param); return; }
  const i = STATE.allergies.indexOf(a);
  if (i >= 0) STATE.allergies.splice(i, 1); else STATE.allergies.push(a);
  go(APP.route, APP.param);
}
function allergyBody(isParent) {
  const hits = MENU.filter(m => m.allergens.some(a => STATE.allergies.includes(a)));
  const none = STATE.allergies.length === 0;
  return `
  <div class="scroll">
    <div class="pad stack" style="margin-top:6px">
      <div class="t-section">${isParent ? 'Хүүхдэд ямар хүнсний харшил байна вэ?' : 'Танд ямар хүнсний харшил байна вэ?'}</div>
      <p class="t-body-sm dim">Олноор сонгоно. Энэ хоолонд агуулагдах бүх хоолд ⚠ тэмдэг гарна.</p>

      <div class="row gap-2 wrap">
        <button class="alrg-chip ${none ? 'on' : ''}" onclick="pickAllergy('__none')">
          ${icon('check', 15)} Байхгүй
        </button>
        ${ALLERGENS.map(a => `
          <button class="alrg-chip ${STATE.allergies.includes(a) ? 'on' : ''}"
            aria-pressed="${STATE.allergies.includes(a)}" onclick="pickAllergy('${a}')">
            ${STATE.allergies.includes(a) ? icon('check', 15) : icon('plus', 15)} ${a}
          </button>`).join('')}
      </div>

      ${none ? alert('ok', 'Одоогоор харшил сэрэгдээгүй байна', 'Аль нэгийг сонгоход доор хамааралтай хоолнууд гарна.') : `
        ${alert('warn', `${STATE.allergies.length} харшил сонгогдсон`,
          `Хамгийн их: ${STATE.allergies.join(', ')}. Эдгээр нь ${hits.length} хоолонд байна.`)}`}

      ${hits.length ? `
      <div>
        ${secHead(`${hits.length} хоолд хамаарна`)}
        <div class="rows">
          ${hits.map(m => `
            <button class="row-item" onclick="go('food','${m.id}')">
              <img src="${IMG(m.img, 120)}" alt="${m.name}" loading="lazy"
                style="width:44px;height:44px;border-radius:12px;object-fit:cover;flex:none;background:var(--brand-050)">
              <span class="grow">
                <span class="tt">${m.name}</span>
                <span class="sub" style="color:var(--accent-700)">${m.allergens.filter(a => STATE.allergies.includes(a)).join(', ')}</span>
              </span>
              <span class="tnum" style="font:800 14px/1 var(--font);flex:none">${price(m.price)}</span>
            </button>`).join('')}
        </div>
      </div>` : `
      <div class="card flat">
        <div class="row gap-3">
          <span style="width:40px;height:40px;border-radius:12px;background:var(--success-bg);color:var(--success);display:grid;place-items:center;flex:none">${icon('shield', 20)}</span>
          <span class="grow">
            <span style="font:800 14px/1.2 var(--font);display:block">Өнөөдрийн хоол бүгд тохирно</span>
            <span class="t-body-sm dim">Одоогоор харшилд орох хоол олдсонгүй.</span>
          </span>
        </div>
      </div>`}

      <div class="t-body-sm dim-2">
        Энэ нь зөвхөн энэ төхөөржмийн эсвэл хувийн дүрэмд хүчин төгөлдөр. Шийдвэрийг эмч, сургуулын эмчлэгчтэй зөвшөөрнө.
      </div>
      <div style="height:12px"></div>
    </div>
  </div>

  <div class="sticky-cta">
    ${btn('Хадгалах', { size: 'lg block', onclick: isParent ? "go('parent-home')" : "go('menu')" })}
  </div>`;
}

defineScreen('allergies', {
  name: 'Хүнсний харшил', group: 'Student',
  note: 'Allergy settings — multi-select chips + live affected-dish preview',
  render() { return allergyBody(false); },
});

/* ============================================================
   SPENDING LIMIT (§5.15 / §4.9)
   ============================================================ */
function setLimit(n) { APP.limitInput = n; go(APP.route, APP.param); }
function saveLimit(back) { PARENT.limit = APP.limitInput; go(back); }
function limitBody(isParent) {
  const spend = PARENT.todaySpend;
  const lim = APP.limitInput || PARENT.limit;
  const st = limitState(spend, lim);
  const pct = Math.min(100, Math.round(spend / lim * 100));
  const fill = st.color === 'red' ? 'red' : st.color === 'orange' ? 'orange' : '';
  const presets = [PARENT.limit, PARENT.limit / 2, PARENT.limit + PARENT.todaySpend / 2, PARENT.limit * 2]
    .filter((v, i, a) => v > 0 && a.indexOf(v) === i);

  return `
  <div class="scroll">
    <div class="pad stack" style="margin-top:6px">
      <div class="card">
        <div class="t-caption dim-2">ӨНӨӨДӨР ЗАРЦУУЛСАН</div>
        <div class="row-b" style="margin-top:8px">
          <span class="t-money-lg tnum">${price(spend)}</span>
          <span class="t-body-sm dim tnum">/ ${price(lim)}</span>
        </div>
        <div class="meter" style="margin-top:14px"><i class="${fill}" style="width:${pct}%"></i></div>
        <div class="row-b" style="margin-top:8px">
          <span class="t-caption dim-2 tnum">${pct}%</span>
          <span class="t-caption dim-2 tnum">${price(Math.max(0, lim - spend))} үлдэх</span>
        </div>
      </div>

      ${st.key === 'over' ? alert('bad', 'Лимит дагажсан', `Өнөөдөр ${price(spend)} зарцуулсан. Дараагийн захиалгыг хүлээн авч чадахгүй.`)
        : st.key === 'near' ? alert('warn', 'Лимитэд ойролцоо байна',
            `${price(spend)} / ${price(lim)} — ${pct}%. Өдөр бүрийн хоол 4,000–5,500₮ тул багцаана.`)
        : alert('ok', 'Лимит хэвээр байна', `${price(lim)} өдөрт хангалттай.`)}

      <div>
        ${secHead('Өдрийн лимит')}
        <div class="row gap-2 wrap">
          ${presets.map(v => `<button class="chip ${APP.limitInput === v ? 'on' : ''}" onclick="setLimit(${v})">${price(v)}</button>`).join('')}
        </div>
      </div>

      <div>
        <div class="t-label dim-2" style="margin:0 0 6px 2px">ГАР АВЧ ТОХИРУУЛАХ</div>
        <div class="search">
          <span class="ic">${icon('card', 19)}</span>
          <input inputmode="numeric" aria-label="Өдрийн лимит" value="${esc(String(APP.limitInput))}"
            onchange="setLimit(parseInt(String(this.value).replace(/[^0-9]/g,''),10)||0)">
        </div>
      </div>

      <div class="card flat">
        <div class="row-b">
          <span class="t-body-sm dim">Энэ 7 хоног</span>
          <span class="tnum" style="font:800 15px/1 var(--font)">${price(PARENT.weekSpend)}</span>
        </div>
        <div class="row-b" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <span class="t-body-sm dim">Дундаж өдөрт</span>
          <span class="tnum t-body-sm" style="font-weight:700">${price(Math.round(PARENT.weekSpend / 7))}</span>
        </div>
      </div>

      ${alert('info', 'Лимит дагажсан үед', 'Захиалга хэдэн ч төлбөгүй үлдэхгүй гэж мэдэгдэнэ. Өдөр бүр 00:00-д тэгээрээ.')}
      <div style="height:12px"></div>
    </div>
  </div>

  <div class="sticky-cta">
    ${btn('Хадгалах', { size: 'lg block', onclick: isParent ? "saveLimit('parent-home')" : "saveLimit('profile')" })}
  </div>`;
}

defineScreen('limit', {
  name: 'Зарцуулалтын лимит', group: 'Student',
  note: 'Daily spending limit — orange warning state from limitState()',
  render() { return limitBody(false); },
});

/* ============================================================
   NOTIFICATION CENTRE (§9)
   ============================================================ */
function notifRows(list) {
  if (!list.length) {
    return `<div class="empty">
      <div class="ic">${icon('bell', 30)}</div>
      <h3>Мэдэгдэл алга</h3>
      <p>Одоогоор шинэ мэдэгдэл байхгүй байна.</p>
    </div>`;
  }
  return `<div class="stack-sm">
    ${list.map(n => {
      const warn = n.kind === 'warn';
      const unread = !!n.unread;
      return `
      <div class="rows" style="${unread ? 'background:var(--brand-050);box-shadow:inset 0 0 0 1.5px var(--brand-200);' : ''}">
        <div class="row-item">
          <span class="ic" style="background:${warn ? 'var(--warning-bg)' : 'var(--success-bg)'};color:${warn ? '#9A6A06' : 'var(--success)'}">
            ${icon(warn ? 'alert' : 'checkC', 18)}
          </span>
          <span class="grow">
            <span class="tt">${n.t}</span>
            <span class="sub tnum">${n.d || ''}${n.d && n.when ? ' · ' : ''}${n.when || ''}</span>
          </span>
          ${unread ? '<i style="width:8px;height:8px;border-radius:50%;background:var(--brand-600);flex:none" title="Уншсангүй"></i>' : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}
function readAllNotifs() { NOTIFICATIONS.forEach(n => { n.unread = false; }); go('notifs'); }
function readAllParentNotifs() { PARENT.notifications.forEach(n => { n.unread = false; }); go('parent-notifs'); }

defineScreen('notifs', {
  name: 'Мэдэгдэл', group: 'Student',
  note: 'Notification centre — unread rows distinct, read-all action',
  render() {
    const unread = NOTIFICATIONS.filter(n => n.unread).length;
    return `
    ${appbar({
      back: "go('profile')",
      title: 'Мэдэгдэл',
      sub: unread ? `${unread} уншсангүй` : 'Бүгдийг уншсан',
    })}

    <div class="scroll">
      <div class="pad" style="margin-top:6px">
        ${unread ? btn('Бүгдийг уншсан', { variant: 'secondary', size: 'block', onclick: 'readAllNotifs()', iconL: 'check' }) : ''}
        <div style="height:${unread ? 16 : 0}px"></div>
        ${notifRows(NOTIFICATIONS)}
      </div>
      <div class="pad" style="margin-top:20px">
        ${alert('info', 'Мэдэгдэл зөвхөн чухал', 'Захиалга бэлэн, төлбөр амжилттай, үлдэгдэл бага үед л илгээнэ.')}
      </div>
      <div style="height:26px"></div>
    </div>`;
  },
});

/* ============================================================
   RATING (§9)
   ============================================================ */
function addRating(n) { APP.rating = n; go('rate'); }
function toggleRatingTag(t) {
  const i = APP.ratingTags.indexOf(t);
  if (i >= 0) APP.ratingTags.splice(i, 1); else APP.ratingTags.push(t);
  go('rate');
}
function submitRating() { APP.rating = 0; APP.ratingTags = []; go('track'); }

defineScreen('rate', {
  name: 'Үнэлэх', group: 'Student',
  note: 'Meal rating — 44px stars, quick tags, optional comment',
  render() {
    const m = MENU.find(x => x.id === (CART.items[0] || {}).id) || MENU[0];
    const ok = APP.rating > 0;
    return `
    ${appbar({ back: "go('track')", title: 'Үнэлэгээ' })}

    <div class="scroll">
      <div class="pad" style="padding-top:20px;text-align:center">
        <img src="${IMG(m.img, 300)}" alt="${m.name}" loading="lazy"
          style="width:84px;height:84px;border-radius:20px;object-fit:cover;margin:0 auto;display:block;background:var(--brand-050)">
        <h1 class="t-title" style="margin-top:18px">Хоол ямар байв?</h1>
        <p class="t-body-sm dim" style="margin-top:6px">${m.name} · ${price(m.price)}</p>
      </div>

      <div class="pad" style="margin-top:22px">
        <div class="card" style="display:flex;justify-content:center;gap:2px">
          ${[1, 2, 3, 4, 5].map(n => `
            <button onclick="addRating(${n})" aria-label="${n} од"
              style="width:44px;height:44px;display:grid;place-items:center;border-radius:var(--r-pill)">
              <svg width="32" height="32" viewBox="0 0 24 24"
                fill="${n <= APP.rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"
                style="color:${n <= APP.rating ? 'var(--accent-500)' : 'var(--border-strong)'}">${ICONS.star}</svg>
            </button>`).join('')}
        </div>
        <div class="t-body-sm dim-2" style="text-align:center;margin-top:10px">
          ${APP.rating === 0 ? 'Үнэлгээгээ сонгоно уу' :
            APP.rating <= 2 ? 'Цааш сайжруулъя' :
            APP.rating === 3 ? 'Дунджаар' :
            APP.rating === 4 ? 'Маш сайн' : 'Маш сайн. Өдөр бүр ийм байг!'}
        </div>
      </div>

      <div class="pad" style="margin-top:22px">
        ${secHead('Хурдан сонгох')}
        <div class="row gap-2 wrap">
          ${RATING_TAGS.map(t => `
            <button class="chip ${APP.ratingTags.includes(t) ? 'on' : ''}"
              aria-pressed="${APP.ratingTags.includes(t)}" onclick="toggleRatingTag('${t}')">
              ${APP.ratingTags.includes(t) ? icon('check', 14) : ''} ${t}
            </button>`).join('')}
        </div>
      </div>

      <div class="pad" style="margin-top:20px">
        <div class="t-label dim-2" style="margin:0 0 6px 2px">СЭТГЭГДЭЛ (ЗААВАЛ БИШ)</div>
        <div class="search">
          <span class="ic">${icon('receipt', 19)}</span>
          <input aria-label="Сэтгэгдэл" placeholder="Сэтгэгдэл бичих...">
        </div>
      </div>

      <div style="height:56px"></div>
    </div>

    <div class="sticky-cta">
      ${btn(ok ? 'Үнэлэх' : 'Үнэлгээ сонгоно уу', { size: 'lg block', disabled: !ok, onclick: 'submitRating()' })}
    </div>`;
  },
});

/* ============================================================
   STATES GALLERY (§9) — empty / loading / error, side by side
   ============================================================ */
function exCard(label, hint, inner) {
  return `
  <div>
    <div class="t-caption dim-2" style="margin:0 0 6px 2px">${label}</div>
    <div class="card" style="padding:0;overflow:hidden">${inner}</div>
    ${hint ? `<p class="t-body-sm dim-2" style="margin:8px 2px 0">${hint}</p>` : ''}
  </div>`;
}

defineScreen('states', {
  name: 'Төлөвийн галерей', group: 'States',
  note: 'State gallery — empty / loading / error reviewed side by side',
  render() {
    return `
    ${appbar({
      title: 'Төлөвийн галерей',
      sub: 'Хоосон · Ачаалж байна · Алдаа',
      back: "go('home')",
    })}

    <div class="scroll">
      <div class="pad" style="margin-top:4px">
        ${alert('info', 'Дурын жагсаалт гурав дахь төлөвтэй байна',
          'Энд бүх төлөвийг нэг дэлгэц дээр үзүүлж байна. Жинхэнэ дэлгэцүүд дээр мөн адил хэрэглэгдэнэ.')}
      </div>

      <div class="pad stack" style="margin-top:24px">
        ${secHead('Хоосон төлөв')}
        ${exCard('Захиалга · Идэвхтэй', `Одоо ${ORDERS.live.id} байгаа үед харагдахгүй.`,
          `<div class="empty">
            <div class="ic">${icon('box', 30)}</div>
            <h3>Одоогоор идэвхтэй захиалга байхгүй.</h3>
            <p>Хоолоо захиалахад энд харагдана.</p>
            ${btn('Меню үзэх', { onclick: "go('menu')" })}
          </div>`)}
        ${exCard('Wallet · Гүйлгээ', 'Хоосон данс эсвэл эхний ашиглалтад.',
          `<div class="empty">
            <div class="ic">${icon('receipt', 30)}</div>
            <h3>Гүйлгээ одоогоор алга.</h3>
            <p>Эхний цэнэглэлтээс эхлэн гүйлгээ энд харагдана.</p>
            ${btn('Цэнэглэх', { onclick: "openSheet('topup')" })}
          </div>`)}
        ${exCard('Хайлт · Үр дүн', 'APP.search ямар ч үгээр хатуу хайлт хийхэд.',
          `<div class="empty">
            <div class="ic">${icon('search', 30)}</div>
            <h3>«бууз» гэсэн үгээр юу ч олдсонгүй</h3>
            <p>Бусад үгээр хайж үзээрэй. Өдөр бүр өдрийн хоол шинэчлэгдэнэ.</p>
            ${btn('Хайдалтыг цэвэрлэх', { variant: 'secondary', onclick: 'clearSearch()' })}
          </div>`)}
        ${exCard('Дуртай хоол', 'STATE.favorites хоосон үед.',
          `<div class="empty">
            <div class="ic">${icon('heart', 30)}</div>
            <h3>Дуртай хоол байхгүй байна</h3>
            <p>Хоолны хуудсан дээрх зүрх дээр дарж хуримтлаарай.</p>
            ${btn('Меню үзэх', { variant: 'outline', onclick: "go('menu')" })}
          </div>`)}
      </div>

      <div class="pad stack" style="margin-top:28px">
        ${secHead('Ачаалж байна')}
        ${exCard('Меню · Хайсан тоо', 'Жинхэнэ картын геометрийг яг тааруулсан. Төвлөрсөн спиннер биш.',
          `<div style="padding:16px" class="stack-sm">${skelRow()}${skelRow()}${skelRow()}</div>
           <div style="padding:0 16px 16px">${btn('Жинхэнэ дэлгэцийг үзэх', { variant: 'outline', size: 'block', onclick: "go('food','skeleton')" })}</div>`)}
        ${exCard('Меню · Өдрийн рейл', 'Хэвтээ рейлийн карт.',
          `<div class="rail-x" style="padding:16px 16px 4px;pointer-events:none">
             <span style="flex:none;display:block">${skelCard()}</span>
             <span style="flex:none;display:block">${skelCard()}</span>
           </div>`)}
        ${exCard('Захиалга · Түүх', 'Мөр бүрийн геометр 68px.',
          `<div style="padding:16px" class="stack-sm">${skelRow()}${skelRow()}${skelRow()}</div>
           <div style="padding:0 16px 16px">${btn('Жинхэнэ дэлгэцийг үзэх', { variant: 'outline', size: 'block', onclick: "go('orders')" })}</div>`)}
        ${exCard('Wallet · Гүйлгээ', 'Тоонуудыг уншдаг.',
          `<div style="padding:16px" class="stack-sm">${skelRow()}${skelRow()}${skelRow()}${skelRow()}</div>`)}
      </div>

      <div class="pad stack" style="margin-top:28px">
        ${secHead('Алдаа')}
        ${exCard('Захиалга баталгаажсангүй',
          'Төлбөрийн дараах холболт тасарсан үед. Дахин оролдох үргэлж байна.',
          `<div class="empty">
            <div class="ic">${icon('alert', 30)}</div>
            <h3>Захиалга баталгаажсангүй.</h3>
            <p>Интернет холболтоо шалгаад дахин оролдох но уу.</p>
            ${btn('Дахин оролдох', { onclick: "go('track')" })}
          </div>`)}
        ${exCard('Төлбөр амжилтгүй',
          'Банк эсвэл холболтын алдаа. Өөр арга сонгох заавал байна.',
          `<div class="empty">
            <div class="ic">${icon('x', 30)}</div>
            <h3>Төлбөр амжилтгүй боллоо.</h3>
            <p>Дүн хэвээр үлдсэн. Үргэлжлэх замыг солиод дахин оролдоно уу.</p>
            ${btn('Өөр төлбөрийн арга сонгох', { onclick: "go('payment')" })}
          </div>`)}
        ${exCard('Хоолны дэлгэрэнгүй',
          'Нэг хоолны мэдээлэл ачаагдахгүй бол. 44px-ийн дахин оролдох товчтой.',
          `<div class="empty">
            <div class="ic">${icon('alert', 30)}</div>
            <h3>Хоолны мэдээллийг ачааж чадсангүй.</h3>
            <p>Интернет холболтоо шалгаад дахин оролдох но уу.</p>
            ${btn('Дахин оролдох', { variant: 'outline', onclick: "go('food','error')" })}
          </div>`)}
      </div>

      <div class="pad stack" style="margin-top:28px">
        ${secHead('Мэдэгдэл · Уншсан / Уншаагүй')}
        ${exCard('Дурын төлөв', 'Уншсангүй мөр нь 8px brand-600 цэг + brand-050 дэвсгэртэй.',
          `<div style="padding:16px">${notifRows(NOTIFICATIONS.slice(0, 2))}</div>`)}
        ${exCard('Дуусах үед', 'Дурын жагсаалт дуусахад ижил загвар хэрэглэнэ.',
          `<div style="padding:16px">${notifRows([])}</div>`)}
      </div>
      <div style="height:34px"></div>
    </div>`;
  },
  sheet(id) { return id === 'topup' ? topupSheet() : null; },
});

/* ============================================================
   PARENT APP (§6)
   ============================================================ */
const PARENT_TONE = {
  ok:   { bg: 'var(--success-bg)', fg: 'var(--success)' },
  info: { bg: 'var(--brand-050)',  fg: 'var(--brand-600)' },
  warn: { bg: 'var(--warning-bg)', fg: '#9A6A06' },
  bad:  { bg: 'var(--danger-bg)',  fg: 'var(--danger)' },
};
function parentStat(label, value, icName, tone, sub) {
  const t = PARENT_TONE[tone] || PARENT_TONE.info;
  return `
  <div class="card">
    <div class="row gap-2">
      <span style="width:28px;height:28px;border-radius:9px;flex:none;background:${t.bg};color:${t.fg};display:grid;place-items:center">${icon(icName, 16)}</span>
      <span class="t-caption dim-2 trunc" style="letter-spacing:.5px">${label}</span>
    </div>
    <div class="t-money tnum" style="margin-top:10px;font-size:22px;line-height:1.1">${value}</div>
    ${sub ? `<div class="t-body-sm" style="margin-top:6px;color:${t.fg};font-weight:700">${sub}</div>` : ''}
  </div>`;
}
defineScreen('parent-home', {
  name: 'Эцэг эх — Нүүр', group: 'Parent', nav: 'home',
  note: 'Parent home — child switcher, spend, 7-day chart, limit meter',
  render() {
    const st = limitState(PARENT.todaySpend, PARENT.limit);
    const max = Math.max.apply(null, PARENT.week.concat([PARENT.todaySpend]));
    const fill = st.color === 'red' ? 'red' : st.color === 'orange' ? 'orange' : '';
    return `
    ${appbar({
      eyebrow: 'Эцэг эх',
      title: 'Сайн байна уу 👋',
      sub: CAST.parent.name,
      right: `<button class="iconbtn ghost" onclick="go('parent-notifs')" aria-label="Мэдэгдэл">${icon('bell', 21)}</button>`,
    })}

    <div class="scroll">
      <div class="pad" style="margin-top:4px">
        <!-- Child switcher -->
        <div class="card" style="display:flex;align-items:center;gap:12px">
          ${avatar(CAST.parent.child)}
          <span class="grow">
            <b style="font:800 16px/1.2 var(--font);display:block;letter-spacing:-.2px">${CAST.parent.child}</b>
            <span class="t-body-sm dim">${CAST.parent.childKlass}</span>
          </span>
          <span class="dim-2">${icon('down', 20)}</span>
        </div>
      </div>

      <div class="pad tiles c2" style="margin-top:16px">
        ${parentStat('ҮЛДЭГДЭЛ', price(WALLET.balance), 'wallet', 'ok')}
        ${parentStat('ӨНӨӨДРИЙН ЗАРЦУУЛАЛТ', price(PARENT.todaySpend), 'card',
          st.color === 'red' ? 'bad' : st.color === 'orange' ? 'warn' : 'info',
          `${st.label} · ${price(PARENT.limit)}`)}
      </div>

      <div class="pad" style="margin-top:20px">
        ${secHead('Энэ 7 хоног')}
        <div class="card">
          <div class="bar-chart">
            ${PARENT.week.map((v, i) => `
              <div class="bwrap">
                <span class="val tnum">${(v / 1000).toFixed(1)}к</span>
                <span class="b ${i === PARENT.week.length - 1 ? 'hi' : ''}" style="height:${Math.round(v / max * 100)}%"></span>
                <span class="lbl">${PARENT.weekDays[i]}</span>
              </div>`).join('')}
          </div>
          <div class="row-b" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="t-body-sm dim">Нийт</span>
            <span class="t-money tnum">${price(PARENT.weekSpend)}</span>
          </div>
        </div>
      </div>

      <div class="pad" style="margin-top:20px">
        ${secHead('Өдрийн лимит', 'Засах', "go('parent-limit')")}
        <div class="card">
          <div class="row-b">
            <span class="t-body-sm dim">Өнөөдрийн зарцуулалт</span>
            <span class="tnum t-body-sm" style="font-weight:700">${price(PARENT.todaySpend)} / ${price(PARENT.limit)}</span>
          </div>
          <div class="meter" style="margin-top:12px"><i class="${fill}" style="width:${Math.min(100, Math.round(PARENT.todaySpend / PARENT.limit * 100))}%"></i></div>
          ${st.key === 'near' ? `
            <div style="margin-top:14px">
              ${alert('warn', 'Лимитэд ойролцоо байна',
                `${price(PARENT.limit - PARENT.todaySpend)} үлдэж байна. Өдөр бүрийн хоол 4,000–5,500₮ тул багцаана.`)}
            </div>` : st.key === 'over' ? `
            <div style="margin-top:14px">${alert('bad', 'Лимит дагажсан', 'Дараагийн захиалгыг зогсоно.')}</div>` : ''}
        </div>
      </div>

      <div class="pad" style="margin-top:20px">
        ${secHead('Сүүлийн хоолнууд', 'Бүгдийг', "go('parent-orders')")}
        <div class="rows">
          ${PARENT.meals.map(m => `
            <div class="row-item">
              <span class="ic" style="background:var(--accent-100);color:var(--accent-700)">${icon('utensils', 18)}</span>
              <span class="grow">
                <span class="tt">${m.name}</span>
                <span class="sub tnum">${m.when} · № ${m.id}</span>
              </span>
              <span class="tnum" style="font:800 15px/1 var(--font);flex:none">${price(m.price)}</span>
            </div>`).join('')}
        </div>
      </div>

      <div class="pad" style="margin-top:20px">
        ${secHead('Хяналт')}
        <div class="rows">
          ${rowItem('wallet', 'Цэнэглэх', `${price(WALLET.balance)} үлдэгдэл`, { onclick: "openSheet('topup')" })}
          ${rowItem('bag', 'Хүүхдийн захиалга', `${ORDERS.live.id} · ${ORDERS.live.from}`, { onclick: "go('parent-orders')" })}
          ${rowItem('chart', 'Өдрийн лимит', `${price(PARENT.limit)}`, { onclick: "go('parent-limit')" })}
          ${rowItem('alert', 'Хүнсний харшил', STATE.allergies.length ? STATE.allergies.join(', ') : 'Байхгүй', { onclick: "go('parent-allergy')" })}
          ${rowItem('bell', 'Мэдэгдэл', `${PARENT.notifications.filter(n => n.unread).length} уншсангүй`, { onclick: "go('parent-notifs')" })}
        </div>
      </div>
      <div style="height:26px"></div>
    </div>

    ${nav('home')}`;
  },
  sheet(id) { return id === 'topup' ? topupSheet() : null; },
});

defineScreen('parent-orders', {
  name: 'Эцэг эх — Захиалга', group: 'Parent', nav: 'orders',
  note: 'Parent view of the child\'s live and past orders',
  render() {
    const o = ORDERS.live;
    return `
    ${appbar({
      back: "go('parent-home')",
      title: 'Захиалгын түүх',
      sub: `${CAST.parent.child} · ${CAST.parent.childKlass}`,
    })}

    <div class="scroll">
      <div class="pad" style="margin-top:6px">
        ${secHead('Идэвхтэй')}
        <div class="card">
          <div class="row-b">
            <span class="t-caption dim-2">ЗАХИАЛГА</span>
            <span class="tnum" style="font:800 15px/1 var(--font)">№ ${o.id}</span>
          </div>
          <div style="margin-top:12px">
            ${PARENT.meals.map(m => `
              <div class="row gap-3" style="padding:7px 0">
                <span style="width:40px;height:40px;border-radius:12px;background:var(--brand-050);color:var(--brand-600);display:grid;place-items:center;flex:none">${icon('utensils', 18)}</span>
                <span class="grow">
                  <span style="font:700 14px/1.2 var(--font);display:block">${m.name}</span>
                  <span class="t-body-sm dim">${m.when}</span>
                </span>
                <span class="tnum" style="font:800 14px/1 var(--font)">${price(m.price)}</span>
              </div>`).join('')}
          </div>
          <div class="row-b" style="margin-top:10px;padding-top:14px;border-top:1px solid var(--border)">
            <span class="t-body-sm dim">Нийт</span>
            <span class="t-money tnum">${price(PARENT.todaySpend)}</span>
          </div>
          <div class="row-b" style="margin-top:12px">
            <span class="st preparing">${icon('clock', 12)}Бэлтгэж байна</span>
            <span class="t-caption dim-2">${OPS.nowLabel}</span>
          </div>
        </div>
      </div>

      <div class="pad stack" style="margin-top:22px">
        ${secHead('Өмнөх')}
        ${pastGroups(ORDERS.past).map(g => `
          <div>
            <div class="t-caption dim-2" style="margin:0 2px 8px">${g.k.toUpperCase()}</div>
            <div class="rows">
              ${g.items.map(o2 => {
                const m = MENU.find(x => x.name === o2.name);
                const slot = SLOTS[o2.slot];
                return `
                <div class="row-item">
                  ${m ? `<img src="${IMG(m.img, 120)}" alt="${o2.name}" loading="lazy"
                    style="width:44px;height:44px;border-radius:12px;object-fit:cover;flex:none;background:var(--brand-050)">` : ''}
                  <span class="grow">
                    <span class="tt">${o2.name}</span>
                    <span class="sub tnum">№ ${o2.id} · ${slot ? slot.time : ''}</span>
                  </span>
                  <span class="col" style="flex:none;align-items:flex-end;gap:4px">
                    <span class="tnum" style="font:800 14px/1 var(--font)">${price(o2.price)}</span>
                    <span class="st collected">Олгосон</span>
                  </span>
                </div>`;
              }).join('')}
            </div>
          </div>`).join('')}
      </div>
      <div style="height:26px"></div>
    </div>

    ${nav('orders')}`;
  },
});

defineScreen('parent-limit', {
  name: 'Эцэг эх — Лимит', group: 'Parent',
  note: 'Parent sets the child\'s daily spending limit',
  render() {
    return `
    ${appbar({ back: "go('parent-home')", eyebrow: CAST.parent.child, title: 'Өдрийн лимит' })}
    ${limitBody(true)}`;
  },
});

defineScreen('parent-allergy', {
  name: 'Эцэг эх — Харшил', group: 'Parent',
  note: 'Parent manages the child\'s food allergies',
  render() {
    return `
    ${appbar({ back: "go('parent-home')", eyebrow: CAST.parent.child, title: 'Хүнсний харшил' })}
    ${allergyBody(true)}`;
  },
});

defineScreen('parent-notifs', {
  name: 'Эцэг эх — Мэдэгдэл', group: 'Parent', nav: 'home',
  note: 'The three parent notifications — nothing noisy',
  render() {
    const unread = PARENT.notifications.filter(n => n.unread).length;
    return `
    ${appbar({
      back: "go('parent-home')",
      title: 'Мэдэгдэл',
      sub: unread ? `${unread} уншсангүй` : 'Бүгдийг уншсан',
    })}

    <div class="scroll">
      <div class="pad" style="margin-top:6px">
        ${unread ? btn('Бүгдийг уншсан', { variant: 'secondary', size: 'block', onclick: 'readAllParentNotifs()', iconL: 'check' }) : ''}
        <div style="height:${unread ? 16 : 0}px"></div>
        ${notifRows(PARENT.notifications)}
      </div>

      <div class="pad" style="margin-top:20px">
        ${alert('info', 'Гурван төрлийн мэдэгдэл',
          'Зарцуулалтын тайлан, захиалга бэлэн болсон, үлдэгдэл бага. Өдөр бүр ийм илгээнэ.')}
      </div>

      <div class="pad" style="margin-top:16px">
        <div class="card">
          <div class="row gap-3">
            ${avatar(CAST.parent.child)}
            <span class="grow">
              <span style="font:800 14px/1.2 var(--font);display:block">${CAST.parent.child}</span>
              <span class="t-body-sm dim">${CAST.parent.childKlass} · өнөөдөр ${price(PARENT.todaySpend)}</span>
            </span>
            <button class="link" onclick="go('parent-home')">Нүүр</button>
          </div>
        </div>
      </div>
      <div style="height:26px"></div>
    </div>

    ${nav('home')}`;
  },
});
