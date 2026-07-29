#!/usr/bin/env node
'use strict';

/**
 * Extracts the list of workbench color keys VS Code knows about, from a local
 * VS Code installation, into `scripts/vscode-color-keys.json`.
 *
 * The coverage half of `validate-themes.js` needs to know which keys exist —
 * an unset key is not an error, it is a Dark+ default bleeding through, and
 * finding those is most of what the first five issues in this repository were
 * about. There is no published machine-readable list: the keys are registered
 * in code, and the JSON schema VS Code serves for them lives behind the
 * in-process `vscode://schemas/workbench-colors` URI, which nothing outside
 * the editor can fetch.
 *
 * So the list is read out of the shipped bundle. `registerColor(id, defaults,
 * description)` survives minification as `xx("some.key", <defaults>, d(N,null))`
 * — the identifiers are mangled but the color id stays a string literal and the
 * localized description stays a two-argument `d()` call. A fourth argument
 * (`needsTransparency`) is optional and about a hundred colors pass it. This
 * scans for calls of that shape, then keeps only the ones made by whichever
 * callee name appears most often: `registerColor` accounts for ~900 of them,
 * while the shapes that merely resemble it (context keys, CSS selector helpers,
 * font-size tokens) appear a few dozen times at most under a different name.
 *
 * Two sources sit outside that bundle:
 *
 *   - The bundled extensions. A `gitDecoration.*` key is not core — it is
 *     declared in the Git extension's `contributes.colors`, in plain JSON, so
 *     those are read directly.
 *   - The 16 terminal ANSI colors, which are not registered one by one but come
 *     from a table walked at startup, leaving no call site to scan for.
 *
 * This runs against a local install and is not part of CI. Its output is
 * committed, and it records the VS Code version it came from so a stale list is
 * visible rather than silent. Re-run it after a VS Code upgrade:
 *
 *   npm run extract-color-keys
 *   npm run extract-color-keys -- "/path/to/Some Other VS Code.app"
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const OUTPUT = path.join(__dirname, 'vscode-color-keys.json');

// Not registered individually — `terminal.ansi*` is a table the terminal walks
// at startup, so there is no `registerColor` call site to scan for.
const ANSI_COLORS = [
  'terminal.ansiBlack', 'terminal.ansiRed', 'terminal.ansiGreen', 'terminal.ansiYellow',
  'terminal.ansiBlue', 'terminal.ansiMagenta', 'terminal.ansiCyan', 'terminal.ansiWhite',
  'terminal.ansiBrightBlack', 'terminal.ansiBrightRed', 'terminal.ansiBrightGreen',
  'terminal.ansiBrightYellow', 'terminal.ansiBrightBlue', 'terminal.ansiBrightMagenta',
  'terminal.ansiBrightCyan', 'terminal.ansiBrightWhite',
];

const DEFAULT_LOCATIONS = {
  darwin: [
    '/Applications/Visual Studio Code.app',
    '/Applications/Visual Studio Code - Insiders.app',
    path.join(os.homedir(), 'Applications/Visual Studio Code.app'),
  ],
  linux: [
    '/usr/share/code',
    '/usr/lib/code',
    '/opt/visual-studio-code',
    '/snap/code/current/usr/share/code',
  ],
  win32: [
    'C:\\Program Files\\Microsoft VS Code',
    path.join(os.homedir(), 'AppData\\Local\\Programs\\Microsoft VS Code'),
  ],
};

/** Resolves an install root to the directory holding product.json and out/. */
function resolveAppRoot(root) {
  const candidates = [
    path.join(root, 'Contents', 'Resources', 'app'), // macOS .app bundle
    path.join(root, 'resources', 'app'),             // Linux / Windows
    root,                                            // already the app dir
  ];
  return candidates.find((c) => fs.existsSync(path.join(c, 'product.json')));
}

function findInstall(explicit) {
  const roots = explicit ? [explicit] : (DEFAULT_LOCATIONS[process.platform] || []);
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const app = resolveAppRoot(root);
    if (app) return app;
  }
  return null;
}

/**
 * Splits a call's argument list, given the index of its opening parenthesis.
 * Returns null if the parentheses do not balance within `limit` characters,
 * which is what happens when the match was not a call at all.
 */
function splitArguments(src, openParen, limit = 4000) {
  const args = [];
  let depth = 0;
  let start = openParen + 1;
  let quote = null;

  for (let i = openParen; i < src.length && i - openParen < limit; i++) {
    const c = src[i];

    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }

    if (c === '(' || c === '{' || c === '[') { depth++; continue; }
    if (c === ')' || c === '}' || c === ']') {
      depth--;
      if (depth === 0) {
        args.push(src.slice(start, i));
        return args;
      }
      continue;
    }
    if (c === ',' && depth === 1) {
      args.push(src.slice(start, i));
      start = i + 1;
    }
  }
  return null;
}

function extractFromBundle(bundle) {
  const src = fs.readFileSync(bundle, 'utf8');
  // A lowercase-initial identifier-shaped string literal in first-argument
  // position. Most color ids are dotted, but a dozen (`focusBorder`,
  // `contrastBorder`, `errorForeground`) are not.
  const call = /([A-Za-z_$][\w$]*)\("([a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)*)"\s*,/g;
  const byCallee = new Map();

  let m;
  while ((m = call.exec(src))) {
    const args = splitArguments(src, m.index + m[1].length);
    // registerColor(id, defaults, nls.localize(...)[, needsTransparency]) —
    // three or four arguments, the third a localization lookup. Anything else
    // is a different function.
    if (!args || args.length < 3 || args.length > 4) continue;
    if (!/^d\(\d+,null\)$/.test(args[2].trim())) continue;
    if (!byCallee.has(m[1])) byCallee.set(m[1], new Set());
    byCallee.get(m[1]).add(m[2]);
  }

  if (byCallee.size === 0) return null;
  const [callee, keys] = [...byCallee.entries()].sort((a, b) => b[1].size - a[1].size)[0];
  return { callee, keys: [...keys] };
}

/** Color ids declared by the bundled extensions, in plain `contributes.colors`. */
function extractFromExtensions(app) {
  const dir = path.join(app, 'extensions');
  if (!fs.existsSync(dir)) return [];

  const keys = [];
  for (const entry of fs.readdirSync(dir)) {
    const manifest = path.join(dir, entry, 'package.json');
    if (!fs.existsSync(manifest)) continue;
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(manifest, 'utf8'));
    } catch {
      continue; // not every file under extensions/ is a manifest
    }
    for (const color of parsed.contributes?.colors || []) {
      if (color?.id) keys.push(color.id);
    }
  }
  return keys;
}

function main() {
  const explicit = process.argv[2];
  const app = findInstall(explicit);
  if (!app) {
    console.error(explicit
      ? `No VS Code install found at ${explicit}`
      : 'No VS Code install found. Pass the path to one:\n  npm run extract-color-keys -- "/Applications/Visual Studio Code.app"');
    process.exit(1);
  }

  const bundle = path.join(app, 'out', 'vs', 'workbench', 'workbench.desktop.main.js');
  if (!fs.existsSync(bundle)) {
    console.error(`Found ${app} but not its workbench bundle at out/vs/workbench/workbench.desktop.main.js`);
    process.exit(1);
  }

  const product = JSON.parse(fs.readFileSync(path.join(app, 'product.json'), 'utf8'));
  const found = extractFromBundle(bundle);

  // A bundle refactor that breaks the scan should fail loudly rather than
  // quietly write a short list that makes coverage look complete.
  if (!found || found.keys.length < 500) {
    console.error(`Extracted only ${found ? found.keys.length : 0} color keys from ${bundle}.`);
    console.error('The registerColor call shape has probably changed; update the scan in this script.');
    process.exit(1);
  }

  const fromExtensions = extractFromExtensions(app);
  const keys = [...new Set([...found.keys, ...fromExtensions, ...ANSI_COLORS])].sort();
  const output = {
    _comment: 'Generated by scripts/extract-color-keys.js — do not edit by hand. Re-run after a VS Code upgrade.',
    vscodeVersion: product.version,
    vscodeCommit: product.commit,
    count: keys.length,
    keys,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n');
  console.log(`VS Code ${product.version} (callee "${found.callee}"): `
    + `${found.keys.length} core + ${new Set(fromExtensions).size} from bundled extensions `
    + `+ ${ANSI_COLORS.length} ANSI = ${keys.length} keys`);
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT)}`);
}

main();
