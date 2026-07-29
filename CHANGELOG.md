# Changelog

All notable changes to the "Neon Pink Dark" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-07-29

### Added
- **Neon Pink Dark Soft** — background `#12000A`, saturation 80%. For OLED panels, where fully saturated magenta on `#000000` smears while scrolling because the pixels switch fully off and back on, and for anyone who finds the pure-black edge harsh ([#12])
- **Neon Pink Dimmed** — background `#0D0008`, saturation 60%. For long sessions, bright rooms, and eyes that full saturation tires out ([#12])
- `scripts/build-themes.js`, run by `npm run build`. It generates both variants from the base theme and commits the result, so the extension stays dependency-free at install time and three copies of an 837-line palette cannot drift apart ([#12])
- A staleness check. `npm test` now runs `build-themes.js --check` first and fails if a generated file differs from what the base theme would produce, so a color change that skips the rebuild cannot be committed unnoticed ([#12])

### Changed
- `scripts/check-contrast.js` measures every theme in `contributes.themes` rather than only the base one, reading the list from `package.json`. 995 pairs per theme, 2985 in total, all passing. The tightest case is the accent inside a diff or a selection: 4.63:1 in the base theme, 4.58:1 in Soft, 4.57:1 in Dimmed ([#12])

### Notes on the generation approach ([#12])
- The base theme is the only hand-maintained one. Making all three generated from a separate palette definition was the alternative, and it would have meant rewriting a theme that is already correct and already measured — the variants are derived *from* the shipped theme instead, so the shipped theme stays the thing that gets reviewed
- Desaturation is done at constant relative luminance: each color is pulled toward the gray of its own HSL lightness, then scaled back to the luminance it started with. Contrast is a function of luminance alone, so this step provably cannot cost a ratio. A plain HSL desaturation does — it pulls the accent's red channel down from 255 and takes about 7% of its luminance with it
- The first version of the transform did exactly that, and the contrast check caught it: the `#FF2DBE` accent landed at 4.22:1 inside a selection in Soft and 4.28:1 in Dimmed, against a 4.5:1 floor. The base theme has 4.74:1 there, so there was never enough headroom to spend
- The background lift fades out at HSL lightness 0.35. Below it a color is a surface and gets the variant's base tint; above it a color is a foreground and instead gains back the luminance the lifted editor background took away — about 3%, which is invisible but keeps a token at the ratio it had on black. The base theme's surface ramp tops out at L 0.24 and its darkest foreground sits at L 0.55, so the boundary has room on both sides
- What the derivation cannot fully hold is the surfaces that lift *more* than the editor background — a selection, a changed word in a diff. Those end up a few hundredths lower, which is why every variant is measured in full rather than trusted because it was generated
- Fully transparent slots (`minimap.background`, `tab.activeBorder`) are passed through untouched. Lifting a color nobody can see only makes the generated diff noisier

### Notes on what is not here ([#12])
- **No light variant.** Neon pink on white is a different design problem, not a fourth intensity: the accents have to become darker rather than calmer, and the five-hue palette exception from v0.3.0 would need re-deriving against a light floor. Bundling it with a desaturation pass would have meant shipping it under-considered
- The variants are registered as three separate entries in `contributes.themes`, so a `workbench.colorCustomizations` block scoped to `[Neon Pink Dark]` does not apply to the other two. The README says so, with the syntax for covering all three

## [0.3.0] - 2026-07-29

### Added
- Diagnostic colors — `editorError`, `editorWarning`, `editorInfo` and `editorHint` foregrounds and backgrounds, the three Problems panel icons, and the marker navigation widget. Error, warning and info are coral `#FF4A5F`, amber `#FFB05C` and cyan `#4DDDE8`, so a squiggle says which kind it is before you read the message ([#10])
- Diff editor colors — inserted and removed backgrounds at both line and word level, word-level borders, the gutter, the overview strip, the diagonal fill and the collapsed unchanged-region surface ([#10])
- Merge conflict colors — current, incoming and common-ancestor headers and content, their overview ruler marks, and the 3-way merge editor's change and conflict-state borders ([#10])
- Git decoration colors — added `#3FE0A0`, modified `#C77DFF`, deleted `#FF4A5F`, untracked `#7DFFC6`, conflicting `#FFB05C`, ignored `#A8628F`, plus the staged variants and submodules. All eight are mutually distinguishable and all clear 4.5:1 ([#10])
- Git gutter and minimap gutter marks, and `minimap.warningHighlight` ([#10])
- `inputValidation` warning and info surfaces, which previously only existed for errors ([#10])
- `scripts/check-contrast.js`, run by `npm test`. It measures 299 pairs — every `tokenColors` and `semanticTokenColors` foreground against three editor surfaces, plus every workbench label against its own background — composites alpha before measuring, and exits non-zero on anything below threshold ([#11])

### Changed
- The error color is now coral `#FF4A5F` everywhere. `list.errorForeground`, `inputValidation.errorBorder` and `notificationsErrorIcon.foreground` were a second red, `#FF6B8A`, while `invalid.illegal`, unmatched brackets, ANSI red and the minimap error mark were already coral ([#10])
- `notificationsInfoIcon.foreground` `#FF66D9` → cyan `#4DDDE8`, matching the new info squiggle. A pink info icon on a pink theme reads as decoration ([#10])
- `editorOverviewRuler.addedForeground` `#7DFFC6CC` → `#3FE0A0CC`, so the ruler mark and the gutter mark for an added line are the same green. `#7DFFC6` now means untracked ([#10])
- Comments are now a solid `#C77AAE` instead of `#FF66CAA3`. At 64% opacity the color that actually reached the eye was `#A34181`, which measures 3.6:1 on black and 2.9:1 inside a selection ([#11])
- `editorLineNumber.foreground` `#FF66CCAA` → `#B3689B`, 3.9:1 → 5.4:1. Also solid, for the same reason ([#11])
- `tab.inactiveForeground` `#82456A` → `#A8628F`, 3.0:1 → 4.8:1. It now matches the inactive title bar, activity bar and panel titles, which were already at that value ([#11])
- `editor.selectionBackground` `#660033` → `#4D0026`. The selection raises the floor luminance for everything sitting on it, and at `#660033` the darkest token — the `#FF2DBE` keyword — measured 4.0:1 inside a selection. It is now 4.7:1 ([#11])

### Notes on the palette exception ([#10])
- Five hues are now allowed outside the pink ramp — coral, amber, cyan, mint and violet — and only where the color carries information rather than style: a diagnostic, a diff, a Git status. Every one of them was already in the theme through the bracket pair and ANSI palettes, so no new color enters. The rule is written up in the README's Design Philosophy section
- The word-level diff highlight is `1F` alpha rather than `26`. Stacked on the `14` line highlight, `26` put the `#FF2DBE` keyword — the darkest token in the theme — at 4.3:1 on an inserted word. At `1F` it is 4.6:1. `mergeEditor.change.*` uses the same two values for the same reason
- `editorError.border`, `editorWarning.border` and `editorInfo.border` are left unset. A border draws a box around every squiggle, and the squiggle already says everything the box would. The diff editor's word-level borders *are* set, because there the border is the only thing marking where a changed word starts and ends

### Notes on the contrast work ([#11])
- The whole palette is now free of alpha in any foreground position. The three colors that failed were the three that carried alpha, and the README color table had been listing the declared value, not the composited one
- `editor.selectionForeground` was considered and rejected. It would have fixed the selection cases in one key, but it overrides every token color inside the selection, so selecting a block would have flattened it to a single color
- Whitespace markers and indent guides are exempt from the check, and the script prints why. A guide that meets 3:1 stops being a guide

## [0.2.0] - 2026-07-29

### Added
- 15 more generic TextMate scopes, taking `tokenColors` from 8 rules to 23 ([#7])
- `keyword.control`, `storage` and `keyword.operator` are now three colors instead of one — `#FF2DBE`, `#FF5AD0` and `#FF7ADB` — so `if`, `class` and `=>` no longer look alike ([#7])
- `constant.language`, `variable.other.constant` and `support.constant` on the number color `#FF55C3`. `true`, `null` and `MAX_RETRIES` were rendering as plain foreground ([#7])
- `variable.parameter` split from `variable` as `#FFC2F0` italic, and property access given its own `#FF89D6` ([#7])
- `invalid.illegal` on coral `#FF4A5F`. Genuine syntax errors previously carried no color signal at all ([#7])
- `constant.character.escape` on cyan `#4DDDE8` and `string.regexp` on mint `#7DFFC6` ([#7])
- Decorators on violet `#C77DFF`, covering `@decorator` and Rust's `#[derive]` ([#7])
- Language-specific scopes for HTML, CSS, Markdown, JSON, YAML, shell and regex — 32 rules, taking `tokenColors` from 23 to 55. The theme previously had none at all ([#8])
- HTML tag names `#FF2DBE`, attribute names `#FF5EC4` and attribute values `#FF8CF0` — three distinguishable colors where there was one ([#8])
- CSS selectors by kind — element `#FF5AD0`, class `#FF5EC4`, id `#FF2DBE`, pseudo-class and pseudo-element `#FF7ADB` — plus property names `#FF9AD6` against values `#FF55C3`, and custom properties on `#FF7ADB` ([#8])
- Markdown headings stepping down the pink ramp h1–h6, plus bold, italic, strikethrough, blockquotes, inline code, fenced blocks, links, tables and thematic breaks. A Markdown file was previously a wall of `#FFE6FF` ([#8])
- JSON, YAML and TOML keys on `#FF9AD6`, distinct from `#FF8CF0` values ([#8])
- Regex character classes on the escape-sequence cyan `#4DDDE8` and anchors on `#FF2DBE` ([#8])
- `"semanticHighlighting": true` and `semanticTokenColors` for the standard token types. TypeScript, Rust, C#, Java and Python can now color a local, a parameter and a property differently even where the grammar cannot tell them apart ([#9])
- `variable.readonly` and `property.readonly` on the constant color `#FF55C3`, which makes `const` and `let` distinguishable at a glance ([#9])
- `*.deprecated` renders with strikethrough. It previously had no signal at all ([#9])
- `*.defaultLibrary` renders italic, separating stdlib symbols from user code ([#9])

### Changed
- Rust macros (`entity.name.function.macro`) moved from the function color to the decorator violet `#C77DFF`. A macro generates code rather than calling it, and the semantic `macro` type is violet — leaving them apart would have made `println!` change color on file open ([#9])

### Notes on the accent colors ([#7])
- Three scopes take a hue outside the pink ramp. Escape sequences, regex literals and syntax errors are all cases where "this is not ordinary code" is the message, and a ramp position cannot carry that. The hues are the ones already used by the bracket pair and ANSI palettes, so no new color enters the theme
- `punctuation.definition.tag` and similar structural punctuation keep inheriting `#FFBEE8` rather than taking the color of what they delimit — matching them to the tag name makes dense markup harder to scan

### Notes on the Markdown rules ([#8])
- Heading levels need descendant selectors (`heading.2 entity.name.section`). The grammar puts `heading.N.markdown` outside `entity.name.section.markdown`, so a flat selector loses to the inner scope
- List bullets are scoped to `punctuation.definition.list`, not `markup.list`. `markup.list` wraps the entire block, so colouring it turns every list item body neon pink

### Notes on semantic highlighting ([#9])
- Every semantic color matches what the same symbol resolves to in the TextMate layer, so nothing changes color when the language server answers a few hundred milliseconds after a file opens
- `defaultLibrary` is italic rather than a separate color for that reason. The TextMate layer colors `support.*` by kind rather than by origin, so a distinct stdlib color could not both separate stdlib and avoid the flicker
- `declaration`, `definition`, `static`, `async`, `modification` and `documentation` are left to inherit. Stacking three or four styles on one identifier reads as noise rather than information

## [0.1.0] - 2026-07-29

### Added
- List and tree colors — active/inactive selection, hover, focus, focus outline, match highlight, error/warning foreground and indent guides. The Explorer no longer shows Dark+'s blue `#04395E` selection ([#3])
- Input colors — `input.*`, `inputOption.active*`, `inputValidation.error*`, `dropdown.*` and `checkbox.*` ([#3])
- Button colors — primary, secondary and their hover states ([#3])
- Text link colors — `textLink.foreground` / `.activeForeground` ([#3])
- `badge.foreground`, which was inheriting Dark+'s white and rendering at 3.3:1 on the neon pink badge background ([#3])
- Overlay widget colors — Command Palette, IntelliSense, hover widget, peek view, menus, menu bar and notifications, all on a raised `#14000C` surface with a `#4D002E` border ([#4])
- Editor chrome colors — tab strip and tab borders, title bar (active and inactive), status bar borders and states, activity bar, side bar section headers, panel titles, scrollbar slider, indent guides, rulers, whitespace, gutter and breadcrumbs ([#4])
- `statusBar.debuggingBackground` `#7A0049` and `noFolderBackground` `#4D002E`, replacing Dark+'s orange and purple. Both stay in the palette while reading as distinctly different from the normal status bar ([#4])
- All 16 terminal ANSI slots plus `terminal.background`/`.foreground`/`.border`, cursor and selection ([#5])
- Search, selection and word highlights, including a solid `#B3006B` current-match fill so `Cmd+F` hits stay visible inside a selection ([#6])
- Six bracket pair colors, `unexpectedBracket.foreground` and `editorBracketMatch.*`, replacing Dark+'s gold/purple/blue ([#6])
- Overview ruler and minimap markers, including the minimap slider ([#6])

### Changed
- `focusBorder` is now solid `#FF2DBE` instead of `#FF2DBE66`. At 40% alpha over pure black the focus ring was barely visible ([#3])

### Notes on the ANSI palette ([#5])
- ANSI slots keep their hue identity rather than being mapped onto pink, because `git diff`, test runners and linters depend on red/green/yellow being readable as red/green/yellow. Hues are pulled toward the theme's high-saturation, magenta-leaning character instead
- Pure `#FF2DBE` is reserved for `ansiMagenta`; `ansiBrightRed` is a coral `#FF7A70` rather than a pink red so that it does not collide with `ansiBrightMagenta`
- 15 of the 16 slots clear 4.5:1 against `terminal.background`. `ansiBlack` is the exception at 1.05:1 — a black slot that met 4.5:1 would no longer be black, and CLI tools use it as a background and as dim text. `ansiBrightBlack`, which is what tools actually use for dim *foreground* text, sits at 4.8:1

## [0.0.2] - 2026-07-29

### Fixed
- Removed `contrastBorder`. It is a High Contrast theme key that draws a border around every workbench element, and its alpha channel was silently ignored, so `#FF2DBE33` rendered as fully opaque `#FF2DBE` ([#2])
- Replaced it with the specific border keys it was standing in for: `focusBorder`, `editorGroup.border`, `sideBar.border`, `widget.border` ([#2])
- Excluded `.claude/` from the published package — local editor settings were being shipped inside the VSIX

### Changed
- Corrected the coverage claims in `README.md`, `README.ja.md` and this changelog to match what the theme actually defines ([#1])
- Added a "Current Scope" table to both READMEs listing which surfaces are themed and which still fall back to VS Code's built-in dark theme ([#1])
- Added measured WCAG contrast ratios and a roadmap section to both READMEs ([#1])

## [0.0.1] - 2025-11-16

> **Note:** this entry originally overstated what the release contained — it claimed comprehensive UI coverage and per-language syntax optimization, neither of which shipped. It was corrected in 0.0.2 ([#1]). The list below reflects what 0.0.1 actually included.

### Added
- Initial release of Neon Pink Dark theme
- Pure black background (`#000000`) with neon pink accents
- 25 workbench color keys covering the editor, sidebar, status bar, activity bar, tabs, title bar and panel
- 8 generic syntax highlighting rules — keyword/storage, string, variable/parameter, number, function, type, comment, punctuation — applied uniformly across all languages, with no language-specific scopes
- Main accent color: Neon Pink (#FF2DBE)
- Cyberpunk-inspired aesthetic
- Semi-transparent italic comments
- Documentation in English and Japanese

### Design Highlights
- Keywords: Vibrant neon pink (#FF2DBE)
- Strings: Bright pink (#FF8CF0)
- Comments: Semi-transparent pink (#FF66CAA3) with italic styling
- Functions: Medium pink (#FF5EC4)
- Types: Light pink (#FF9AD6)
- Numbers: Vivid pink (#FF55C3)

[Unreleased]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/kpab/vscode-neon-pink-theme/releases/tag/v0.0.1

[#1]: https://github.com/kpab/vscode-neon-pink-theme/issues/1
[#2]: https://github.com/kpab/vscode-neon-pink-theme/issues/2
[#3]: https://github.com/kpab/vscode-neon-pink-theme/issues/3
[#4]: https://github.com/kpab/vscode-neon-pink-theme/issues/4
[#5]: https://github.com/kpab/vscode-neon-pink-theme/issues/5
[#6]: https://github.com/kpab/vscode-neon-pink-theme/issues/6
[#7]: https://github.com/kpab/vscode-neon-pink-theme/issues/7
[#8]: https://github.com/kpab/vscode-neon-pink-theme/issues/8
[#9]: https://github.com/kpab/vscode-neon-pink-theme/issues/9
[#10]: https://github.com/kpab/vscode-neon-pink-theme/issues/10
[#11]: https://github.com/kpab/vscode-neon-pink-theme/issues/11
[#12]: https://github.com/kpab/vscode-neon-pink-theme/issues/12
