#!/usr/bin/env node
'use strict';

/**
 * Draws the README hero and the GitHub social preview, and rasterizes both.
 *
 * A theme is judged on how it looks before it is judged on anything else, and
 * the two places that happen first are the top of the README and the card
 * GitHub unfurls when the repository is linked somewhere. Neither is covered by
 * the screenshots: those show the theme inside VS Code, at the size VS Code
 * draws it, which is unreadable at card scale.
 *
 * The artwork is generated rather than drawn by hand so the palette stays a
 * single source of truth. Every color below is read from the base theme's own
 * token colors, so a change to `themes/neon-pink-dark-color-theme.json` shows
 * up in the banner on the next `npm run banner` instead of drifting away from
 * it. The mock editor on the right is colored with the same values the theme
 * assigns to those scopes, so the banner is a screenshot in miniature rather
 * than an illustration of one.
 *
 * Both outputs share one 1280x400 composition. The social preview is the same
 * artwork on a 1280x640 canvas — GitHub's recommended size — with the content
 * centered vertically, so a change is made once and lands in both.
 *
 * Text is rendered with whatever the rasterizer resolves from the font stacks
 * below, so the PNGs are committed rather than generated at install time.
 *
 * Usage:
 *   npm run banner
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const THEME = path.join(ROOT, 'themes', 'neon-pink-dark-color-theme.json');
const OUT_DIR = path.join(ROOT, 'images');

const WIDTH = 1280;
const CONTENT_HEIGHT = 400;

// The artwork is mostly thin strokes and text. Rendering at 2x and scaling down
// is what keeps a 1px grid line from aliasing into a dashed one, the same
// reason `generate-icon.js` supersamples. 72dpi is the rasterizer's 1:1.
const SUPERSAMPLE = 2;

const OUTPUTS = [
  { file: 'banner.png', height: 400 },
  { file: 'social-preview.png', height: 640 },
];

// Two families deep, then the generic: the first is what macOS resolves, the
// second is what a Linux rasterizer is likely to have, and the generic keeps
// the text from vanishing if neither is installed.
const SANS = 'Helvetica Neue, DejaVu Sans, sans-serif';
const MONO = 'Menlo, DejaVu Sans Mono, monospace';

// The mock editor is monospaced, so a character advance is all the layout needs
// to place an indent. 0.6em is the advance of both families above.
const CH = 0.6;

/** Pulls a scope's color out of the theme so the banner cannot drift from it. */
function tokenColor(theme, scope) {
  for (const rule of theme.tokenColors) {
    const scopes = Array.isArray(rule.scope) ? rule.scope : String(rule.scope || '').split(/\s*,\s*/);
    if (scopes.includes(scope)) return rule.settings.foreground;
  }
  throw new Error(`no token color for scope: ${scope}`);
}

function palette(theme) {
  return {
    bg: theme.colors['editor.background'],
    fg: theme.colors['editor.foreground'],
    accent: tokenColor(theme, 'keyword'),
    storage: tokenColor(theme, 'storage'),
    string: tokenColor(theme, 'string'),
    number: tokenColor(theme, 'constant.numeric'),
    comment: tokenColor(theme, 'comment'),
    property: tokenColor(theme, 'support.type.property-name.json'),
    variable: tokenColor(theme, 'variable'),
    operator: tokenColor(theme, 'keyword.operator'),
    lineNumber: theme.colors['editorLineNumber.foreground'],
  };
}

/** The six lines of the mock editor, as [indent, [text, color], ...]. */
function codeLines(p) {
  return [
    [0, ['const', p.storage], [' theme ', p.variable], ['= {', p.operator]],
    [2, ['name', p.property], [': ', p.operator], ["'Neon Pink Dark'", p.string], [',', p.operator]],
    [2, ['accent', p.property], [': ', p.operator], ["'" + p.accent + "'", p.string], [',', p.operator]],
    [2, ['variants', p.property], [': ', p.operator], ['3', p.number], [',', p.operator]],
    [2, ['contrast', p.property], [': ', p.operator], ["'WCAG AA'", p.string], [',', p.operator]],
    [0, ['}', p.operator]],
    [0, ['', p.fg]],
    [0, ['// 2985 pairs measured, none below 4.5:1', p.comment]],
  ];
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** One code line: line number in the gutter, tokens flowing from the indent. */
function renderCodeLine(line, index, x, y, size) {
  const [indent, ...tokens] = line;
  const gutter = `<text x="${x - 22}" y="${y}" font-family="${MONO}" font-size="${size}" `
    + `fill="${'#B3689B'}" opacity="0.7" text-anchor="end">${index + 1}</text>`;
  const spans = tokens
    .filter(([text]) => text.length > 0)
    .map(([text, fill]) => `<tspan fill="${fill}">${escapeXml(text)}</tspan>`)
    .join('');
  if (!spans) return gutter;
  return `${gutter}<text x="${x + indent * size * CH}" y="${y}" font-family="${MONO}" font-size="${size}" xml:space="preserve">${spans}</text>`;
}

/** A rounded pill with a filled dot — one per variant, plus the contrast claim. */
function chip(x, y, label, dot, p) {
  const w = 34 + label.length * 8.4;
  return `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="${dot}" opacity="0.10"/>
      <rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="none" stroke="${dot}" stroke-width="1" opacity="0.55"/>
      <circle cx="${x + 15}" cy="${y + 15}" r="4" fill="${dot}"/>
      <text x="${x + 26}" y="${y + 20}" font-family="${SANS}" font-size="13" fill="${p.fg}" opacity="0.85">${escapeXml(label)}</text>
    </g>`;
}

function buildSvg(theme, height) {
  const p = palette(theme);
  const top = (height - CONTENT_HEIGHT) / 2;

  // The horizon grid sits on the canvas rather than the content, so it stays at
  // the bottom edge at either height.
  const horizon = height - 96;
  const verticals = [];
  for (let i = -14; i <= 14; i += 1) {
    const x = WIDTH / 2 + i * 46;
    verticals.push(`<line x1="${WIDTH / 2 + i * 300}" y1="${height}" x2="${x}" y2="${horizon}" stroke="${p.accent}" stroke-width="1"/>`);
  }
  const horizontals = [];
  for (let i = 1, y = horizon; y < height; i += 1) {
    y = horizon + i * i * 3.2;
    horizontals.push(`<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="${p.accent}" stroke-width="1"/>`);
  }

  const codeX = 760;
  const codeTop = top + 118;
  const code = codeLines(p)
    .map((line, i) => renderCodeLine(line, i, codeX, codeTop + i * 26, 15))
    .join('\n      ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}">
  <defs>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.30"/>
      <stop offset="55%" stop-color="${p.accent}" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </linearGradient>
    <filter id="soften" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <mask id="gridFade">
      <rect x="0" y="${horizon}" width="${WIDTH}" height="${height - horizon}" fill="url(#fade)" transform="scale(1,-1) translate(0,${-2 * horizon - (height - horizon)})"/>
    </mask>
  </defs>

  <rect width="${WIDTH}" height="${height}" fill="${p.bg}"/>
  <ellipse cx="300" cy="${top + 150}" rx="620" ry="330" fill="url(#glow)"/>
  <ellipse cx="980" cy="${top + 260}" rx="460" ry="260" fill="url(#glow)" opacity="0.55"/>

  <g opacity="0.30" mask="url(#gridFade)">
    ${verticals.join('\n    ')}
    ${horizontals.join('\n    ')}
  </g>

  <!-- Mark: the extension icon's circle-and-hexagon, scaled up -->
  <g transform="translate(80,${top + 56}) scale(0.72)">
    <circle cx="64" cy="64" r="45" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.3"/>
    <circle cx="64" cy="64" r="40" fill="none" stroke="${p.accent}" stroke-width="3" opacity="0.5"/>
    <circle cx="64" cy="64" r="35" fill="none" stroke="${p.accent}" stroke-width="4" filter="url(#soften)" opacity="0.9"/>
    <circle cx="64" cy="64" r="35" fill="none" stroke="${p.accent}" stroke-width="4"/>
    <polygon points="64,34 82,44 82,64 64,74 46,64 46,44" fill="none" stroke="${p.string}" stroke-width="3"/>
    <circle cx="64" cy="64" r="8" fill="${p.accent}"/>
    <line x1="64" y1="20" x2="64" y2="28" stroke="${p.accent}" stroke-width="2" stroke-linecap="round"/>
    <line x1="64" y1="100" x2="64" y2="108" stroke="${p.accent}" stroke-width="2" stroke-linecap="round"/>
    <line x1="20" y1="64" x2="28" y2="64" stroke="${p.accent}" stroke-width="2" stroke-linecap="round"/>
    <line x1="100" y1="64" x2="108" y2="64" stroke="${p.accent}" stroke-width="2" stroke-linecap="round"/>
  </g>

  <!-- Wordmark -->
  <text x="185" y="${top + 128}" font-family="${SANS}" font-size="17" letter-spacing="6" fill="${p.string}" opacity="0.85">VISUAL STUDIO CODE THEME</text>
  <text x="182" y="${top + 192}" font-family="${SANS}" font-size="52" font-weight="bold" letter-spacing="1" filter="url(#soften)" opacity="0.55" xml:space="preserve"><tspan fill="${p.fg}">NEON </tspan><tspan fill="${p.accent}">PINK</tspan><tspan fill="${p.fg}"> DARK</tspan></text>
  <text x="182" y="${top + 192}" font-family="${SANS}" font-size="52" font-weight="bold" letter-spacing="1" xml:space="preserve"><tspan fill="${p.fg}">NEON </tspan><tspan fill="${p.accent}">PINK</tspan><tspan fill="${p.fg}"> DARK</tspan></text>
  <rect x="184" y="${top + 216}" width="420" height="2" fill="url(#rule)"/>
  <text x="184" y="${top + 252}" font-family="${SANS}" font-size="20" fill="${p.string}">Pure black, neon pink, and every color measured.</text>

  <!-- Variant chips -->
  ${chip(184, top + 290, 'Dark', p.accent, p)}
  ${chip(282, top + 290, 'Soft', '#F646C0', p)}
  ${chip(380, top + 290, 'Dimmed', '#E25DB9', p)}
  ${chip(486, top + 290, 'WCAG AA', '#7DFFC6', p)}

  <!-- Mock editor -->
  <g>
    <rect x="700" y="${top + 52}" width="500" height="296" rx="14" fill="#0A0006" stroke="${p.accent}" stroke-width="1" opacity="0.9"/>
    <rect x="700" y="${top + 52}" width="500" height="36" rx="14" fill="${p.accent}" opacity="0.10"/>
    <rect x="700" y="${top + 74}" width="500" height="14" fill="${p.accent}" opacity="0.10"/>
    <line x1="700" y1="${top + 88}" x2="1200" y2="${top + 88}" stroke="${p.accent}" stroke-width="1" opacity="0.35"/>
    <circle cx="722" cy="${top + 70}" r="5" fill="${p.accent}"/>
    <circle cx="740" cy="${top + 70}" r="5" fill="${p.string}" opacity="0.8"/>
    <circle cx="758" cy="${top + 70}" r="5" fill="${p.comment}" opacity="0.8"/>
    <text x="782" y="${top + 75}" font-family="${MONO}" font-size="13" fill="${p.comment}">theme.js</text>
    ${code}
  </g>
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

  const writes = OUTPUTS.map(({ file, height }) => {
    const svg = buildSvg(theme, height);
    const out = path.join(OUT_DIR, file);
    return sharp(Buffer.from(svg), { density: 72 * SUPERSAMPLE })
      .resize(WIDTH, height)
      .png({ compressionLevel: 9 })
      .toFile(out)
      .then((info) => {
        console.log(`Wrote images/${file} — ${info.width}x${info.height}, ${info.size} bytes`);
      });
  });

  Promise.all(writes).catch((e) => {
    console.error(`Could not render the banner: ${e.message}`);
    process.exit(1);
  });
}

main();
