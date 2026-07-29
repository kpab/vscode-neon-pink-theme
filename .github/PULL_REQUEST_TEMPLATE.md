<!--
Only `themes/neon-pink-dark-color-theme.json` is edited by hand. The Soft and
Dimmed variants are generated from it by `npm run build`, and CI fails if they
were not rebuilt.
-->

## What

<!-- One or two sentences. Which colors, which part of the UI or syntax. -->

## Why

<!--
For a color change: what was hard to read or hard to tell apart at the old
value. Contrast numbers if the change is about readability — `npm test` prints
them.
-->

Closes #

## Checks

- [ ] `npm test` passes — structure, generated variants up to date, every pair above WCAG AA
- [ ] Base theme edited by hand, variants regenerated with `npm run build` (not edited directly)
- [ ] New colors are on the pink ramp, or are one of the five information hues used for information
- [ ] CHANGELOG.md updated under `## [Unreleased]`
- [ ] README.md and README.ja.md updated together, if either changed
