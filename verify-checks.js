/* Runs inside the prototype's own scope — every const is visible here. */

let bad = 0;
const err = m => { console.log('  FAIL  ' + m); bad++; };
const ok  = m => console.log('  ok    ' + m);
const keys = Object.keys(SCREENS);

console.log('\n=== 1. Screen registry ===');
console.log(`  ${keys.length} screens registered`);
keys.forEach(k => {
  const s = SCREENS[k];
  if (typeof s.render !== 'function') return err(`${k}: no render()`);
  if (!s.name) err(`${k}: no name`);
  if (!['Onboarding','Student','Parent','Cafeteria','Admin','States'].includes(s.group))
    err(`${k}: bad group "${s.group}"`);
});
ok('all screens have name, group and render()');

console.log('\n=== 2. Prototype flow ===');
FLOW.forEach(k => SCREENS[k] ? ok('flow → ' + k) : err('flow references missing screen "' + k + '"'));

console.log('\n=== 3. go() targets ===');
let targets = 0, broken = [];
keys.forEach(k => {
  (SCREENS[k].render.toString().match(/go\('([a-zA-Z0-9-]+)'/g) || []).forEach(m => {
    const t = m.slice(4, -1); targets++;
    if (!SCREENS[t]) broken.push(`${k} → ${t}`);
  });
});
broken.length ? broken.forEach(b => err('missing route ' + b)) : ok(`${targets} go() calls all resolve`);

console.log('\n=== 4. onclick handlers ===');
const known = new Set([...(global.__DEFINED || []),
  'openSheet','closeSheet','pickSlot','setCat','quickAdd','toggleFav','setQty',
  'doPay','advanceOrder','resetAll','flowStart','flowStop','topupSheet','kbMove','go',
  'price','stars','icon','iconFill','foodCard','slotCard','btn','alert','tile','rowItem','appbar',
  'secHead','nav','sheet','qrCanvas','avatar','skelCard','skelRow','gauge','donut']);
let handlers = 0; const miss = new Set();
keys.forEach(k => {
  (SCREENS[k].render.toString().match(/on(?:click|drop|dragover)="([^"]*)"/g) || []).forEach(a => {
    // Only bare function calls count. `event.preventDefault()` and
    // `this.classList.add()` are inline logic, not app handlers.
    a.replace(/^on\w+="/, '').replace(/"$/, '').split(';').forEach(stmt => {
      const m = stmt.trim().match(/^([a-zA-Z0-9_$]+)\(/);
      if (!m) return;
      handlers++;
      if (!known.has(m[1])) miss.add(`${k} → ${m[1]}()`);
    });
  });
});
miss.size ? [...miss].forEach(m => err('unknown handler ' + m))
           : ok(`${handlers} inline handlers all resolve`);

console.log('\n=== 5. Data integrity ===');
const eq = (l, a, b) => a === b ? ok(l) : err(`${l}: ${a} ≠ ${b}`);
eq('done + preparing = total orders', OPS.done + OPS.preparing, OPS.total);
eq('forecast orders sum = total orders', FORECAST.reduce((s, f) => s + f.orders, 0), OPS.total);
eq('waste: prepared − orders = surplus', WASTE.prepared - WASTE.orders, WASTE.surplus);
eq('waste: prev surplus correct', WASTE.prevPrepared - WASTE.orders, WASTE.prevSurplus);
eq('waste: stated 18% drop is arithmetically true', WASTE.drop,
   Math.round((1 - WASTE.surplus / WASTE.prevSurplus) * 100));
eq('admin: adoption % correct', Math.round(ADMIN.active / ADMIN.students * 100), ADMIN.adoption);
const revPer = Math.round(ADMIN.revenue / ADMIN.orders);
Math.abs(revPer - OPS.avgOrder) < 20
  ? ok(`admin revenue/order (${revPer}) ≈ menu average (${OPS.avgOrder})`)
  : err(`admin revenue/order ${revPer} vs menu average ${OPS.avgOrder}`);
SLOTS.every(s => s.orders <= SLOT_CAPACITY)
  ? ok('every slot within capacity ' + SLOT_CAPACITY) : err('a slot exceeds capacity');
eq('selected slot shows 8 free (matches staff view)', SLOT_CAPACITY - SLOTS[SELECTED_SLOT].orders, 8);
eq('parent spend within daily limit', PARENT.todaySpend <= PARENT.limit, true);
const inMenu = SLOTS.every(s => s.orders >= 0 && s.time.length === 11);
inMenu ? ok('all slot time labels well-formed') : err('malformed slot label');

console.log('\n=== 6. Accessibility ===');
/* Parse real <button> elements out of each screen's markup. A button whose
   only content is an icon still needs an accessible name.               */
let btns = 0, unnamed = [], smallTap = [];
keys.forEach(k => {
  (SCREENS[k].render.toString().match(/<button\b([^>]*)>([\s\S]*?)<\/button>/g) || []).forEach(raw => {
    btns++;
    const attrs = (raw.match(/^<button\b([^>]*)>/) || [])[1] || '';
    const inner = raw.replace(/^<button\b[^>]*>/, '').replace(/<\/button>$/, '');
    const text  = inner.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const hasLabel = /aria-label=/.test(attrs) || /aria-labelledby=/.test(attrs);
    if (!text && !hasLabel) unnamed.push(`${k}: <button> with only an icon and no aria-label`);
    const h = attrs.match(/height:\s*(\d+)px/);
    if (h && +h[1] < 44) smallTap.push(`${k}: button with height:${h[1]}px`);
  });
});
unnamed.length ? unnamed.forEach(u => err(u)) : ok(`all ${btns} buttons have an accessible name`);
smallTap.length ? smallTap.forEach(s => err(s)) : ok('no button declares a height under 44px');
const latin = keys.filter(k => /Lorem|ipsum|dolor sit/i.test(SCREENS[k].render.toString()));
latin.length ? latin.forEach(k => err(`${k}: contains lorem ipsum`)) : ok('no placeholder copy anywhere');

console.log(bad ? `\n=== ${bad} PROBLEM(S) ===\n` : `\n=== ALL CHECKS PASSED (${keys.length} screens) ===\n`);
if (bad) throw new Error(bad + ' problems');
