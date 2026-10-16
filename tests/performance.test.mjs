import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import ts from 'typescript';

// Check the actual production import graph, including generated CommonJS
// wrappers: a lazy Home component alone does not guarantee Three.js is deferred.
const dist = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', dist), 'utf8');
const entry = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)[1];
const initial = new Map();
async function visit(file) {
  if (initial.has(file)) return;
  const bytes = await readFile(new URL(file.replace(/^\//, ''), dist));
  initial.set(file, bytes);
  const parsed = ts.createSourceFile(file, bytes.toString(), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  for (const statement of parsed.statements) {
    if ((ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) && statement.moduleSpecifier) {
      await visit(path.posix.join(path.posix.dirname(file), statement.moduleSpecifier.text));
    }
  }
}
await visit(entry);
assert.ok(![...initial.keys()].some(file => /\/(three|Home|About|Artists|Contact)-/.test(file)), 'An unopened route or the 3D engine loads in the entry graph');
const initialGzip = [...initial.values()].reduce((sum, bytes) => sum + gzipSync(bytes).length, 0);
assert.ok(initialGzip < 130_000, `Initial JavaScript exceeds its 130 KB gzip budget: ${initialGzip}`);
console.log(`PASS: ${initial.size} initial JS chunks, ${(initialGzip / 1000).toFixed(1)} KB gzip; route code and Three.js remain deferred.`);

// Mounts, font readiness, and resize notifications must share one refresh.
const frames = new Map();
let frameId = 0;
globalThis.__refreshCount = 0;
globalThis.requestAnimationFrame = callback => { frames.set(++frameId, callback); return frameId; };
globalThis.cancelAnimationFrame = id => frames.delete(id);
const refreshSource = (await readFile(new URL('../utils/layoutRefresh.ts', import.meta.url), 'utf8'))
  .replace('import { ScrollTrigger } from "gsap/ScrollTrigger";', 'const ScrollTrigger = { refresh: () => globalThis.__refreshCount++ };');
const refreshJs = ts.transpileModule(refreshSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { requestLayoutRefresh } = await import(`data:text/javascript;base64,${Buffer.from(refreshJs).toString('base64')}`);
const cancelOld = requestLayoutRefresh();
const cancelSecond = requestLayoutRefresh();
requestLayoutRefresh();
cancelSecond();
assert.equal(frames.size, 1);
for (const [id, callback] of frames) { frames.delete(id); callback(); }
assert.equal(globalThis.__refreshCount, 1);
const cancelNew = requestLayoutRefresh();
cancelOld();
assert.equal(frames.size, 1, 'Stale cleanup cancelled another page\'s refresh');
cancelNew();
assert.equal(frames.size, 0, 'Unmounted page left a layout refresh scheduled');
console.log('PASS: layout refreshes coalesce; cancellation does not drop another page\'s refresh.');

// Exercise observer lifecycle and tab visibility without requiring a browser.
const visibility = { hidden: false, listeners: new Set() };
let observer;
globalThis.document = {
  get hidden() { return visibility.hidden; },
  addEventListener(type, callback) { assert.equal(type, 'visibilitychange'); visibility.listeners.add(callback); },
  removeEventListener(type, callback) { visibility.listeners.delete(callback); },
};
globalThis.IntersectionObserver = class {
  constructor(callback) { this.callback = callback; observer = this; }
  observe(element) { this.element = element; }
  disconnect() { this.disconnected = true; }
};
const source = await readFile(new URL('../utils/visibleAnimation.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { pauseWhenOffscreen } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
let paused;
const stop = pauseWhenOffscreen({}, [{ paused(value) { paused = value; } }]);
assert.equal(paused, false);
observer.callback([{ isIntersecting: false }]);
assert.equal(paused, true, 'Offscreen animation keeps running');
observer.callback([{ isIntersecting: true }]);
assert.equal(paused, false);
visibility.hidden = true;
visibility.listeners.forEach(callback => callback());
assert.equal(paused, true, 'Background tab keeps animating');
visibility.hidden = false;
visibility.listeners.forEach(callback => callback());
assert.equal(paused, false, 'Visible animation did not resume');
stop();
assert.ok(observer.disconnected);
assert.equal(visibility.listeners.size, 0, 'Visibility listener leaked');
console.log('PASS: offscreen/background animations pause, resume, and clean up observers and listeners.');
