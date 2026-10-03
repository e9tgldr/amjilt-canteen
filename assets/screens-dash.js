/* ============================================================
   Amjilt Canteen — Cafeteria & Admin consoles
   Spec §7 and §8. The `waste` screen in screens-signature.js is
   the reference for this file's structure and tone.
   ============================================================ */

const CAFE_NAV = [
  { id: 'cafe',       label: 'Тойм' },
  { id: 'kitchen',    label: 'Гал тогоо' },
  { id: 'waste',      label: 'Хаягдал' },
  { id: 'inventory',  label: 'Агуулах' },
];

/* Kitchen board state — cards move between columns for real */
const KB = JSON.parse(JSON.stringify(KITCHEN));
const KB_COLS = [
  { id: 'waiting', label: 'Хүлээгдэж байна', act: 'Бэлтгэж эхлэх' },
  { id: 'cooking', label: 'Бэлтгэж байна',   act: 'Бэлэн болгох' },
  { id: 'ready',   label: 'Бэлэн',           act: 'Олгосон'     },
  { id: 'done',    label: 'Олгосон',         act: null          },
];
const kbMove = (from, i) => {
  const next = from + 1;
  if (next >= KB_COLS.length) return;
  KB[KB_COLS[next].id].push(KB[KB_COLS[from].id].splice(i, 1)[0]);
  go('kitchen');
};
const kbDrop = (col) => { KB[KB_COLS.findIndex(c => c.id === col)] && go('kitchen'); };

const INV_TAB = { cur: 'all' };
const MENU_AVAIL = Object.fromEntries(MENU.map(m => [m.id, true]));

/* ============================================================
   7.1  CAFETERIA OVERVIEW
   ============================================================ */
defineScreen('cafe', {
  name: 'Цайны газрын самбар', group: 'Cafeteria', dev: 'tablet',
  note: 'Cafeteria overview — live stats + pickup load',
  render() {
    const nav = CAFE_NAV.map(t =>
      `<button class="${APP.consoleNav === t.id || (!APP.consoleNav && t.id === 'cafe') ? 'on' : ''}"
        onclick="APP.consoleNav='${t.id}';go('${t.id}')">${t.label}</button>`).join('');

    return `
    <div class="console">
      <div class="console-head" style="padding:22px 24px 0">
        <span class="mark">${icon('bowl', 21)}</span>
        <div>
          <h1>Amjilt Canteen</h1>
          <div class="sub">Цайны газрын самбар · ${WASTE.days[0]}… 11-24 · ${OPS.nowLabel}</div>
        </div>
        <div class="console-nav">${nav}</div>
      </div>

      <div class="console-body">
        <!-- ===== Stat row ===== -->
        <div class="tiles c4">
          ${tile('Нийт захиалга', OPS.total, { icon: 'bag', state: 'info', d: 'Өнөөдөр 11:38-ын байдлаар' })}
          ${tile('Бэлэн болсон', OPS.done, { icon: 'checkC', state: 'ok', d: 'Олгосон бүртгэгдсэн' })}
          ${tile('Бэлтгэж байна', OPS.preparing, { icon: 'utensils', state: 'warn', d: 'Гал тогоонд' })}
          ${tile('Өнөөдрийн борлуулалт', price(OPS.revenue), { icon: 'wallet', state: 'ok', d: `Дундаж ${price(OPS.avgOrder)} / захиалга` })}
        </div>

        <!-- ===== Live queue monitor ===== -->
        <div class="panel">
          <div class="panel-head">
            <div>
              <h3>Одоогийн дараалал</h3>
              <div class="sub">Слот бүрийн захиалгын тоо · хүчинтэй ${SLOT_CAPACITY} сул</div>
            </div>
            <span class="st warn">${icon('alert', 12)}Одоогийн ачаалал: ${OPS.load}</span>
          </div>
          <div class="qmon">
            ${SLOTS.map((s, i) => {
              const st = slotState(s);
              const isNow = s === SLOTS[1];
              return `<div class="s ${st === 'almost' ? 'alarm' : ''} ${isNow ? 'now' : ''}">
                ${isNow ? '<span class="nowflag">Одоо</span>' : ''}
                <div class="t tnum">${s.time}</div>
                <div class="n tnum">${s.orders}</div>
                <div class="l">захиалга</div>
                <div class="track"><i style="width:${(s.orders / SLOT_CAPACITY) * 100}%"></i></div>
                <div class="l" style="margin-top:7px">${free(s)} сул${st === 'almost' ? ' · дүүрэх гэж байна' : ''}</div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="split a-21">
          <!-- ===== Popular today ===== -->
          <div class="panel">
            <div class="panel-head">
              <div><h3>Өнөөдрийн хамгийн их</h3><div class="sub">Захиалгаар</div></div>
              <button class="btn outline sm" onclick="go('menu')">${icon('bowl', 15)}Меню</button>
            </div>
            ${FORECAST.map((f, i) => `
              <div class="rank ${i === 0 ? 'top' : ''}">
                <span class="no">${i + 1}</span>
                <img src="${IMG(f.img, 120)}" alt="" style="width:34px;height:34px;border-radius:10px;object-fit:cover;flex:none" loading="lazy">
                <span style="font:700 14px/1.2 var(--font);min-width:132px">${f.name}</span>
                <span class="track"><i style="width:${(f.orders / 45) * 100}%"></i></span>
                <span class="n tnum">${f.orders}</span>
              </div>`).join('')}
          </div>

          <!-- ===== Kitchen summary ===== -->
          <div class="panel">
            <div class="panel-head">
              <div><h3>Гал тогоо</h3><div class="sub">Тухайн мөчийн ачаалал</div></div>
              <button class="btn primary sm" onclick="go('kitchen')">Самбар ${icon('right', 15)}</button>
            </div>
            <div class="stack-sm">
              ${KB_COLS.map(c => `
                <div class="row" style="padding:11px 0;border-bottom:1px solid var(--border)">
                  <span class="row gap-2 grow">
                    <i style="width:9px;height:9px;border-radius:50%;background:${
                      c.id === 'ready' ? 'var(--success)' : c.id === 'cooking' ? 'var(--accent-500)' :
                      c.id === 'waiting' ? 'var(--warning)' : 'var(--border-strong)'}"></i>
                    <span style="font:700 14px/1.2 var(--font)">${c.label}</span>
                  </span>
                  <span class="t-title-sm tnum">${KB[c.id].length}</span>
                </div>`).join('')}
            </div>
            <div style="margin-top:18px">
              ${alert('warn', 'Сүүний үлдэгдэл бага байна', '24 ширхэг үлдсэн · өнөөдрийн хэрэглээ 48 ширхэг')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },
});

/* ============================================================
   7.2  KITCHEN ORDER BOARD
   ============================================================ */
defineScreen('kitchen', {
  name: 'Гал тогооны самбар', group: 'Cafeteria', dev: 'tablet',
  note: 'Kitchen board — four columns, real state movement',
  render() {
    const nav = CAFE_NAV.map(t =>
      `<button class="${t.id === 'kitchen' ? 'on' : ''}" onclick="APP.consoleNav='${t.id}';go('${t.id}')">${t.label}</button>`).join('');

    return `
    <div class="console">
      <div class="console-head" style="padding:22px 24px 0">
        <span class="mark">${icon('utensils', 21)}</span>
        <div>
          <h1>Гал тогооны самбар</h1>
          <div class="sub">Дарааллын дагуу бэлтгэнэ · ${OPS.nowLabel} · нийт ${OPS.total} захиалга</div>
        </div>
        <div class="console-nav">${nav}</div>
      </div>

      <div class="console-body">
        <div class="kb">
          ${KB_COLS.map((c, ci) => `
            <div class="kb-col kcol-${c.id}" ondragover="event.preventDefault();this.classList.add('drop')"
                 ondragleave="this.classList.remove('drop')">
              <h4>${c.label}<span class="c">${KB[c.id].length}</span></h4>
              ${KB[c.id].map((o, i) => `
                <div class="kb-card ${c.id === 'ready' ? 'ready' : ''}" draggable="true">
                  <div class="row-b">
                    <span class="id tnum">${o.id}</span>
                    <span class="timer">${icon('clock', 12)} ${o.t}</span>
                  </div>
                  <div class="dish">${o.name} <span class="dim">× ${o.qty}</span></div>
                  <span class="kb-slot tnum">${o.slot}</span>
                  ${c.act ? `<button class="btn ${c.id === 'ready' ? 'accent' : 'secondary'} sm" onclick="kbMove(${ci},${i})">${c.act}</button>` : ''}
                </div>`).join('') || `<div style="padding:22px 8px;text-align:center;font:500 12px/1.4 var(--font);color:var(--text-tertiary)">Дараал алга</div>`}
            </div>`).join('')}
        </div>

        <div class="panel">
          <div class="panel-head">
            <div><h3>Өнөөдөр хэдийг бэлтгэх вэ?</h3>
                 <div class="sub">Урьдчилсан захиалгын мэдээлэл дээр үндэслэв</div></div>
            <button class="btn outline sm" onclick="go('forecast')">Дэлгэрэнгүй ${icon('right', 15)}</button>
          </div>
          <div class="split a-32">
            <table class="tbl">
              <thead><tr><th>Хоол</th><th class="r">Захиалга</th><th class="r">Бэлтгэх</th><th class="r">Нөөц</th></tr></thead>
              <tbody>
                ${FORECAST.map(f => `<tr>
                  <td><span class="dish-cell"><img src="${IMG(f.img, 120)}" alt="" loading="lazy">
                    <b>${f.name}</b></span></td>
                  <td class="r tnum">${f.orders}</td>
                  <td class="r tnum" style="font-weight:800">${f.prepare}</td>
                  <td class="r"><span class="st ok">+${f.prepare - f.orders}</span></td>
                </tr>`).join('')}
              </tbody>
            </table>
            <div class="stack">
              ${alert('ok', 'Нийт 131 бэлтгэх', '124 захиалга + 7 нөөц (5.6%). Өмнөх долоо хоногийн хаягдал 4.9% байсан.')}
              <div class="panel" style="box-shadow:none;background:var(--surface-sunken)">
                <div class="t-label dim" style="margin-bottom:10px">Бэлтгэл ахиулж байна</div>
                <div class="stack-sm">
                  ${KB_COLS.map(c => `<div class="row-b" style="font:700 13px/1 var(--font)">
                    <span>${c.label}</span><span class="tnum">${KB[c.id].length}</span></div>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },
});

/* ============================================================
   7.5  PREPARATION FORECAST
   ============================================================ */
defineScreen('forecast', {
  name: 'Бэлтгэх хэмжээ', group: 'Cafeteria', dev: 'tablet',
  note: 'Preparation forecast — orders in, portions out',
  render() {
    const totO = FORECAST.reduce((s, f) => s + f.orders, 0);
    const totP = FORECAST.reduce((s, f) => s + f.prepare, 0);
    const nav = CAFE_NAV.map(t =>
      `<button class="${t.id === 'waste' ? 'on' : ''}" onclick="APP.consoleNav='${t.id}';go('${t.id}')">${t.label}</button>`).join('');

    return `
    <div class="console">
      <div class="console-head" style="padding:22px 24px 0">
        <span class="mark">${icon('chart', 21)}</span>
        <div>
          <h1>Өнөөдөр хэдийг бэлтгэх вэ?</h1>
          <div class="sub">Урьдчилсан захиалгын мэдээлэл дээр үндэслэв · ${OPS.nowLabel}-ын байдлаар</div>
        </div>
        <div class="console-nav">${nav}</div>
      </div>

      <div class="console-body">
        <div class="tiles c3">
          ${tile('Нийт захиалга', totO, { icon: 'bag', state: 'info', d: 'Дээрх хүснэгтээс' })}
          ${tile('Бэлтгэх тоо', totP, { icon: 'utensils', state: 'ok', d: `+${totP - totO} нөөц` })}
          ${tile('Нөөцийн хувь', ((totP - totO) / totO * 100).toFixed(1) + '%', { icon: 'shield', state: 'ok', d: 'Зорилтот 5–7%' })}
        </div>

        <div class="panel">
          <div class="panel-head"><div><h3>Хоол бүрээр</h3><div class="sub">Захиалга → бэлтгэх хэмжээ</div></div></div>
          <table class="tbl">
            <thead><tr><th>Хоол</th><th class="r">Захиалга</th><th class="r">Бэлтгэх</th><th class="r">Нөөц</th><th style="width:38%">Харьцаа</th></tr></thead>
            <tbody>
              ${FORECAST.map(f => {
                const buf = f.prepare - f.orders, pctB = (buf / f.orders * 100).toFixed(1);
                return `<tr>
                  <td><span class="dish-cell"><img src="${IMG(f.img, 120)}" alt="" loading="lazy">
                    <b>${f.name}</b><span>${f.orders} сурагч захиалсан</span></span></td>
                  <td class="r tnum">${f.orders}</td>
                  <td class="r tnum" style="font-weight:800;color:var(--brand-600)">${f.prepare}</td>
                  <td class="r"><span class="st ok">+${buf} (${pctB}%)</span></td>
                  <td><span class="meter" style="display:block"><i style="width:${f.orders / 45 * 100}%"></i></span></td>
                </tr>`;
              }).join('')}
              <tr style="background:var(--brand-050)">
                <td style="font-weight:800">Нийт</td>
                <td class="r tnum" style="font-weight:800">${totO}</td>
                <td class="r tnum" style="font-weight:800;color:var(--brand-600)">${totP}</td>
                <td class="r"><span class="st ok">+${totP - totO}</span></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="split a-11">
          ${alert('ok', 'Яагаад нөөц хэрэгтэй вэ?', 'Тоо хэтэрвэл хоол үлдэж, бага байвал сурагч хоолгүй үлдэнэ. 5–7% нь хоёуланг нь зайлшгүй.')}
          ${alert('info', 'Хэрэв захиалга өсөх бол', 'Буузын нөөцийг +5 болгож, Тахианы цуйваныг +3 нэмээрэй. Өмнөх 7 хоногт бууз 2 удаа дуусаж байсан.')}
        </div>
      </div>
    </div>`;
  },
});

/* ============================================================
   7.5b  INVENTORY
   ============================================================ */
defineScreen('inventory', {
  name: 'Агуулах', group: 'Cafeteria', dev: 'tablet',
  note: 'Inventory — category tabs, low-stock warnings',
  render() {
    const cats = ['all', 'Хүнс', 'Ундаа', 'Савлагаа'];
    const rows = INV_TAB.cur === 'all' ? INVENTORY : INVENTORY.filter(i => i.cat === INV_TAB.cur);
    const low = INVENTORY.filter(i => i.state === 'low');
    const nav = CAFE_NAV.map(t =>
      `<button class="${t.id === 'inventory' ? 'on' : ''}" onclick="APP.consoleNav='${t.id}';go('${t.id}')">${t.label}</button>`).join('');

    return `
    <div class="console">
      <div class="console-head" style="padding:22px 24px 0">
        <span class="mark">${icon('box', 21)}</span>
        <div>
          <h1>Агуулах</h1>
          <div class="sub">${INVENTORY.length} бүрэгдэхүүн · ${low.length} бага</div>
        </div>
        <div class="console-nav">${nav}</div>
      </div>

      <div class="console-body">
        ${low.length ? alert('warn', 'Сүүний үлдэгдэл бага байна', `${low.map(l => l.name).join(' · ')} — өнөөдрийн хэрэглээнд хүрнэ.`) : ''}

        <div class="panel">
          <div class="panel-head">
            <div class="chips" style="padding:0">
              ${cats.map(c => `<button class="chip ${INV_TAB.cur === c ? 'on' : ''}"
                onclick="INV_TAB.cur='${c}';go('inventory')">${c === 'all' ? 'Бүгд' : c}</button>`).join('')}
            </div>
            <button class="btn primary sm" onclick="go('menumanage')">${icon('plus', 15)}Бүртгэх</button>
          </div>
          <table class="tbl">
            <thead><tr><th>Бүрэгдэхүүн</th><th>Төрөл</th><th class="r">Үлдэгдэл</th><th style="width:26%">Түвшин</th><th class="r">Төлөв</th></tr></thead>
            <tbody>
              ${rows.map(i => {
                const p = Math.min(100, i.n / i.max * 100);
                return `<tr>
                  <td style="font-weight:700">${i.name}</td>
                  <td><span class="st ${i.cat === 'Хүнс' ? 'ok' : i.cat === 'Ундаа' ? 'preparing' : 'queued'}">${i.cat}</span></td>
                  <td class="r tnum" style="font-weight:800">${i.qty}</td>
                  <td><span class="meter" style="display:block"><i class="${i.state === 'low' ? 'orange' : ''}" style="width:${p}%"></i></span></td>
                  <td class="r"><span class="st ${i.state === 'low' ? 'warn' : 'ok'}">${i.state === 'low' ? 'Бага' : 'Хангалттай'}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  },
});

/* ============================================================
   7.6  MENU MANAGEMENT
   ============================================================ */
defineScreen('menumanage', {
  name: 'Меню удирдлага', group: 'Cafeteria', dev: 'tablet',
  note: 'Menu management — edit, price, availability',
  render() {
    return `
    <div class="console">
      <div class="console-head" style="padding:22px 24px 0">
        <span class="mark">${icon('bowl', 21)}</span>
        <div>
          <h1>Меню удирдлага</h1>
          <div class="sub">Өнөөдрийн меню · ${MENU.filter(m => MENU_AVAIL[m.id]).length} / ${MENU.length} илэрхий</div>
        </div>
        <div class="console-nav">
          <button onclick="go('cafe')">Тойм</button>
          <button class="on">Меню</button>
        </div>
      </div>

      <div class="console-body">
        <div class="panel">
          <div class="panel-head">
            <div><h3>Өнөөдрийн хоол</h3><div class="sub">Үнэ, орц, илчлэг, харшил үүсгэгчийг засна</div></div>
            <button class="btn primary sm" onclick="openSheet('newdish')">${icon('plus', 15)}Шинэ хоол нэмэх</button>
          </div>
          <table class="tbl">
            <thead><tr><th>Хоол</th><th class="r">Үнэ</th><th class="r">Илчлэг</th><th>Харшил үүсгэгч</th><th class="r">Үнэлгээ</th><th class="r">Менюд</th></tr></thead>
            <tbody>
              ${MENU.map(m => `<tr>
                <td><span class="dish-cell"><img src="${IMG(m.img, 120)}" alt="" loading="lazy">
                  <b>${m.name}</b><span>${m.cat}</span></span></td>
                <td class="r tnum" style="font-weight:800">${price(m.price)}</td>
                <td class="r tnum">${m.kcal} kcal</td>
                <td class="dim" style="font-size:13px">${m.allergens.length ? m.allergens.join(', ') : 'Агуулаагүй'}</td>
                <td class="r tnum">★ ${m.rating.toFixed(1)}</td>
                <td class="r">
                  <span class="row gap-3" style="justify-content:flex-end">
                    <button class="btn outline sm">${icon('settings', 15)}Засах</button>
                    <span class="sw ${MENU_AVAIL[m.id] ? 'on' : ''}" role="switch" aria-checked="${MENU_AVAIL[m.id]}"
                      tabindex="0" style="cursor:pointer"
                      onclick="MENU_AVAIL['${m.id}']=!MENU_AVAIL['${m.id}'];go('menumanage')"></span>
                  </span>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        ${alert('info', '«Өнөөдөр менюд харуулах» хаалт', 'Хаалттай хоол сурагчийн менюнд харагдахгүй бөгөөд шинэ захиалга авч болохгүй.')}
      </div>
    </div>`;
  },
  sheet(id) {
    if (id !== 'newdish') return null;
    return {
      html: sheet('newdish', 'Шинэ хоол нэмэх', `
        <div class="stack" style="padding-bottom:8px">
          <div class="col gap-2"><span class="t-label dim">Нэр</span>
            <input class="search" style="width:100%;height:48px;border-radius:14px;padding:0 16px;box-shadow:inset 0 0 0 1.5px var(--border);background:var(--surface)"
              placeholder="Жишээ: Бууз" value=""></div>
          <div class="row gap-3">
            <div class="grow col gap-2"><span class="t-label dim">Үнэ</span>
              <input style="width:100%;height:48px;border-radius:14px;padding:0 16px;box-shadow:inset 0 0 0 1.5px var(--border)" placeholder="4500"></div>
            <div class="grow col gap-2"><span class="t-label dim">Илчлэг (kcal)</span>
              <input style="width:100%;height:48px;border-radius:14px;padding:0 16px;box-shadow:inset 0 0 0 1.5px var(--border)" placeholder="480"></div>
          </div>
          <div class="col gap-2"><span class="t-label dim">Орц</span>
            <input style="width:100%;height:48px;border-radius:14px;padding:0 16px;box-shadow:inset 0 0 0 1.5px var(--border)" placeholder="Тахианы мах, сүү, гоймон…"></div>
          <div class="col gap-2"><span class="t-label dim">Харшил үүсгэгч</span>
            <div class="chips" style="padding:0">
              ${ALLERGENS.map(a => `<span class="alrg-chip">${a}</span>`).join('')}
              <span class="alrg-chip on">Агуулаагүй</span>
            </div></div>
          <div class="card flat row-b" style="padding:14px 16px">
            <span><b style="font:800 14px/1.2 var(--font);display:block">Өнөөдөр менюд харуулах</b>
            <span style="font:500 12px/1.3 var(--font);color:var(--text-tertiary)">Сурагчийн менюд шууд харагдана</span></span>
            <span class="sw on"></span>
          </div>
        </div>
        <div style="margin-top:20px">${btn('Хадгалах', { size: 'lg block', onclick: 'closeSheet()' })}</div>
      `),
    };
  },
});

/* ============================================================
   8  SCHOOL ADMIN DASHBOARD
   ============================================================ */
defineScreen('admin', {
  name: 'Сургуулийн самбар', group: 'Admin', dev: 'desktop', w: 1440, h: 900,
  note: 'Principal dashboard — adoption, revenue, waste, top meals',
  render() {
    const t = ADMIN.trend;
    const max = Math.max(...t), min = Math.min(...t);
    const W = 700, H = 200, pt = t.map((v, i) => [
      (i / (t.length - 1)) * W,
      H - ((v - min) / (max - min)) * (H - 30) - 15
    ]);
    const line = pt.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = `0,${H} ` + line + ` ${W},${H}`;

    return `
    <div class="console">
      <div class="console-head" style="padding:24px 28px 0">
        <span class="mark" style="width:44px;height:44px;border-radius:13px">${icon('chart', 22)}</span>
        <div>
          <h1>Сургуулийн самбар</h1>
          <div class="sub">Амжилт Интернэт Яам · 2026–2027 оны улирал</div>
        </div>
        <div class="console-nav">
          <button class="on">Тойм</button>
          <button onclick="go('admin-detail')">Анги бүр</button>
          <button onclick="go('waste')">Хаягдал</button>
        </div>
      </div>

      <div class="console-body">
        <div class="tiles c3">
          ${tile('Нийт сурагч', ADMIN.students.toLocaleString('en-US'), { icon: 'users', state: 'info', d: '6–12 дугаар анги' })}
          ${tile('Идэвхтэй хэрэглэгч', ADMIN.active.toLocaleString('en-US'), { icon: 'checkC', state: 'ok', d: `${ADMIN.adoption}% хэрэглээ`, delta: '+4.2%', deltaDir: 'up' })}
          ${tile('Нийт захиалга', ADMIN.orders.toLocaleString('en-US'), { icon: 'bag', state: 'ok', d: 'Улирлын нийт', delta: '+612', deltaDir: 'up' })}
          ${tile('Нийт орлого', price(ADMIN.revenue), { icon: 'wallet', state: 'ok', d: `${price(OPS.avgOrder)} дундаж` })}
          ${tile('Average pickup', ADMIN.avgPickup + ' сек', { icon: 'clock', state: 'ok', d: 'QR уншилтаас хүртэл', delta: '−6 сек', deltaDir: 'up' })}
          ${tile('Хүнсний хаягдал', ADMIN.wasteRate + '%', { icon: 'down2', state: 'ok', d: 'Өмнөх долоо хоногоос', delta: '↓ 18%', deltaDir: 'up' })}
        </div>

        <div class="split a-32">
          <!-- ===== 30-day trend ===== -->
          <div class="panel">
            <div class="panel-head">
              <div><h3>Сүүлийн 30 хоногийн захиалга</h3>
                   <div class="sub">Өдөр тутмын дундаж ${Math.round(t.reduce((a, b) => a + b) / t.length)} захиалга</div></div>
              <span class="st ok">${icon('up', 12)}Өсөлт</span>
            </div>
            <svg class="area-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:210px">
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#12855F" stop-opacity=".22"/>
                <stop offset="100%" stop-color="#12855F" stop-opacity="0"/>
              </linearGradient></defs>
              ${[0, .25, .5, .75, 1].map(f => `<line x1="0" y1="${f * H}" x2="${W}" y2="${f * H}" stroke="#E6E3DC" stroke-width="1"/>`).join('')}
              <polygon points="${area}" fill="url(#ag)"/>
              <polyline points="${line}" fill="none" stroke="#0E6B4F" stroke-width="2.5"
                        stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
              <circle cx="${W}" cy="${pt[pt.length-1][1].toFixed(1)}" r="5" fill="#0E6B4F" vector-effect="non-scaling-stroke"/>
            </svg>
            <div class="row-b t-caption dim-2" style="margin-top:10px">
              <span>10 хоногийн өмнө</span><span>Өнөөдөр · ${t[t.length-1]} захиалга</span>
            </div>
          </div>

          <!-- ===== Adoption ===== -->
          <div class="panel">
            <div class="panel-head"><div><h3>Хэрэглээ</h3><div class="sub">Бүхтгэлтэй сурагчийн хувь</div></div></div>
            <div class="row" style="gap:26px;align-items:center">
              ${donut(ADMIN.adoption, ADMIN.adoption + '%', 'хэрэглээ')}
              <div class="stack-sm grow">
                ${[
                  ['Идэвхтэй', ADMIN.active, 'var(--brand-600)'],
                  ['Бүртгэгдээгүй', ADMIN.students - ADMIN.active, 'var(--border-strong)'],
                ].map(([k, v, c]) => `<div class="row gap-3">
                  <i style="width:10px;height:10px;border-radius:3px;background:${c};flex:none"></i>
                  <span class="grow" style="font:700 13px/1 var(--font)">${k}</span>
                  <span class="tnum" style="font-weight:800">${v.toLocaleString('en-US')}</span>
                </div>`).join('')}
              </div>
            </div>
            <div style="margin-top:20px">${alert('info', 'Эргэлзээтэй хэсэг', `${(ADMIN.students - ADMIN.active).toLocaleString('en-US')} сурагч бүртгэгдээгүй байна. Ангийн багшаар дамжуулан урьталга явуулах хэрэгтэй.`)}</div>
          </div>
        </div>

        <div class="split a-11">
          <!-- ===== Top meals ===== -->
          <div class="panel">
            <div class="panel-head"><div><h3>Хамгийн их захиалсан хоол</h3><div class="sub">Улирлын нийт</div></div></div>
            ${ADMIN.topDishes.map((d, i) => `
              <div class="rank ${i === 0 ? 'top' : ''}">
                <span class="no">${i + 1}</span>
                <span style="font:700 14px/1.2 var(--font);min-width:140px">${d.name}</span>
                <span class="track"><i style="width:${d.pct}%"></i></span>
                <span class="n tnum">${d.n.toLocaleString('en-US')}</span>
              </div>`).join('')}
          </div>

          <!-- ===== Smart Queue health ===== -->
          <div class="panel">
            <div class="panel-head"><div><h3>Smart Queue-ийн үр нөлөө</h3><div class="sub">Дараалал хүлээх хугацааны өөрчлөлт</div></div></div>
            <div class="tiles c2">
              ${tile('Дундаж күтээлцэл', '4 мин', { icon: 'clock', state: 'ok', d: 'Өмнө нь 11 мин байсан' })}
              ${tile('Дараалд гарах', '3.1%', { icon: 'users', state: 'ok', d: 'Сурагч бүрийн хувь' })}
            </div>
            <div style="margin-top:18px">
              ${alert('ok', 'Хэмжээндээ хүрч байна', 'Слот бүр 16 султай. Дундаж ашиглалт 68% — нөөц байгаа боловч хэт их биш.')}
            </div>
            <div style="margin-top:16px">
              <div class="row-b t-body-sm" style="margin-bottom:8px"><span class="dim">Слот ашиглалт</span><b class="tnum">68%</b></div>
              <span class="meter" style="display:block"><i style="width:68%"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },
});

/* ============================================================
   8b  ADMIN — PER-CLASS DETAIL
   ============================================================ */
defineScreen('admin-detail', {
  name: 'Анги бүр', group: 'Admin', dev: 'desktop', w: 1440, h: 900,
  note: 'Per-class adoption and order volume',
  render() {
    const klass = [
      { n: '9А', students: 184, active: 158, orders: 4180, spend: 16920000 },
      { n: '9Б', students: 176, active: 146, orders: 3960, spend: 16030000 },
      { n: '10А', students: 168, active: 132, orders: 3610, spend: 14620000 },
      { n: '10Б', students: 162, active: 119, orders: 3240, spend: 13120000 },
      { n: '11А', students: 155, active: 101, orders: 2870, spend: 11610000 },
      { n: '11Б', students: 149, active: 86,  orders: 2380, spend: 9620000 },
      { n: '12А', students: 148, active: 74,  orders: 1905, spend: 7710000 },
      { n: '12Б', students: 98,  active: 52,  orders: 1173, spend: 4750000 },
    ];
    const maxS = Math.max(...klass.map(k => k.students));
    const total = klass.reduce((a, k) => a + k.students, 0);

    return `
    <div class="console">
      <div class="console-head" style="padding:24px 28px 0">
        <span class="mark" style="width:44px;height:44px;border-radius:13px">${icon('users', 22)}</span>
        <div>
          <h1>Анги бүр</h1>
          <div class="sub">${total.toLocaleString('en-US')} сурагч · 8 анги</div>
        </div>
        <div class="console-nav">
          <button onclick="go('admin')">Тойм</button>
          <button class="on">Анги бүр</button>
          <button onclick="go('waste')">Хаягдал</button>
        </div>
      </div>

      <div class="console-body">
        <div class="split a-32">
          <div class="panel">
            <div class="panel-head"><div><h3>Ангийн бүртгэл</h3><div class="sub">Идэвхтэй сурагч</div></div></div>
            <table class="tbl">
              <thead><tr><th>Анги</th><th class="r">Сурагч</th><th class="r">Идэвхтэй</th><th class="r">Захиалга</th><th class="r">Зарцуулалт</th><th style="width:20%">Хэрэглээ</th></tr></thead>
              <tbody>
                ${klass.map(k => {
                  const pct = Math.round(k.active / k.students * 100);
                  return `<tr>
                    <td style="font-weight:800">${k.n}</td>
                    <td class="r tnum">${k.students}</td>
                    <td class="r tnum">${k.active}</td>
                    <td class="r tnum">${k.orders.toLocaleString('en-US')}</td>
                    <td class="r tnum" style="font-weight:800">${(k.spend / 1e6).toFixed(1)}M₮</td>
                    <td><span class="row gap-3">
                      <span class="meter grow" style="display:block"><i class="${pct < 60 ? 'orange' : ''}" style="width:${pct}%"></i></span>
                      <b class="tnum" style="font-size:12px;min-width:32px;text-align:right">${pct}%</b>
                    </span></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="stack">
            <div class="panel">
              <div class="panel-head"><div><h3>Ангийн харьцаа</h3><div class="sub">Захиалга тоо</div></div></div>
              <div class="bar-chart" style="height:210px">
                ${klass.map(k => `<div class="bwrap">
                  <span class="val tnum">${k.orders.toLocaleString('en-US')}</span>
                  <i class="b ${k === klass[0] ? 'hi' : ''}" style="height:${(k.orders / maxS * 0.62 + 0.08) * 100}%"></i>
                  <span class="lbl">${k.n}</span>
                </div>`).join('')}
              </div>
            </div>
            ${alert('warn', '12 дугаар ангид анхаарах', '12А, 12Б хоёр ангийн хэрэглээ 50% орчимд байна. Тэдгээрт нэмэлт урьталга, сургалт явуулах шаардлагатай.')}
            ${alert('ok', '9, 10 дугаар анги жишиг', '9А анги 86% хэрэглээтэй — сургуулийн дундаж 78%-аас өндөр. Эдгээр ангийн туршлагыг бусад ангид хуваалцах боломжтой.')}
          </div>
        </div>
      </div>
    </div>`;
  },
});
