# Changelog

All notable changes to the "Neon Pink Dark" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Notes on the accent colors ([#7])
- Three scopes take a hue outside the pink ramp. Escape sequences, regex literals and syntax errors are all cases where "this is not ordinary code" is the message, and a ramp position cannot carry that. The hues are the ones already used by the bracket pair and ANSI palettes, so no new color enters the theme
- `punctuation.definition.tag` and similar structural punctuation keep inheriting `#FFBEE8` rather than taking the color of what they delimit — matching them to the tag name makes dense markup harder to scan

### Notes on the Markdown rules ([#8])
- Heading levels need descendant selectors (`heading.2 entity.name.section`). The grammar puts `heading.N.markdown` outside `entity.name.section.markdown`, so a flat selector loses to the inner scope
- List bullets are scoped to `punctuation.definition.list`, not `markup.list`. `markup.list` wraps the entire block, so colouring it turns every list item body neon pink

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

[Unreleased]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.1.0...HEAD
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
