import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const source = await readFile(path.join(root, 'utils/realAssets.ts'), 'utf8');
const expected = JSON.parse(await readFile(new URL('./expected-assets.json', import.meta.url), 'utf8'));
const catalog = (name) => JSON.parse(source.match(new RegExp(`export const ${name} = (\\[.*?\\]);`, 's'))[1]);
const groups = { artist: catalog('ARTIST_ROSTER'), release: catalog('RELEASE_CATALOG'), sound: catalog('SOUND_ID_PREVIEWS') };
assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([key, items]) => [key, items.length])), { artist: 22, release: 8, sound: 4 });

for (const [group, items] of Object.entries(groups)) {
  const fixtures = expected.filter((item) => item.group === group);
  assert.deepEqual(items.map((item) => item.id), fixtures.map((item) => item.id), `${group} order changed`);
  assert.equal(new Set(items.map((item) => item.id)).size, items.length, `Duplicate ${group} IDs`);
  for (const [index, item] of items.entries()) {
    const fixture = fixtures[index];
    for (const key of ['id', 'name', 'title', 'artist', 'image', 'spotifyUrl', 'soundUrl', 'row', 'position', 'metric']) {
      if (key in fixture) assert.equal(item[key], fixture[key], `${item.id}: ${key} differs from source`);
    }
    assert.ok(item.image.startsWith('/assets/'), `${item.id}: image must be local`);
    const bytes = await readFile(path.join(root, 'public', item.image));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), fixture.sha256, `${item.id}: image differs from source`);
    if (item.spotifyUrl) assert.match(item.spotifyUrl, /^https:\/\/open\.spotify\.com\/(artist|track)\/[A-Za-z0-9]{22}$/);
    if (item.soundUrl) assert.match(item.soundUrl, /^https:\/\/vt\.tiktok\.com\/[A-Za-z0-9-]+\/$/);
  }
}

assert.deepEqual(groups.artist.filter((item) => item.row === 1).map((item) => item.position), Array.from({ length: 11 }, (_, i) => i + 1));
assert.deepEqual(groups.artist.filter((item) => item.row === 2).map((item) => item.position), Array.from({ length: 11 }, (_, i) => i + 1));

async function sourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? sourceFiles(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}

const files = [...await sourceFiles(path.join(root, 'components')), ...await sourceFiles(path.join(root, 'utils')), path.join(root, 'index.html')];
const localReferences = new Set();
for (const file of files) {
  const text = await readFile(file, 'utf8');
  assert.ok(!text.includes('images.unsplash.com'), `${path.relative(root, file)} still references stock media`);
  for (const match of text.matchAll(/["'](\/[^"'\s]+\.(?:webp|png|jpg|jpeg|svg|ico))["']/g)) localReferences.add(match[1]);
}
for (const reference of localReferences) await readFile(path.join(root, 'public', reference));
console.log(`PASS: ${expected.length} source mappings and image hashes; roster order; artist/track/sound URL formats; ${localReferences.size} local media references; no stock-image URLs.`);
