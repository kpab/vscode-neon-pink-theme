#!/usr/bin/env node
'use strict';

/**
 * Structural validation for every theme in package.json's contributes.themes.
 *
 * `check-contrast.js` measures whether the colors are readable. This checks
 * whether they are colors at all — the class of mistake that ships silently
 * because VS Code does not complain about it:
 *
 *   1. A malformed value. `#FF2DB` is five digits, `#GG0044` is not hex, and
 *      `rgba(255,0,0,.5)` is CSS rather than a VS Code color. VS Code drops the
 *      key and falls back to Dark+, which looks like the theme simply forgot it.
 *   2. A key VS Code does not know. A typo (`editor.forground`) and a key that
 *      was removed upstream are indistinguishable in the file, and both do
 *      nothing. The known-key list comes from a real install — see
 *      `extract-color-keys.js` — and keys that are deliberately out of date are
 *      listed in KNOWN_EXCEPTIONS with the reason.
 *   3. A key written twice. `JSON.parse` keeps the last one without a word, so
 *      an edit to the first copy has no effect at all. `colors` is flat, which
 *      is what makes a textual duplicate scan safe to do here.
 *   4. A malformed `tokenColors` entry. A missing `settings`, a `fontStyle` of
 *      `"italics"`, a scope that is neither a string nor an array of them.
 *
 * It also reports coverage: how many of the keys VS Code registers this theme
 * sets. Unset is not a failure — most of the 900-odd keys belong to UI this
 * theme will never be asked to color — so the count is informational and
 * `--coverage` lists what is unset, grouped by prefix. IGNORED_GROUPS documents
 * the areas that are unset on purpose so they stay out of that list.
 *
 * Usage: node scripts/validate-themes.js [--coverage]
 * Exits non-zero on any error. Warnings do not fail the run.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KEYS_FILE = path.join(__dirname, 'vscode-color-keys.json');

// Color keys this theme sets that the bundled key list does not contain.
// Everything here has to be a deliberate decision, not an unexplained leftover.
const KNOWN_EXCEPTIONS = {
  'editorIndentGuide.background':
    'replaced by editorIndentGuide.background1 in VS Code 1.83; kept because engines.vscode allows 1.80–1.82',
  'editorIndentGuide.activeBackground':
    'replaced by editorIndentGuide.activeBackground1 in VS Code 1.83; kept for the same reason',
};

// Areas left uncolored on purpose. A prefix here is dropped from the coverage
// report, so what remains in that report is a list of real candidates.
const IGNORED_GROUPS = [
  ['agents', 'Copilot agent sessions UI — a product surface this theme does not target'],
  ['agentFeedback', 'same'],
  ['agentSession', 'same'],
  ['agentStatus', 'same'],
  ['chat', 'Copilot chat UI — same'],
  ['inlineChat', 'same'],
  ['interactive', 'same'],
  ['inlineEdit', 'same'],
  ['chart', 'chart rendering inside notebook output — not editor chrome'],
  ['charts', 'same'],
  ['walkThrough', 'the welcome and walkthrough pages — seen once, before a theme is even chosen'],
  ['walkthrough', 'same'],
  ['welcomePage', 'same'],
  ['ports', 'the remote port-forwarding table — remote-specific UI'],
  ['remoteHub', 'same'],
  ['simpleFindWidget', 'a widget that inherits the find widget colors this theme already sets'],
  ['keybindingTable', 'the keybindings editor — a settings surface, not a coding one'],
  ['settings', 'the settings editor — same'],
  ['testing', 'the test explorer — colored by the test extension that provides it'],
  ['debugIcon', 'debug toolbar icons — the debug UI is left to the default icon colors'],
  ['debugConsole', 'same'],
  ['debugView', 'same'],
  ['debugTokenExpression', 'same'],
  ['debugExceptionWidget', 'same'],
  ['notebook', 'notebook cell chrome — out of scope for a code editor theme'],
  ['notebookStatusRunning', 'same'],
  ['notebookStatusSuccess', 'same'],
  ['notebookStatusError', 'same'],
  ['notebookScrollbarSlider', 'same'],
  ['notebookEditorOverviewRuler', 'same'],
  ['scm', 'the source control graph view — recent UI with its own defaults'],
  ['multiDiffEditor', 'same'],
  ['commentsView', 'the pull request comment views, provided by extensions'],
  ['editorCommentsWidget', 'same'],
  ['peekViewEditorStickyScroll', 'inherits the peek view colors this theme already sets'],
  ['profileBadge', 'profile and account badges in the activity bar'],
  ['radio', 'radio widgets, used only in the settings and walkthrough editors'],
  ['searchEditor', 'the search editor inherits the editor and find widget colors'],
];

function fail(errors, file, message) {
  errors.push(`${file}: ${message}`);
}

/** VS Code accepts #RGB, #RGBA, #RRGGBB and #RRGGBBAA, and nothing else. */
const COLOR = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const FONT_STYLES = new Set(['bold', 'italic', 'underline', 'strikethrough', '']);

function readJson(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return { raw, parsed: JSON.parse(raw) };
}

/**
 * Finds keys written more than once inside the flat `colors` object.
 * Textual rather than structural because the parser has already discarded the
 * evidence by the time it returns.
 */
function duplicateColorKeys(raw) {
  const start = raw.indexOf('"colors"');
  if (start === -1) return [];
  const open = raw.indexOf('{', start);
  if (open === -1) return [];

  let depth = 0;
  let end = -1;
  for (let i = open; i < raw.length; i++) {
    if (raw[i] === '{') depth++;
    else if (raw[i] === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return [];

  const body = raw.slice(open, end);
  const seen = new Map();
  for (const m of body.matchAll(/"([^"\\]+)"\s*:/g)) {
    seen.set(m[1], (seen.get(m[1]) || 0) + 1);
  }
  return [...seen.entries()].filter(([, n]) => n > 1).map(([key]) => key);
}

function validateColors(theme, file, knownKeys, errors, warnings) {
  const colors = theme.colors;
  if (!colors || typeof colors !== 'object') {
    fail(errors, file, 'no "colors" object');
    return;
  }

  for (const [key, value] of Object.entries(colors)) {
    if (typeof value !== 'string') {
      fail(errors, file, `colors["${key}"] is ${typeof value}, expected a color string`);
      continue;
    }
    if (!COLOR.test(value)) {
      fail(errors, file, `colors["${key}"] = "${value}" is not #RGB, #RGBA, #RRGGBB or #RRGGBBAA`);
    }
    if (knownKeys && !knownKeys.has(key)) {
      if (key in KNOWN_EXCEPTIONS) {
        warnings.push(`${file}: colors["${key}"] — ${KNOWN_EXCEPTIONS[key]}`);
      } else {
        fail(errors, file, `colors["${key}"] is not a color key VS Code registers (typo, or removed upstream)`);
      }
    }
  }
}

function validateTokenColors(theme, file, errors) {
  if (!Array.isArray(theme.tokenColors)) {
    fail(errors, file, '"tokenColors" is missing or not an array');
    return;
  }

  theme.tokenColors.forEach((entry, i) => {
    const at = `tokenColors[${i}]${entry && entry.name ? ` ("${entry.name}")` : ''}`;

    if (!entry || typeof entry !== 'object') {
      fail(errors, file, `${at} is not an object`);
      return;
    }
    if (entry.scope !== undefined
      && typeof entry.scope !== 'string'
      && !(Array.isArray(entry.scope) && entry.scope.every((s) => typeof s === 'string'))) {
      fail(errors, file, `${at} has a scope that is neither a string nor an array of strings`);
    }
    if (!entry.settings || typeof entry.settings !== 'object') {
      fail(errors, file, `${at} has no "settings" object`);
      return;
    }

    const { foreground, background, fontStyle, ...rest } = entry.settings;
    for (const [name, value] of Object.entries({ foreground, background })) {
      if (value === undefined) continue;
      if (typeof value !== 'string' || !COLOR.test(value)) {
        fail(errors, file, `${at} settings.${name} = ${JSON.stringify(value)} is not a color`);
      }
    }
    if (fontStyle !== undefined) {
      if (typeof fontStyle !== 'string') {
        fail(errors, file, `${at} settings.fontStyle is not a string`);
      } else {
        for (const part of fontStyle.trim().split(/\s+/)) {
          if (!FONT_STYLES.has(part)) {
            fail(errors, file, `${at} settings.fontStyle contains "${part}" — expected bold, italic, underline or strikethrough`);
          }
        }
      }
    }
    for (const key of Object.keys(rest)) {
      fail(errors, file, `${at} settings has unknown property "${key}"`);
    }
  });
}

function validateSemanticTokenColors(theme, file, errors) {
  const semantic = theme.semanticTokenColors;
  if (semantic === undefined) return;
  if (typeof semantic !== 'object' || semantic === null || Array.isArray(semantic)) {
    fail(errors, file, '"semanticTokenColors" is not an object');
    return;
  }

  for (const [selector, value] of Object.entries(semantic)) {
    const at = `semanticTokenColors["${selector}"]`;
    if (typeof value === 'string') {
      if (!COLOR.test(value)) fail(errors, file, `${at} = "${value}" is not a color`);
      continue;
    }
    if (typeof value !== 'object' || value === null) {
      fail(errors, file, `${at} is neither a color string nor a settings object`);
      continue;
    }
    const { foreground, background, fontStyle, bold, italic, underline, strikethrough, ...rest } = value;
    for (const [name, color] of Object.entries({ foreground, background })) {
      if (color !== undefined && (typeof color !== 'string' || !COLOR.test(color))) {
        fail(errors, file, `${at}.${name} = ${JSON.stringify(color)} is not a color`);
      }
    }
    if (fontStyle !== undefined && typeof fontStyle !== 'string') {
      fail(errors, file, `${at}.fontStyle is not a string`);
    }
    for (const [name, flag] of Object.entries({ bold, italic, underline, strikethrough })) {
      if (flag !== undefined && typeof flag !== 'boolean') {
        fail(errors, file, `${at}.${name} is not a boolean`);
      }
    }
    for (const key of Object.keys(rest)) {
      fail(errors, file, `${at} has unknown property "${key}"`);
    }
  }
}

function validateManifest(pkg, errors) {
  const themes = pkg.contributes && pkg.contributes.themes;
  if (!Array.isArray(themes) || themes.length === 0) {
    errors.push('package.json: contributes.themes is missing or empty');
    return [];
  }

  const labels = new Set();
  for (const entry of themes) {
    const at = `package.json: contributes.themes entry "${entry.label || '(unlabeled)'}"`;
    if (!entry.label) errors.push(`${at} has no label`);
    if (labels.has(entry.label)) errors.push(`${at} is declared twice`);
    labels.add(entry.label);

    if (!['vs', 'vs-dark', 'hc-black', 'hc-light'].includes(entry.uiTheme)) {
      errors.push(`${at} has uiTheme "${entry.uiTheme}" — expected vs, vs-dark, hc-black or hc-light`);
    }
    if (!entry.path) {
      errors.push(`${at} has no path`);
    } else if (!fs.existsSync(path.join(ROOT, entry.path))) {
      errors.push(`${at} points at ${entry.path}, which does not exist`);
    }
  }
  return themes.filter((t) => t.path && fs.existsSync(path.join(ROOT, t.path)));
}

function coverageReport(theme, knownKeys, showList) {
  const set = new Set(Object.keys(theme.colors || {}));
  const ignored = new Set(IGNORED_GROUPS.map(([prefix]) => prefix));

  const unset = [];
  let ignoredCount = 0;
  for (const key of knownKeys) {
    if (set.has(key)) continue;
    if (ignored.has(key.split('.')[0])) { ignoredCount++; continue; }
    unset.push(key);
  }

  console.log(`  coverage: ${set.size} of ${knownKeys.size} keys set, `
    + `${unset.length} unset, ${ignoredCount} in documented ignore groups`);

  if (!showList || unset.length === 0) return;

  const byPrefix = new Map();
  for (const key of unset) {
    const prefix = key.split('.')[0];
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
    byPrefix.get(prefix).push(key);
  }
  for (const [prefix, keys] of [...byPrefix.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`    ${prefix} (${keys.length}): ${keys.join(', ')}`);
  }
}

function main() {
  const showCoverage = process.argv.includes('--coverage');
  const errors = [];
  const warnings = [];

  let knownKeys = null;
  if (fs.existsSync(KEYS_FILE)) {
    const list = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8'));
    knownKeys = new Set(list.keys);
    console.log(`Checking against ${knownKeys.size} color keys from VS Code ${list.vscodeVersion}\n`);
  } else {
    // Not fatal: the list is a convenience generated from a local install, and
    // a clone without it should still be able to run everything else.
    warnings.push(`${path.relative(ROOT, KEYS_FILE)} is missing — key names not checked. Run: npm run extract-color-keys`);
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const themes = validateManifest(pkg, errors);

  for (const entry of themes) {
    const file = entry.path.replace(/^\.\//, '');
    console.log(`— ${entry.label} —`);

    let raw;
    let theme;
    try {
      ({ raw, parsed: theme } = readJson(path.join(ROOT, entry.path)));
    } catch (e) {
      fail(errors, file, `is not valid JSON — ${e.message}`);
      console.log('');
      continue;
    }

    if (theme.type !== undefined && !['dark', 'light', 'hc'].includes(theme.type)) {
      fail(errors, file, `"type" is "${theme.type}" — expected dark, light or hc`);
    }
    if (theme.semanticHighlighting !== undefined && typeof theme.semanticHighlighting !== 'boolean') {
      fail(errors, file, '"semanticHighlighting" is not a boolean');
    }

    for (const key of duplicateColorKeys(raw)) {
      fail(errors, file, `colors["${key}"] is defined more than once — only the last one takes effect`);
    }

    validateColors(theme, file, knownKeys, errors, warnings);
    validateTokenColors(theme, file, errors);
    validateSemanticTokenColors(theme, file, errors);

    if (knownKeys) coverageReport(theme, knownKeys, showCoverage);
    console.log('');
  }

  for (const warning of warnings) console.log(`warning: ${warning}`);
  if (warnings.length) console.log('');

  if (errors.length === 0) {
    console.log(`${themes.length} themes validated, no errors`);
    if (!showCoverage && knownKeys) console.log('Run with --coverage to list the keys that are unset');
    process.exit(0);
  }

  for (const error of errors) console.error(`error: ${error}`);
  console.error(`\n${errors.length} error${errors.length === 1 ? '' : 's'}`);
  process.exit(1);
}

main();
