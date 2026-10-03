/* ============================================================
   Amjilt Canteen — Signature Screens
   The four things the product must be remembered for (§14):
     SMART QUEUE · QR PICKUP · AMJILT WALLET · FOOD WASTE METER
   These set the visual bar for every other screen.
   ============================================================ */

/* ============================================================
   1. HOME (§5.3) — the most important screen
   ============================================================ */
defineScreen('home', {
  name: 'Нүүр', group: 'Student', nav: 'home',
  note: 'Student home — wallet, smart queue, today\'s menu',
  render() {
    const best = MENU.find(m => m.id === 'tsuvan');
    return `
    ${appbar({
      eyebrow: '9А анги',
      title: `Сайн уу, ${CAST.student.short} 👋`,
      right: `<button class="iconbtn ghost" onclick="go('notifs')" aria-label="Мэдэгдэл" style="position:relative">
        ${icon('bell', 22)}<span style="position:absolute;top:9px;right:9px;width:8px;height:8px;border-radius:50%;background:var(--accent-500);box-shadow:0 0 0 2px var(--bg)"></span>
      </button>`
    })}

    <div class="scroll">
      <div class="pad stack">

        <!-- ===== AMJILT WALLET ===== -->
        <div class="wallet-card">
          <span class="glyph">${icon('wallet', 120, '')}</span>
          <div class="lbl">МИНИЙ WALLET</div>
          <div class="amt tnum">${price(WALLET.balance)}</div>
          <div class="row-b">
            <div>
              <div style="font:800 13px/1.2 var(--font)">${CAST.student.name}</div>
              <div class="num" style="margin-top:3px">${WALLET.card}</div>
            </div>
            <button class="btn-add" onclick="openSheet('topup')">${icon('plus', 15)} Цэнэглэх</button>
          </div>
        </div>

        <!-- ===== SMART QUEUE ===== -->
        <div class="queue-cta">
          <span class="deco">${icon('clock', 60, '')}</span>
          <h3>Өнөөдөр дараалал хүлээхгүй</h3>
          <p>Авах цагаа урьдчилж сонгоорой.</p>
          <button class="btn primary" onclick="go('queue')">
            Цагаа сонгох ${icon('right', 17)}
          </button>
        </div>

        <!-- ===== Best seller ===== -->
        <div class="hot">
          <span class="flame">${icon('flame', 18)}</span>
          <img class="thumb" src="${IMG(best.img, 200)}" alt="${best.name}" loading="lazy">
          <div class="grow">
            <b>${best.name}</b>
            <div class="t trunc">Өнөөдөр хамгийн их захиалсан</div>
          </div>
          <button class="btn secondary sm" onclick="quickAdd('${best.id}',this)">+ Нэмэх</button>
        </div>

        <!-- ===== Categories ===== -->
        <div style="margin:0 calc(var(--gutter) * -1)">
          <div class="chips">
            ${CATEGORIES.map(c => `<button class="chip ${APP.cat === c.id ? 'on' : ''}" onclick="setCat('${c.id}')">${c.label}</button>`).join('')}
          </div>
        </div>

      </div>

      <!-- ===== Today's menu ===== -->
      <div style="margin-top:22px">
        ${secHead('Өнөөдрийн меню', 'Бүх', "go('menu')")}
        <div class="rail-x">
          ${MENU.filter(m => APP.cat === 'all' || m.cat === APP.cat).map(m => foodCard(m, { target: 'food' })).join('')}
        </div>
      </div>

      <div class="pad" style="padding-top:18px">
        <button class="card flat" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left" onclick="go('fav')">
          <span class="ic" style="width:40px;height:40px;border-radius:12px;background:var(--danger-bg);color:var(--danger);display:grid;place-items:center;flex:none">${icon('heart', 19)}</span>
          <span class="grow">
            <b style="font:800 14px/1.2 var(--font);display:block">Дуртай хоолнууд</b>
            <span style="font:500 13px/1.3 var(--font);color:var(--text-tertiary)">${STATE.favorites.length} хоол · Дахин захиалах</span>
          </span>
          <span class="dim-2">${icon('right', 17)}</span>
        </button>
      </div>

      <div style="height:28px"></div>
    </div>

    ${nav('home')}`;
  },
  sheet(id) {
    if (id === 'topup') return topupSheet();
    return null;
  },
});

/* ============================================================
   2. SMART QUEUE (§5.6) — signature feature
   ============================================================ */
defineScreen('queue', {
  name: 'Хоолоо авах цаг', group: 'Student', nav: 'home',
  note: 'Pickup-slot reservation — the core of the product',
  render() {
    const s = SLOTS[APP.slot];
    const f = free(s);
    const mins = s.from - CURRENT_MIN;

    return `
    ${appbar({
      back: "go('home')",
      title: 'Хоолоо авах цаг',
      sub: 'Хүмүүсийг нэг дор цуглуулахгүйгээр өөрийн цагаа сонгоорой.',
      right: `<button class="iconbtn ghost" onclick="go('queue-monitor')" aria-label="Ачаалал">${icon('chart', 20)}</button>`,
    })}

    <div class="scroll">
      <div class="pad">
        <div class="stack" style="margin-top:6px">
          ${SLOTS.map((sl, i) => slotCard(sl, i, { selected: APP.slot, onPick: 'pickSlot' })).join('')}
        </div>
      </div>

      <!-- Selected-slot panel -->
      <div class="pad" style="margin-top:20px">
        <div class="qpanel">
          <div class="k">ТАНЫ АВАХ ЭЭЛЖ</div>
          <div class="t tnum">${s.time}</div>
          <div style="font:500 13px/1.3 var(--font);opacity:.8">
            ${f} сул үлдсэн · Захиалгын тоо ${s.orders}
          </div>

          <div class="track"><div class="fill" id="qfill" style="width:0"></div></div>
          <div class="legend">
            <span class="tnum">${s.time.split('–')[0]}</span>
            <span id="qleft">${mins} минутын дараа</span>
            <span class="tnum">${s.time.split('–')[1]}</span>
          </div>

          <div class="load">
            <span class="pulse-dot"></span>
            Цайны газар одоогоор ачаалал багатай.
          </div>
        </div>
      </div>

      <div class="pad" style="margin-top:16px">
        ${alert('info', 'Хэрэв өөр цаг сонговол', 'Сагс дахин өөрчлөгдөнө. Слотов өөрчлөхөд байрлал чөлөөлөгдөнө.')}
      </div>
      <div style="height:26px"></div>
    </div>

    <div class="sticky-cta">
      ${btn(`Үргэлжлүүлэх · ${price(cartSubtotal())}`, { variant: 'primary', size: 'lg block', onclick: "go('cart')" })}
    </div>`;
  },
  after() {
    const fill = document.getElementById('qfill');
    if (fill) requestAnimationFrame(() => {
      const s = SLOTS[APP.slot];
      // 0 until the slot opens, 100 once it has closed.
      const pct = Math.min(100, Math.max(0, ((CURRENT_MIN - s.from) / (s.to - s.from)) * 100));
      fill.style.width = pct + '%';
    });
  },
});

/* ============================================================
   3. QR PICKUP (§5.11) — must feel physical
   ============================================================ */
defineScreen('qr', {
  name: 'QR авах', group: 'Student', nav: 'orders',
  note: 'QR pickup — valid / scanned / expired',
  render() {
    const o = ORDERS.live;
    const st = APP.qrState;

    const status = {
      valid:   `<span class="qr-status ok">${icon('checkC', 17)}<span class="d"></span>QR код хүчинтэй</span>`,
      scanned: `<span class="qr-status ok">${icon('checkC', 17)}<span class="d"></span>Уншигдсан</span>`,
      expired: `<span class="qr-status bad">${icon('x', 17)}<span class="d"></span>Хугацаа дууссан</span>`,
    }[st];

    return `
    ${appbar({ back: "go('orders')", title: 'Хоолоо авах', right: '' })}

    <div class="scroll">
      <div class="pad" style="text-align:center;padding-top:8px">
        <div class="t-caption dim-2">ЗАХИАЛГА</div>
        <div style="font:800 20px/1.2 var(--font);letter-spacing:-.4px;margin-top:4px" class="tnum">№ ${o.id}</div>
        <div class="row" style="justify-content:center;gap:6px;margin-top:8px">
          <span class="st ok">${icon('clock', 12)}${o.from}</span>
        </div>
      </div>

      <div class="pad" style="margin-top:20px">
        <div class="qr-wrap ${st === 'expired' ? 'dim' : ''}">
          <div id="qrc"></div>
          ${st === 'expired' ? `
            <div class="expired">
              <div style="text-align:center;padding:20px">
                <div style="width:64px;height:64px;border-radius:50%;background:var(--danger-bg);color:var(--danger);display:grid;place-items:center;margin:0 auto 14px">${icon('x', 30)}</div>
                <b style="font:800 16px/1.3 var(--font);display:block">QR кодын хугацаа дууссан.</b>
                <p style="font:500 13px/1.4 var(--font);color:var(--text-secondary);margin-top:6px">Шинэ код үүсгээд дахин уншуулна уу.</p>
              </div>
            </div>` : ''}
        </div>

        <div style="text-align:center;margin-top:18px">
          ${status}
          ${st === 'valid' ? `<div style="font:700 12px/1 var(--font);color:var(--text-tertiary);margin-top:10px" class="tnum">Үлдсэн 08:42</div>` : ''}
        </div>

        ${st === 'scanned' ? `
          <div style="margin-top:24px;text-align:center">
            <div class="hero-ok" style="width:76px;height:76px">${icon('check', 36)}</div>
            <h3 style="font:var(--t-title);letter-spacing:-.4px;margin-top:18px">Амжилттай олголоо!</h3>
            <p style="font:var(--t-body);color:var(--text-secondary);margin-top:8px">Сайхан хооллоорой, ${CAST.student.short}! 👋</p>
            <div class="row" style="justify-content:center;margin-top:18px">
              <span class="st collected">Захиалга дууссан</span>
            </div>
          </div>` : `
          <div class="alert info" style="margin-top:20px;text-align:center;justify-content:center">
            <div>
              <b>QR кодоо цайны газрын уншигчид ойртуулна уу.</b>
              <p>Ангийн сурагч нь уншигчийн дээр зогсоод кодыг зураадаг.</p>
            </div>
          </div>`}
      </div>

      <div class="pad" style="margin-top:22px">
        ${st === 'expired'
          ? btn('Шинэ QR үүсгэх', { size: 'lg block', onclick: "APP.qrState='valid';go('qr')", iconL: 'refresh' })
          : st === 'scanned'
            ? btn('Захиалгын дэлгэрэнгүй', { variant: 'outline', size: 'lg block', onclick: "go('orders')" })
            : btn('Захиалга руу буцах', { variant: 'outline', size: 'lg block', onclick: "go('track')", iconL: 'left' })}
      </div>

      <!-- Prototype affordance: preview all three QR states -->
      <div class="pad" style="margin-top:26px">
        <div class="t-caption dim-2" style="text-align:center;margin-bottom:8px">QR-ийн төлөв</div>
        <div class="seg">
          ${['valid', 'scanned', 'expired'].map(k =>
            `<button class="${st === k ? 'on' : ''}" onclick="APP.qrState='${k}';go('qr')">
              ${k === 'valid' ? 'Хүчинтэй' : k === 'scanned' ? 'Уншигдсан' : 'Дууссан'}</button>`).join('')}
        </div>
      </div>
      <div style="height:28px"></div>
    </div>

    ${nav('orders')}`;
  },
  after() { qrCanvas('qrc', ORDERS.live.id + '|' + SLOT_FRONT, 220); },
});

const SLOT_FRONT = '12:00';

/* Queue monitor as a mobile sheet-style view (staff-facing, teacher view) */
defineScreen('queue-monitor', {
  name: 'Ачаалал', group: 'Student', nav: 'home',
  note: 'Live pickup load — mobile view',
  render() {
    return `
    ${appbar({ back: "go('queue')", title: 'Одоогийн ачаалал', sub: 'Бүх цайн слотын байдал' })}
    <div class="scroll">
      <div class="pad" style="margin-top:8px">
        <div class="qmon" style="grid-template-columns:1fr">
          ${SLOTS.map(s => {
            const st = slotState(s);
            return `<div class="s ${st === 'almost' ? 'alarm' : ''} ${s === SLOTS[1] ? 'now' : ''}">
              ${s === SLOTS[1] ? '<span class="nowflag">Одоо</span>' : ''}
              <div class="t tnum">${s.time}</div>
              <div class="n tnum">${s.orders}</div>
              <div class="l">захиалга</div>
              <div class="track"><i style="width:${(s.orders / SLOT_CAPACITY) * 100}%"></i></div>
              <div class="l" style="margin-top:6px">${free(s)} сул</div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div style="height:28px"></div>
    </div>
    ${nav('home')}`;
  },
});

/* ============================================================
   4. FOOD WASTE METER (§7.4) — signature analytics
   ============================================================ */
defineScreen('waste', {
  name: 'Хүнсний хаягдал', group: 'Cafeteria', dev: 'tablet',
  note: 'Food waste meter — the number the school feels good about',
  render() {
    const pct = WASTE.rate;
    const circumference = 2 * Math.PI * 76;
    return `
    <div class="console">
      <div class="console-head" style="padding:22px 24px 0">
        <span class="mark">${icon('bowl', 21)}</span>
        <div>
          <h1>Хүнсний хаягдал</h1>
          <div class="sub">Сүүлийн 7 хоног · 2026-11-18 — 2026-11-24</div>
        </div>
        <div class="console-nav">
          <button onclick="go('cafe')">Тойм</button>
          <button onclick="go('kitchen')">Гал тогоо</button>
          <button class="on">Хаягдал</button>
          <button onclick="go('inventory')">Агуулах</button>
        </div>
      </div>

      <div class="console-body">
        <div class="split a-32">
          <!-- ===== Gauge ===== -->
          <div class="panel">
            <div class="row" style="gap:36px;align-items:center">
              <div style="position:relative;width:190px;height:190px;flex:none">
                <svg width="190" height="190" viewBox="0 0 190 190">
                  <circle cx="95" cy="95" r="76" fill="none" stroke="var(--surface-sunken)" stroke-width="16"/>
                  <circle id="wg" cx="95" cy="95" r="76" fill="none" stroke="var(--brand-500)" stroke-width="16"
                    stroke-linecap="round" stroke-dasharray="${circumference}"
                    stroke-dashoffset="${circumference}" transform="rotate(-90 95 95)"/>
                </svg>
                <div style="position:absolute;inset:0;display:grid;place-content:center;text-align:center">
                  <div style="font:800 42px/1 var(--font);letter-spacing:-1.4px;color:var(--brand-500)" class="tnum">↓ 18%</div>
                  <div class="t-caption dim-2" style="margin-top:5px">ӨМНӨХ 7 ХОНОГООС</div>
                </div>
              </div>
              <div class="grow stack">
                <div>
                  <div class="t-title-sm">Урьдчилсан захиалга ажиллаж байна</div>
                  <p style="font:var(--t-body);color:var(--text-secondary);margin-top:8px;max-width:44ch">
                    Урьдчилсан захиалга нь илүүдэл хоолыг багасгахад тусалж байна. Өнөөдөр бүр
                    урьдчилан хэлсэн тооныг бэлтгэж байгаа тул хүнсний үлдэгдэл 18% буурлаа.
                  </p>
                </div>
                <div class="row gap-2" style="flex-wrap:wrap">
                  <span class="st ok">${icon('down2', 12)}Илүүдэл −11 ширхэг</span>
                  <span class="st ok">${icon('down2', 12)}Үнэ өдөр бүр 42,000₮</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== Numbers ===== -->
          <div class="panel">
            <div class="panel-head"><h3>Тоонууд</h3><div class="sub">7 хоног</div></div>
            <div class="stack">
              ${[
                ['Захиалга', WASTE.orders, 'үйл явдал', 'box', 'info'],
                ['Бэлтгэсэн', WASTE.prepared, 'бэлтгэсэн', 'utensils', 'info'],
                ['Илүүдэл', WASTE.surplus, 'илүүдэл багассан', 'alert', 'warn'],
              ].map(([k, v, d, ic, st]) => `
                <div class="row gap-4" style="padding:14px 0;border-bottom:1px solid var(--border)">
                  <span class="tile ${st}" style="padding:0;box-shadow:none;background:transparent">
                    <span class="ic" style="position:static">${icon(ic, 18)}</span>
                  </span>
                  <span class="grow">
                    <span style="font:800 15px/1.2 var(--font);display:block">${v.toLocaleString('en-US')}</span>
                    <span style="font:500 12px/1.2 var(--font);color:var(--text-tertiary)">${d}</span>
                  </span>
                  <span class="dim t-caption">${k}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <!-- ===== Trend ===== -->
        <div class="panel">
          <div class="panel-head">
            <div>
              <h3>Өдөр тутмын илүүдэл</h3>
              <div class="sub">Өмнөх 7 хоног 4.9% · Энэ 7 хоног ${WASTE.rate}%</div>
            </div>
            <div class="row gap-3">
              <span class="row gap-2 t-body-sm dim"><i style="width:10px;height:10px;border-radius:3px;background:var(--brand-300);display:block"></i>Өмнөх</span>
              <span class="row gap-2 t-body-sm dim"><i style="width:10px;height:10px;border-radius:3px;background:var(--brand-600);display:block"></i>Энэ</span>
            </div>
          </div>
          <div class="bar-chart">
            ${WASTE.days.map((d, i) => {
              const max = 6;
              const h = (WASTE.daily[i] / max) * 100;
              const prev = 5.4 - i * 0.06;
              const ph = (prev / max) * 100;
              return `<div class="bwrap">
                <span class="val tnum">${WASTE.daily[i]}%</span>
                <span style="width:100%;max-width:34px;display:flex;align-items:flex-end;gap:3px;height:130px">
                  <i style="width:50%;height:${ph}%;background:var(--brand-200);border-radius:5px 5px 2px 2px;display:block"></i>
                  <i style="width:50%;height:${h}%;background:var(--brand-600);border-radius:5px 5px 2px 2px;display:block"></i>
                </span>
                <span class="lbl">${d}</span>
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- ===== What drove it ===== -->
        <div class="panel">
          <div class="panel-head"><h3>Хаягдал буурах шалтгаан</h3></div>
          <div class="tiles c3">
            ${[
              ['Урьдчилсан захиалга', '86%', 'Захиалгын тооноос таамаглан бэлтгэж байна', 'ok', 'box'],
              ['Smart Queue', '74%', 'Ачаалал тэнцэт хуваагдаж байна', 'ok', 'clock'],
              ['Үлдэгдэл хяналт', '61%', 'Өдөр бүр 17:00 үед давхар тоолж байна', 'warn', 'alert'],
            ].map(([k, v, d, st, ic]) => tile(k, v, { d, state: st, icon: ic })).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },
  after() {
    const g = document.getElementById('wg');
    if (g) setTimeout(() => {
      const c = 2 * Math.PI * 76;
      g.style.transition = 'stroke-dashoffset 1000ms cubic-bezier(.32,.72,0,1)';
      g.style.strokeDashoffset = c * (1 - WASTE.rate / 5);
    }, 90);
  },
});
