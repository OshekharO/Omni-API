const assert = require('assert');
const app = require('./index');
const { torrent1337x } = require('./scraper/1337x');
const { nyaaSI } = require('./scraper/nyaaSI');
const { yts } = require('./scraper/yts');
const { pirateBay } = require('./scraper/pirateBay');

async function runTests() {
  console.log('Running test suite...');

  // Test 1: pirateBay scraper
  console.log('Testing pirateBay scraper...');
  const pbRes = await pirateBay('ubuntu', '1');
  assert(Array.isArray(pbRes), 'pirateBay should return an array');
  console.log(`✓ pirateBay returned ${pbRes.length} items`);

  // Test 2: nyaaSI scraper
  console.log('Testing nyaaSI scraper...');
  const nyaaRes = await nyaaSI('naruto', '1');
  assert(Array.isArray(nyaaRes), 'nyaaSI should return an array');
  console.log(`✓ nyaaSI returned ${nyaaRes.length} items`);

  // Test 3: yts scraper
  console.log('Testing yts scraper...');
  const ytsRes = await yts('inception', '1');
  assert(Array.isArray(ytsRes), 'yts should return an array');
  console.log(`✓ yts returned ${ytsRes.length} items`);

  // Test 4: 1337x scraper
  console.log('Testing 1337x scraper...');
  const res1337x = await torrent1337x('linux', '1');
  assert(Array.isArray(res1337x), 'torrent1337x should return an array');
  console.log(`✓ 1337x returned ${res1337x.length} items`);

  console.log('All tests completed successfully!');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
