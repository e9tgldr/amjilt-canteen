/* Renders amjilt-slides.html in headless Chrome and captures chosen slides
   at exactly 1920x1080, so each one can be dropped straight into Figma. */
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SRC = process.argv[2] || 'amjilt-slides.html';
const OUTDIR = process.argv[3] || 'deck';
const FILE = 'file:///' + path.join(__dirname, SRC).replace(/\\/g, '/');
const PORT = 9444;
fs.mkdirSync(path.join(__dirname, OUTDIR), { recursive: true });
const shots = process.argv.slice(4).map(Number);
const want = shots.length ? shots : Array.from({ length: 20 }, (_, i) => i + 1);

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const ch = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-proxy-server', '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.join(os.tmpdir(), 'deck')}`,
    '--remote-allow-origins=*', 'about:blank'], { stdio: 'ignore' });

  for (let i = 0; i < 60; i++) {
    try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; }
    catch { await sleep(250); }
  }
  const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });

  let id = 0; const wait = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && wait.has(m.id)) { const w = wait.get(m.id); wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); }
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const n = ++id; wait.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method, params }));
    setTimeout(() => { if (wait.has(n)) { wait.delete(n); rej(new Error(method + ' timeout')); } }, 30000);
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });

  let n = 0;
  for (const s of want) {
    await send('Page.navigate', { url: `${FILE}#${s}` });
    await sleep(3000);
    // let fonts + food photography settle
    await send('Runtime.evaluate', { awaitPromise: true, expression:
      `(async()=>{await document.fonts.ready;
        await Promise.all([...document.images].filter(i=>!i.complete).map(i=>
          new Promise(r=>{i.onload=r;i.onerror=r})));await new Promise(r=>setTimeout(r,500));})()` })
      .catch(() => {});
    const { data } = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const out = path.join(__dirname, OUTDIR, String(s).padStart(2, '0') + '.png');
    fs.writeFileSync(out, Buffer.from(data, 'base64'));
    console.log(`  slide ${String(s).padStart(2)}  ${Math.round(Buffer.from(data, 'base64').length / 1024)} KB`);
    n++;
  }
  ws.close(); ch.kill();
  console.log(`\n${n} slides captured at 1920x1080`);
  process.exit(0);
})();
