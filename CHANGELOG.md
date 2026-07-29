# Changelog

All notable changes to the "Neon Pink Dark" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- List and tree colors — active/inactive selection, hover, focus, focus outline, match highlight, error/warning foreground and indent guides. The Explorer no longer shows Dark+'s blue `#04395E` selection ([#3])
- Input colors — `input.*`, `inputOption.active*`, `inputValidation.error*`, `dropdown.*` and `checkbox.*` ([#3])
- Button colors — primary, secondary and their hover states ([#3])
- Text link colors — `textLink.foreground` / `.activeForeground` ([#3])
- `badge.foreground`, which was inheriting Dark+'s white and rendering at 3.3:1 on the neon pink badge background ([#3])

### Changed
- `focusBorder` is now solid `#FF2DBE` instead of `#FF2DBE66`. At 40% alpha over pure black the focus ring was barely visible ([#3])

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

[Unreleased]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/kpab/vscode-neon-pink-theme/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/kpab/vscode-neon-pink-theme/releases/tag/v0.0.1

[#1]: https://github.com/kpab/vscode-neon-pink-theme/issues/1
[#2]: https://github.com/kpab/vscode-neon-pink-theme/issues/2
[#3]: https://github.com/kpab/vscode-neon-pink-theme/issues/3
