#!/usr/bin/env node
'use strict';

/**
 * Rasterizes `icon.svg` into the `icon.png` the manifest ships.
 *
 * The Marketplace does not accept an SVG icon, so the PNG is the one that gets
 * seen — in search results, in the extensions sidebar, on the listing page. It
 * was previously produced by hand from the four options in `ICON_GUIDE.md`,
 * which is why `sharp` sat in devDependencies with nothing in the repository
 * using it: the icon and the file it is generated from could drift apart with
 * nothing to notice.
 *
 * The SVG is rendered at 3x and scaled down rather than rasterized straight to
 * 128px. The icon is mostly thin strokes — a 2px accent line, a 3px hexagon —
 * and rendering those at their final size aliases them into an uneven gray.
 *
 * `icon.svg` animates two of its elements. SVG rasterizers take the attribute
 * values as authored and ignore `<animate>`, so the PNG is the first frame:
 * the main circle at full opacity, the center dot at r=8.
 *
 * Usage:
 *   npm run icon
 *   node scripts/generate-icon.js --size 256
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'icon.svg');
const OUTPUT = path.join(ROOT, 'icon.png');

// The Marketplace requires at least 128x128. The SVG's viewBox is 128 units, so
// anything larger is upscaling a design drawn for this size.
const DEFAULT_SIZE = 128;
const SUPERSAMPLE = 3;

function main() {
  const sizeIndex = process.argv.indexOf('--size');
  const size = sizeIndex === -1 ? DEFAULT_SIZE : Number(process.argv[sizeIndex + 1]);

  if (!Number.isInteger(size) || size < 128) {
    console.error('--size must be an integer of at least 128 (the Marketplace minimum)');
    process.exit(1);
  }

  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('sharp is not installed. Run: npm install');
    process.exit(1);
  }

  if (!fs.existsSync(SOURCE)) {
    console.error(`${path.relative(ROOT, SOURCE)} not found`);
    process.exit(1);
  }

  // density is dpi against a 96dpi baseline, so 96 * n renders the SVG n times
  // its authored size.
  sharp(SOURCE, { density: 96 * SUPERSAMPLE })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT)
    .then((info) => {
      console.log(`Wrote ${path.relative(ROOT, OUTPUT)} — ${info.width}x${info.height}, ${info.size} bytes`);
    })
    .catch((e) => {
      console.error(`Could not rasterize ${path.relative(ROOT, SOURCE)}: ${e.message}`);
      process.exit(1);
    });
}

main();
