import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../utils/pageRouting.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { getPageFromLocation, getPageUrl } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const resolve = (hash, pathname = '/') => getPageFromLocation({ hash, pathname });

for (const hash of ['', '#', '#home', '#/home']) assert.equal(resolve(hash), 'home');
assert.equal(resolve('#ABOUT'), 'about');
for (const hash of ['#artists', '#artist', '#roster', '#/artists']) assert.equal(resolve(hash), 'artists');
for (const route of ['demo-submission', 'demo-submissions', 'demo', 'demos', 'general-inquiry', 'general-enquiry', 'inquiry', 'enquiry', 'general', 'contact', 'contact-form', 'email-ticker']) {
  assert.equal(resolve(`#${route}`), 'contact');
}
for (const hash of ['#missing-track', '#artist2', '#artists2', '#404']) assert.equal(resolve(hash), 'not-found');
assert.equal(resolve('', '/missing-track'), 'not-found');
assert.equal(resolve('#artists', '/missing-track'), 'not-found');
assert.equal(resolve('#artists', '/index.html'), 'artists');
for (const page of ['home', 'about', 'artists', 'contact']) {
  const url = new URL(getPageUrl(page), 'http://localhost/missing-track');
  assert.equal(getPageFromLocation(url), page, `Recovery URL for ${page} must work from an invalid path`);
}
console.log('PASS: existing pages and aliases, unknown paths/hashes, removed pages, and recovery URLs.');
