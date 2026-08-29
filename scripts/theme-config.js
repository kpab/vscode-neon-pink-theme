'use strict';

/**
 * Theme roles shared by generation and contrast auditing.
 * package.json remains the public registration list; build-themes.js checks
 * that every registered theme has exactly one role here.
 */
const BASE_THEME = {
  label: 'Neon Pink Dark',
  file: 'neon-pink-dark-color-theme.json',
};

const GENERATED_VARIANTS = [
  {
    label: 'Neon Pink Dark Soft',
    file: 'neon-pink-dark-soft-color-theme.json',
    saturation: 0.8,
    base: '#12000A',
  },
  {
    label: 'Neon Pink Dimmed',
    file: 'neon-pink-dimmed-color-theme.json',
    saturation: 0.6,
    base: '#0D0008',
  },
];

const FROZEN_THEMES = [
  {
    label: 'Neon Pink Dark Classic',
    file: 'neon-pink-dark-classic-color-theme.json',
    // Update only after reviewing an intentional change to the frozen file.
    sha256: 'b905c696c7a8f4d5cf47bf243ffa1b0d262313723eceac8e701815124eebdca4',
    reason:
      'the corrected 0.0.1 palette snapshot — bringing it up to AA would erase the look it preserves',
    // Pairs this theme is known to fail: the line number, an inactive tab, a
    // keyword inside a selection, and comments on three editor surfaces. The
    // file is hash-pinned, so the number moves only when check-contrast.js
    // changes — which is exactly when it should be looked at again. Keys the
    // theme leaves to VS Code's defaults are not counted here.
    expectedFailures: 6,
  },
];

module.exports = { BASE_THEME, GENERATED_VARIANTS, FROZEN_THEMES };
