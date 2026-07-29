#!/usr/bin/env node
'use strict';

/**
 * Prints the CHANGELOG section for one version, for use as a GitHub Release
 * body.
 *
 * The release workflow could paste the whole changelog into every release, or
 * nothing at all. Neither is useful on the Releases page, and hand-copying the
 * right section is exactly the manual step the release workflow exists to
 * remove. This reads `## [x.y.z]` and stops at the next `## ` heading.
 *
 * The reference-style link definitions at the bottom of the changelog
 * (`[#12]: https://...`) are collected too, and only the ones the extracted
 * section actually uses are appended — an issue reference renders as literal
 * `[#12]` without them.
 *
 * Usage:
 *   node scripts/extract-changelog.js 1.0.0
 *   node scripts/extract-changelog.js          # version from package.json
 *
 * Exits non-zero if that version has no section, so a release cannot be
 * published with an empty body by accident.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function main() {
  const version = process.argv[2]
    || JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;

  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  const lines = changelog.split('\n');

  const heading = new RegExp(`^##\\s+\\[?${version.replace(/\./g, '\\.')}\\]?(\\s|$)`);
  const start = lines.findIndex((line) => heading.test(line));
  if (start === -1) {
    console.error(`CHANGELOG.md has no section for ${version}.`);
    console.error('Add one before tagging — the release body is generated from it.');
    process.exit(1);
  }

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) { end = i; break; }
  }

  const body = lines.slice(start + 1, end).join('\n').trim();
  if (!body) {
    console.error(`CHANGELOG.md's section for ${version} is empty.`);
    process.exit(1);
  }

  // Reference-style definitions live at the bottom of the file, outside the
  // section that uses them.
  const definitions = new Map();
  for (const m of changelog.matchAll(/^\[([^\]]+)\]:\s*(\S+)\s*$/gm)) {
    definitions.set(m[1], m[2]);
  }
  const used = [];
  for (const [label, url] of definitions) {
    const reference = new RegExp(`\\[${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\](?!:)`);
    if (reference.test(body)) used.push(`[${label}]: ${url}`);
  }

  process.stdout.write(body + (used.length ? `\n\n${used.join('\n')}` : '') + '\n');
}

main();
