#!/usr/bin/env node
'use strict';

/**
 * WCAG 2.1 contrast check for themes/neon-pink-dark-color-theme.json.
 *
 * Two things make a theme's contrast easy to get wrong by eye:
 *
 *   1. Alpha. `#FF66CAA3` is 64% opacity — what reaches the eye is the color
 *      composited over whatever is behind it, which is much darker than the
 *      swatch suggests. Every color here is blended down to an opaque value
 *      before it is measured.
 *   2. Backgrounds that are not the editor background. Selected text sits on
 *      `editor.selectionBackground`, the current line sits on
 *      `editor.lineHighlightBackground`, and a changed line in the diff editor
 *      sits on `diffEditor.*LineBackground`. Each raises the floor luminance,
 *      so a color that passes on pure black can still fail in place.
 *
 * Every `tokenColors` and `semanticTokenColors` foreground is checked against
 * all four editor surfaces; workbench colors are checked against the surface
 * they actually render on, listed in UI_CHECKS.
 *
 * Usage: node scripts/check-contrast.js [--verbose]
 * Exits non-zero if any check falls below its threshold.
 */

const fs = require('fs');
const path = require('path');

const THEME_PATH = path.join(__dirname, '..', 'themes', 'neon-pink-dark-color-theme.json');

/** WCAG 2.1 AA for body-size text. */
const AA_TEXT = 4.5;
/** WCAG 2.1 AA for non-text (icons, decorations, focus rings). */
const AA_NON_TEXT = 3.0;

/**
 * Colors that are exempt, with the reason. A slot that is a background by
 * definition cannot be held to a foreground contrast ratio.
 */
const EXEMPT = {
  'terminal.ansiBlack': 'the black ANSI slot — programs use it as a background, not as text',
  'editorWhitespace.foreground':
    'a deliberately faint guide — at 3:1 the dots and arrows compete with the code they sit inside',
  'tree.indentGuidesStroke': 'same — an indent guide that meets 3:1 reads as a rule, not a hint',
  'diffEditor.diagonalFill':
    'the hatch over lines that do not exist on one side — a fill loud enough for 3:1 reads as content',
};

// ---------------------------------------------------------------------------
// color math
// ---------------------------------------------------------------------------

function parseHex(hex) {
  const m = /^#?([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(String(hex).trim());
  if (!m) throw new Error(`not a #RRGGBB or #RRGGBBAA color: ${hex}`);
  const n = parseInt(m[1], 16);
  return {
    r: (n >> 16) & 0xff,
    g: (n >> 8) & 0xff,
    b: n & 0xff,
    a: m[2] === undefined ? 1 : parseInt(m[2], 16) / 255,
  };
}

function toHex({ r, g, b }) {
  const h = (v) => Math.round(v).toString(16).padStart(2, '0').toUpperCase();
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Composite `fg` over an already-opaque `bg`. */
function composite(fg, bg) {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

/** Flatten a stack of colors, topmost first, onto opaque black. */
function flatten(stack) {
  let out = { r: 0, g: 0, b: 0, a: 1 };
  for (let i = stack.length - 1; i >= 0; i--) out = composite(stack[i], out);
  return out;
}

function luminance({ r, g, b }) {
  const chan = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

function contrast(fg, bg) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------
// checks
// ---------------------------------------------------------------------------

/**
 * Workbench colors, as [foreground key, [background keys, topmost first]].
 * The background stack ends at the opaque surface the widget sits on.
 */
const UI_CHECKS = [
  ['editor.foreground', ['editor.background']],
  ['editorLineNumber.foreground', ['editor.background']],
  ['editorLineNumber.activeForeground', ['editor.lineHighlightBackground', 'editor.background']],
  ['editorCursor.foreground', ['editor.background'], AA_NON_TEXT],
  ['editorWhitespace.foreground', ['editor.background'], AA_NON_TEXT],

  ['sideBar.foreground', ['sideBar.background']],
  ['sideBarTitle.foreground', ['sideBar.background']],
  ['sideBarSectionHeader.foreground', ['sideBarSectionHeader.background']],
  ['statusBar.foreground', ['statusBar.background']],
  ['statusBar.debuggingForeground', ['statusBar.debuggingBackground']],
  ['statusBar.noFolderForeground', ['statusBar.noFolderBackground']],
  ['statusBarItem.remoteForeground', ['statusBarItem.remoteBackground']],
  ['activityBar.foreground', ['activityBar.background']],
  ['activityBar.inactiveForeground', ['activityBar.background']],
  ['activityBarBadge.foreground', ['activityBarBadge.background']],
  ['badge.foreground', ['badge.background']],
  ['tab.activeForeground', ['tab.activeBackground']],
  ['tab.inactiveForeground', ['tab.inactiveBackground']],
  ['titleBar.activeForeground', ['titleBar.activeBackground']],
  ['titleBar.inactiveForeground', ['titleBar.inactiveBackground']],
  ['panelTitle.activeForeground', ['panel.background']],
  ['panelTitle.inactiveForeground', ['panel.background']],
  ['breadcrumb.foreground', ['breadcrumb.background']],
  ['breadcrumb.focusForeground', ['breadcrumb.background']],
  ['breadcrumb.activeSelectionForeground', ['breadcrumb.background']],

  ['list.activeSelectionForeground', ['list.activeSelectionBackground', 'sideBar.background']],
  ['list.inactiveSelectionForeground', ['list.inactiveSelectionBackground', 'sideBar.background']],
  ['list.hoverForeground', ['list.hoverBackground', 'sideBar.background']],
  ['list.focusForeground', ['list.focusBackground', 'sideBar.background']],
  ['list.highlightForeground', ['sideBar.background']],
  ['list.errorForeground', ['sideBar.background']],
  ['list.warningForeground', ['sideBar.background']],
  ['tree.indentGuidesStroke', ['sideBar.background'], AA_NON_TEXT],

  ['input.foreground', ['input.background']],
  ['input.placeholderForeground', ['input.background']],
  ['inputOption.activeForeground', ['inputOption.activeBackground', 'input.background']],
  ['dropdown.foreground', ['dropdown.background']],
  ['checkbox.foreground', ['checkbox.background']],
  ['button.foreground', ['button.background']],
  ['button.foreground', ['button.hoverBackground']],
  ['button.secondaryForeground', ['button.secondaryBackground']],
  ['textLink.foreground', ['editor.background']],
  ['textLink.activeForeground', ['editor.background']],

  ['quickInput.foreground', ['quickInput.background']],
  ['quickInputList.focusForeground', ['quickInputList.focusBackground', 'quickInput.background']],
  ['pickerGroup.foreground', ['quickInput.background']],
  ['editorWidget.foreground', ['editorWidget.background']],
  ['editorSuggestWidget.foreground', ['editorSuggestWidget.background']],
  [
    'editorSuggestWidget.selectedForeground',
    ['editorSuggestWidget.selectedBackground', 'editorSuggestWidget.background'],
  ],
  ['editorSuggestWidget.highlightForeground', ['editorSuggestWidget.background']],
  ['editorHoverWidget.foreground', ['editorHoverWidget.background']],
  ['menu.foreground', ['menu.background']],
  ['menu.selectionForeground', ['menu.selectionBackground', 'menu.background']],
  ['menubar.selectionForeground', ['menubar.selectionBackground', 'titleBar.activeBackground']],
  ['notifications.foreground', ['notifications.background']],
  ['notificationLink.foreground', ['notifications.background']],
  ['notificationsErrorIcon.foreground', ['notifications.background'], AA_NON_TEXT],
  ['notificationsWarningIcon.foreground', ['notifications.background'], AA_NON_TEXT],
  ['notificationsInfoIcon.foreground', ['notifications.background'], AA_NON_TEXT],
  ['peekViewResult.fileForeground', ['peekViewResult.background']],
  ['peekViewResult.lineForeground', ['peekViewResult.background']],
  ['peekViewTitleLabel.foreground', ['peekViewTitle.background']],
  ['peekViewTitleDescription.foreground', ['peekViewTitle.background']],

  ['terminal.foreground', ['terminal.background']],
  ['terminal.ansiBlack', ['terminal.background']],
  ['terminal.ansiBrightBlack', ['terminal.background']],
  ['terminal.ansiRed', ['terminal.background']],
  ['terminal.ansiBrightRed', ['terminal.background']],
  ['terminal.ansiGreen', ['terminal.background']],
  ['terminal.ansiBrightGreen', ['terminal.background']],
  ['terminal.ansiYellow', ['terminal.background']],
  ['terminal.ansiBrightYellow', ['terminal.background']],
  ['terminal.ansiBlue', ['terminal.background']],
  ['terminal.ansiBrightBlue', ['terminal.background']],
  ['terminal.ansiMagenta', ['terminal.background']],
  ['terminal.ansiBrightMagenta', ['terminal.background']],
  ['terminal.ansiCyan', ['terminal.background']],
  ['terminal.ansiBrightCyan', ['terminal.background']],
  ['terminal.ansiWhite', ['terminal.background']],
  ['terminal.ansiBrightWhite', ['terminal.background']],

  ['editorError.foreground', ['editor.background'], AA_NON_TEXT],
  ['editorWarning.foreground', ['editor.background'], AA_NON_TEXT],
  ['editorInfo.foreground', ['editor.background'], AA_NON_TEXT],
  ['editorHint.foreground', ['editor.background'], AA_NON_TEXT],
  ['problemsErrorIcon.foreground', ['panel.background'], AA_NON_TEXT],
  ['problemsWarningIcon.foreground', ['panel.background'], AA_NON_TEXT],
  ['problemsInfoIcon.foreground', ['panel.background'], AA_NON_TEXT],
  ['input.foreground', ['inputValidation.errorBackground']],
  ['input.foreground', ['inputValidation.warningBackground']],
  ['input.foreground', ['inputValidation.infoBackground']],

  ['gitDecoration.addedResourceForeground', ['sideBar.background']],
  ['gitDecoration.modifiedResourceForeground', ['sideBar.background']],
  ['gitDecoration.deletedResourceForeground', ['sideBar.background']],
  ['gitDecoration.untrackedResourceForeground', ['sideBar.background']],
  ['gitDecoration.ignoredResourceForeground', ['sideBar.background']],
  ['gitDecoration.conflictingResourceForeground', ['sideBar.background']],
  ['gitDecoration.stageModifiedResourceForeground', ['sideBar.background']],
  ['gitDecoration.stageDeletedResourceForeground', ['sideBar.background']],
  ['gitDecoration.submoduleResourceForeground', ['sideBar.background']],
  ['editorGutter.addedBackground', ['editorGutter.background'], AA_NON_TEXT],
  ['editorGutter.modifiedBackground', ['editorGutter.background'], AA_NON_TEXT],
  ['editorGutter.deletedBackground', ['editorGutter.background'], AA_NON_TEXT],
  ['editorGutter.commentRangeForeground', ['editorGutter.background'], AA_NON_TEXT],
  ['minimapGutter.addedBackground', ['editor.background'], AA_NON_TEXT],
  ['minimapGutter.modifiedBackground', ['editor.background'], AA_NON_TEXT],
  ['minimapGutter.deletedBackground', ['editor.background'], AA_NON_TEXT],

  ['diffEditor.unchangedRegionForeground', ['diffEditor.unchangedRegionBackground']],
  // The conflict markers themselves are plain editor text sitting on the
  // header background.
  ['editor.foreground', ['merge.currentHeaderBackground', 'editor.background']],
  ['editor.foreground', ['merge.incomingHeaderBackground', 'editor.background']],
  ['editor.foreground', ['merge.commonHeaderBackground', 'editor.background']],
];

/**
 * The surfaces syntax colors have to survive. A token color is checked against
 * every one of them.
 */
function editorSurfaces(colors) {
  // A surface whose keys are not defined yet is skipped rather than assumed:
  // an undefined key means VS Code's own default, which this theme does not own.
  const bg = (keys) =>
    keys.every((k) => colors[k]) ? flatten(keys.map((k) => parseHex(colors[k]))) : null;
  return [
    { name: 'editor', color: bg(['editor.background']) },
    { name: 'selection', color: bg(['editor.selectionBackground', 'editor.background']) },
    { name: 'current line', color: bg(['editor.lineHighlightBackground', 'editor.background']) },
    {
      name: 'diff inserted',
      color: bg(['diffEditor.insertedLineBackground', 'editor.background']),
    },
    { name: 'diff removed', color: bg(['diffEditor.removedLineBackground', 'editor.background']) },
    // The word-level highlight stacks on top of the line-level one, so a
    // changed word inside a changed line is the darkest case in a diff.
    {
      name: 'diff inserted word',
      color: bg([
        'diffEditor.insertedTextBackground',
        'diffEditor.insertedLineBackground',
        'editor.background',
      ]),
    },
    {
      name: 'diff removed word',
      color: bg([
        'diffEditor.removedTextBackground',
        'diffEditor.removedLineBackground',
        'editor.background',
      ]),
    },
    {
      name: 'merge current',
      color: bg(['merge.currentContentBackground', 'editor.background']),
    },
    {
      name: 'merge incoming',
      color: bg(['merge.incomingContentBackground', 'editor.background']),
    },
    {
      name: 'merge common',
      color: bg(['merge.commonContentBackground', 'editor.background']),
    },
    {
      name: 'merge editor change',
      color: bg(['mergeEditor.change.background', 'editor.background']),
    },
    {
      name: 'merge editor changed word',
      color: bg([
        'mergeEditor.change.word.background',
        'mergeEditor.change.background',
        'editor.background',
      ]),
    },
  ].filter((s) => s.color);
}

/** Pull every foreground out of tokenColors and semanticTokenColors. */
function syntaxForegrounds(theme) {
  const out = [];
  for (const rule of theme.tokenColors || []) {
    const fg = rule.settings && rule.settings.foreground;
    if (!fg) continue;
    const scope = Array.isArray(rule.scope) ? rule.scope[0] : rule.scope;
    out.push({ label: rule.name || scope, color: fg });
  }
  for (const [type, value] of Object.entries(theme.semanticTokenColors || {})) {
    const fg = typeof value === 'string' ? value : value.foreground;
    if (!fg) continue;
    out.push({ label: `semantic: ${type}`, color: fg });
  }
  return out;
}

// ---------------------------------------------------------------------------
// run
// ---------------------------------------------------------------------------

function main() {
  const verbose = process.argv.includes('--verbose');
  const theme = JSON.parse(fs.readFileSync(THEME_PATH, 'utf8'));
  const colors = theme.colors;
  const results = [];

  for (const [key, bgKeys, min = AA_TEXT] of UI_CHECKS) {
    if (EXEMPT[key]) continue;
    if (!colors[key]) {
      results.push({ label: key, on: bgKeys[0], ratio: null, min, missing: true });
      continue;
    }
    const missingBg = bgKeys.find((k) => !colors[k]);
    if (missingBg) {
      results.push({ label: key, on: missingBg, ratio: null, min, missing: true });
      continue;
    }
    const bg = flatten(bgKeys.map((k) => parseHex(colors[k])));
    const fg = composite(parseHex(colors[key]), bg);
    results.push({
      label: key,
      on: bgKeys[0],
      effective: toHex(fg),
      ratio: contrast(fg, bg),
      min,
    });
  }

  const surfaces = editorSurfaces(colors);
  for (const token of syntaxForegrounds(theme)) {
    for (const surface of surfaces) {
      const fg = composite(parseHex(token.color), surface.color);
      results.push({
        label: token.label,
        on: surface.name,
        effective: toHex(fg),
        ratio: contrast(fg, surface.color),
        min: AA_TEXT,
      });
    }
  }

  const failures = results.filter((r) => r.missing || r.ratio < r.min);
  const shown = verbose ? results : failures;

  if (shown.length) {
    const width = Math.max(...shown.map((r) => r.label.length));
    for (const r of shown) {
      const mark = r.missing ? '?' : r.ratio >= r.min ? 'ok' : 'FAIL';
      const ratio = r.missing ? 'undefined' : `${r.ratio.toFixed(2)}:1`;
      console.log(
        `${mark.padEnd(4)} ${r.label.padEnd(width)}  ${ratio.padStart(9)}  ` +
          `(min ${r.min.toFixed(1)}, on ${r.on}${r.effective ? `, effective ${r.effective}` : ''})`
      );
    }
    console.log('');
  }

  console.log(
    `${results.length} checks, ${failures.length} below threshold ` +
      `(AA text ${AA_TEXT}:1, AA non-text ${AA_NON_TEXT}:1)`
  );
  for (const [key, reason] of Object.entries(EXEMPT)) {
    console.log(`exempt: ${key} — ${reason}`);
  }

  process.exit(failures.length ? 1 : 0);
}

main();
