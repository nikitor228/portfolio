/**
 * Fetches all photos from Cloudinary and generates photos.json
 *
 * Run: CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy node scripts/generate-manifest.js
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const CLOUD_NAME = 'dxvpalhqh';
const API_KEY    = process.env.CLOUDINARY_API_KEY    || 'YOUR_API_KEY';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET';

const FOLDERS = new Set(['armenia', 'georgia', 'indonesia', 'russia', 'thailand', 'turkey', 'vietnam']);

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });

async function fetchAll() {
  const results = [];
  let nextCursor = null;

  do {
    const res = await cloudinary.api.resources({
      type:        'upload',
      max_results: 500,
      next_cursor: nextCursor,
    });

    for (const r of res.resources) {
      const folder = r.asset_folder || '';
      if (!FOLDERS.has(folder)) continue;

      results.push({
        id:          r.public_id,
        category:    folder,
        orientation: r.width >= r.height ? 'landscape' : 'portrait',
        width:       r.width,
        height:      r.height,
        alt:         `Photography, ${folder.charAt(0).toUpperCase() + folder.slice(1)}`,
      });
    }

    nextCursor = res.next_cursor || null;
    process.stdout.write('.');
  } while (nextCursor);

  console.log('');
  return results;
}

async function main() {
  if (API_KEY === 'YOUR_API_KEY') {
    console.error('Pass credentials as env vars:');
    console.error('  CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy node scripts/generate-manifest.js');
    process.exit(1);
  }

  process.stdout.write('Fetching all photos');
  const all = await fetchAll();

  // log breakdown by folder
  const counts = {};
  all.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
  Object.entries(counts).forEach(([k, v]) => console.log(`  ${k}: ${v} photos`));

  const outPath = path.join(__dirname, '..', 'photos.json');
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
  console.log(`\nDone — photos.json with ${all.length} photos`);
}

main().catch(err => { console.error(err); process.exit(1); });
