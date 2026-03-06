/**
 * Fetches all photos from Cloudinary and generates photos.json
 *
 * Setup:
 *   1. Copy your API Key and API Secret from Cloudinary Dashboard → Settings → API Keys
 *   2. Fill in API_KEY and API_SECRET below (or set as env vars)
 *   3. Run: node scripts/generate-manifest.js
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// ── CONFIG ───────────────────────────────────────────────────────────────────

const CLOUD_NAME = 'dxvpalhqh';
const API_KEY    = process.env.CLOUDINARY_API_KEY    || 'YOUR_API_KEY';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET';

const FOLDERS = ['armenia', 'georgia', 'indonesia', 'russia', 'thailand', 'turkey', 'vietnam'];

// ── MAIN ─────────────────────────────────────────────────────────────────────

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });

async function fetchFolder(folder) {
  const results = [];
  let nextCursor = null;

  do {
    const res = await cloudinary.api.resources({
      type:         'upload',
      prefix:       folder + '/',
      max_results:  500,
      next_cursor:  nextCursor,
    });

    for (const r of res.resources) {
      // skip subfolders
      if (!r.public_id.match(/\.[a-z]+$/i) && r.resource_type !== 'image') continue;

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
  } while (nextCursor);

  return results;
}

async function main() {
  if (API_KEY === 'YOUR_API_KEY') {
    console.error('ERROR: Fill in API_KEY and API_SECRET in the script, or pass as env vars:');
    console.error('  CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy node scripts/generate-manifest.js');
    process.exit(1);
  }

  const all = [];

  for (const folder of FOLDERS) {
    process.stdout.write(`Fetching ${folder}... `);
    try {
      const photos = await fetchFolder(folder);
      console.log(`${photos.length} photos`);
      all.push(...photos);
    } catch (e) {
      console.log(`FAILED — ${e.message}`);
    }
  }

  const outPath = path.join(__dirname, '..', 'photos.json');
  fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
  console.log(`\nDone — photos.json with ${all.length} photos`);
}

main().catch(err => { console.error(err); process.exit(1); });
