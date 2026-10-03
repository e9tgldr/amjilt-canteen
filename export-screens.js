/* Exports every screen to a pixel-exact 2x PNG using the Chrome DevTools
   Protocol.

   Chrome clamps --window-size to a 492px minimum on Windows, which silently
   crops a 390x844 phone frame. Driving CDP directly and calling
   Emulation.setDeviceMetricsOverride gives an exact viewport regardless.

   Usage:  node export-screens.js           all screens
           node export-screens.js home qr   only these                    */
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('Chrome not found.'); process.exit(1); }

const OUT = path.join(__dirname, 'export');
const PORT = 9333 + (process.pid % 500);
const BASE = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');

const DEV = {
  waste: 'tablet', cafe: 'tablet', kitchen: 'tablet', forecast: 'tablet',
  inventory: 'tablet', menumanage: 'tablet',
  admin: 'desktop', 'admin-detail': 'desktop',
};
const SIZE = { phone: [390, 844], tablet: [1024, 768], desktop: [1440, 900] };
const SCALE = 2;

const src = ['screens-signature.js', 'screens-mobile.js', 'screens-dash.js']
  .map(f => fs.readFileSync(path.join(__dirname, 'assets', f), 'utf8')).join('\n');
const all = [...new Set([...src.matchAll(/defineScreen\('([a-zA-Z0-9-]+)'/g)].map(m => m[1]))];
const want = process.argv.slice(2);
const list = want.length ? all.filter(k => want.includes(k)) : all;

/* ---------- tiny CDP client ---------- */
class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.waiting = new Map(); this.events = new Map(); }
  static async open(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    const c = new CDP(ws);
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && c.waiting.has(m.id)) {
        const { res, rej } = c.waiting.get(m.id); c.waiting.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      } else if (m.method && c.events.has(m.method)) {
        c.events.get(m.method)(); c.events.delete(m.method);
      }
    };
    return c;
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.waiting.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (this.waiting.has(id)) { this.waiting.delete(id); rej(new Error(method + ' timed out')); } }, 45000);
    });
  }
  once(method) { return new Promise(r => this.events.set(method, r)); }
  close() { this.ws.close(); }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const profile = path.join(os.tmpdir(), 'exp-profile-' + process.pid);

  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-proxy-server', '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    '--remote-allow-origins=*', 'about:blank',
  ], { stdio: 'ignore' });

  // wait for the debugger endpoint
  let ver = null;
  for (let i = 0; i < 60; i++) {
    try { ver = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; }
    catch { await sleep(250); }
  }
  if (!ver) { console.error('Chrome debugger never came up.'); chrome.kill(); process.exit(1); }

  const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const cdp = await CDP.open(tab.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: false });

  let ok = 0, bad = 0;
  for (let i = 0; i < list.length; i++) {
    const k = list[i];
    const [w, h] = SIZE[DEV[k] || 'phone'];
    const out = path.join(OUT, `${String(i + 1).padStart(2, '0')}-${k}.png`);
    try {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: w, height: h, deviceScaleFactor: SCALE, mobile: false,
      });
      const loaded = cdp.once('Page.loadEventFired');
      await cdp.send('Page.navigate', { url: `${BASE}?export=1#${k}` });
      await Promise.race([loaded, sleep(15000)]);

      // wait for web fonts and every <img> to finish decoding
      await cdp.send('Runtime.evaluate', {
        awaitPromise: true, returnByValue: true,
        expression: `(async () => {
          await document.fonts.ready;
          const imgs = [...document.images].filter(i => !i.complete);
          await Promise.all(imgs.map(i => new Promise(r => {
            i.addEventListener('load', r, {once:true}); i.addEventListener('error', r, {once:true});
          })));
          await new Promise(r => setTimeout(r, 400));
        })()`,
      }).catch(() => {});
      await sleep(350);

      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'png', fromSurface: true, captureBeyondViewport: false,
      });
      const buf = Buffer.from(data, 'base64');
      fs.writeFileSync(out, buf);
      const kb = Math.round(buf.length / 1024);
      if (kb < 4) throw new Error('suspiciously small: ' + kb + ' KB');
      console.log(`  ok    ${path.basename(out).padEnd(26)} ${w}x${h}@${SCALE}x  ${kb} KB`);
      ok++;
    } catch (e) {
      console.log(`  FAIL  ${k} — ${String(e.message).split('\n')[0]}`);
      bad++;
    }
  }

  cdp.close(); chrome.kill();
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  console.log(`\n${ok} exported, ${bad} failed  ->  ${OUT}`);
  process.exit(bad ? 1 : 0);
})();
