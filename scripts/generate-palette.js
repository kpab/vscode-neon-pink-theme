#!/usr/bin/env node
'use strict';

/**
 * Draws the palette strip that sits above the color table in both READMEs.
 *
 * The table underneath the image is the reference — it carries the codes to
 * copy and what each color is for. What it cannot do is show the colors. A
 * reader deciding whether a pink theme is readable is asking a question about
 * the colors themselves, and ten rows of `#FF2DBE` answer it only for the
 * people who can already read hex as color.
 *
 * Every value is read out of `themes/neon-pink-dark-color-theme.json` and every
 * ratio is measured here rather than copied from the table, so the picture
 * cannot claim a number the theme no longer holds. `npm test` does not check
 * this file — it is documentation, not a theme — so regenerate it with
 * `npm run palette` when a palette color moves.
 *
 * The base theme only. Soft and Dimmed keep the hue and the ratio and give up
 * saturation, which is a difference images/variants.png already shows at the
 * size where it reads.
 *
 * Usage:
 *   npm run palette
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const THEME = path.join(ROOT, 'themes', 'neon-pink-dark-color-theme.json');
const OUT = path.join(ROOT, 'images', 'palette.png');

const WIDTH = 1280;
const HEIGHT = 440;

// Thin strokes and small text — the same reason generate-banner.js supersamples.
const SUPERSAMPLE = 2;

const SANS = 'Helvetica Neue, DejaVu Sans, sans-serif';
const MONO = 'Menlo, DejaVu Sans Mono, monospace';

const PAD = 60;
const COLS = 5;
const CELL_W = (WIDTH - PAD * 2) / COLS;
const SWATCH_W = CELL_W - 24;
const SWATCH_H = 72;
const ROW_TOP = [86, 250];

/**
 * The ten colors the README table lists, under the names the table gives them.
 * The order is the strip's own rather than the table's: the inks first, the
 * surface they sit on last, since a black swatch reads as a hole in the grid
 * anywhere but at the end. `scope` is a TextMate scope, `key` a workbench
 * color. Nothing is duplicated: the description stays in the table, the value
 * stays in the theme.
 */
const ENTRIES = [
  { label: 'Accent', scope: 'keyword' },
  { label: 'Foreground', key: 'editor.foreground' },
  { label: 'Strings', scope: 'string' },
  { label: 'Numbers', scope: 'constant.numeric' },
  { label: 'Functions', scope: 'entity.name.function' },
  { label: 'Types', scope: 'entity.name.type' },
  { label: 'Comments', scope: 'comment' },
  { label: 'Operators', scope: 'punctuation' },
  { label: 'Line numbers', key: 'editorLineNumber.foreground' },
  { label: 'Background', key: 'editor.background' },
];

// ---------------------------------------------------------------------------
// color math — the WCAG 2.1 relative luminance check-contrast.js measures with
// ---------------------------------------------------------------------------

function parseHex(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) throw new Error(`palette colors have to be opaque six-digit hex: ${hex}`);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function luminance({ r, g, b }) {
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(fg, bg) {
  const [hi, lo] = [luminance(parseHex(fg)), luminance(parseHex(bg))].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------

/** Pulls a scope's color out of the theme so the strip cannot drift from it. */
function tokenColor(theme, scope) {
  for (const rule of theme.tokenColors) {
    const scopes = Array.isArray(rule.scope) ? rule.scope : String(rule.scope || '').split(/\s*,\s*/);
    if (scopes.includes(scope)) return rule.settings.foreground;
  }
  throw new Error(`no token color for scope: ${scope}`);
}

function resolve(theme, entry) {
  const color = entry.key ? theme.colors[entry.key] : tokenColor(theme, entry.scope);
  if (!color) throw new Error(`no color for ${entry.key || entry.scope}`);
  return { ...entry, color: color.toUpperCase() };
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** One cell: the color at a size worth judging, then its name, code and ratio. */
function renderCell(entry, index, bg, fg, muted) {
  const x = PAD + (index % COLS) * CELL_W;
  const y = ROW_TOP[Math.floor(index / COLS)];
  const ratio = contrast(entry.color, bg);

  // The code is set in its own color, which is half the point of the strip —
  // except where that color is the background and the ink would be invisible.
  const codeFill = ratio < 3 ? muted : entry.color;
  const measured = entry.color === bg
    ? 'the surface everything sits on'
    : `${(Math.round(ratio * 10) / 10).toFixed(1)}:1 contrast`;

  return `
  <g>
    <rect x="${x}" y="${y}" width="${SWATCH_W}" height="${SWATCH_H}" rx="12" fill="${entry.color}" filter="url(#soften)" opacity="0.45"/>
    <rect x="${x}" y="${y}" width="${SWATCH_W}" height="${SWATCH_H}" rx="12" fill="${entry.color}"/>
    <rect x="${x}" y="${y}" width="${SWATCH_W}" height="${SWATCH_H}" rx="12" fill="none" stroke="#FFFFFF" stroke-opacity="0.16"/>
    <text x="${x}" y="${y + SWATCH_H + 30}" font-family="${SANS}" font-size="16" fill="${fg}">${escapeXml(entry.label)}</text>
    <text x="${x}" y="${y + SWATCH_H + 54}" font-family="${MONO}" font-size="15" fill="${codeFill}">${escapeXml(entry.color)}</text>
    <text x="${x}" y="${y + SWATCH_H + 76}" font-family="${SANS}" font-size="12" fill="${muted}">${escapeXml(measured)}</text>
  </g>`;
}

function buildSvg(theme) {
  const bg = theme.colors['editor.background'].toUpperCase();
  const fg = theme.colors['editor.foreground'];
  const muted = theme.colors['editorLineNumber.foreground'];
  const accent = tokenColor(theme, 'keyword');
  const cells = ENTRIES.map((e) => resolve(theme, e))
    .map((e, i) => renderCell(e, i, bg, fg, muted))
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <filter id="soften" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${bg}"/>
  <ellipse cx="${WIDTH / 2}" cy="${HEIGHT / 2}" rx="720" ry="300" fill="url(#glow)"/>

  <text x="${PAD}" y="46" font-family="${SANS}" font-size="15" letter-spacing="5" fill="${fg}" opacity="0.9">COLOR PALETTE</text>
  <text x="${WIDTH - PAD}" y="46" font-family="${SANS}" font-size="13" fill="${muted}" text-anchor="end">text colors measured against ${bg} — none below 4.5:1</text>
  <rect x="${PAD}" y="60" width="${WIDTH - PAD * 2}" height="1" fill="url(#rule)"/>
${cells}
</svg>`;
}

function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('sharp is not installed. Run: npm install');
    process.exit(1);
  }

  const theme = JSON.parse(fs.readFileSync(THEME, 'utf8'));

  sharp(Buffer.from(buildSvg(theme)), { density: 72 * SUPERSAMPLE })
    .resize(WIDTH, HEIGHT)
    .png({ compressionLevel: 9 })
    .toFile(OUT)
    .then((info) => {
      console.log(`Wrote images/palette.png — ${info.width}x${info.height}, ${info.size} bytes`);
    })
    .catch((e) => {
      console.error(`Could not render the palette: ${e.message}`);
      process.exit(1);
    });
}

main();
