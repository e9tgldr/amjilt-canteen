/* Amjilt Canteen — integrity checks.
   Loads every prototype file into one shared scope, then asserts that
   routes, handlers, and the canonical numbers all hold together.      */
const fs = require('fs'), path = require('path');
const A = f => fs.readFileSync(path.join(__dirname, 'assets', f), 'utf8');

global.window = { addEventListener() {} };
global.location = { hash: '' };
global.history = { replaceState() {} };
global.document = { addEventListener() {}, getElementById: () => null, querySelector: () => null };
global.getComputedStyle = () => ({ paddingLeft: '0', paddingRight: '0' });
global.requestAnimationFrame = f => f();
global.setTimeout = () => 0;

const source = [
  A('data.js'), A('components.js'), A('app.js'),
  A('screens-signature.js'), A('screens-mobile.js'), A('screens-dash.js'),
  fs.readFileSync(path.join(__dirname, 'verify-checks.js'), 'utf8'),
].join('\n;\n');

/* Harvest every name the prototype actually declares, so the handler check
   validates against reality instead of a hand-kept list. */
global.__DEFINED = [...new Set([
  ...source.matchAll(/(?:function\s+([A-Za-z0-9_$]+)\s*\(|(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:function|\())/g)
    .map(m => m[1] || m[2]),
])];

try { eval(source); }
catch (e) { console.error('\nLOAD FAILED:\n' + (e.stack || e) + '\n'); process.exit(1); }
