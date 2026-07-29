# Neon Pink Dark - VS Code Theme

**A cyberpunk-inspired dark theme with neon pink accents for Visual Studio Code**

> English | [日本語](README.ja.md)

Transform your VS Code into a futuristic cyberpunk environment with pure black backgrounds and vibrant neon pink highlights. Perfect for developers who want their editor to match the aesthetic of late-night coding sessions in a neon-lit cityscape.

![Theme Type](https://img.shields.io/badge/theme-dark-black?style=flat-square)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-pink?style=flat-square)

## ✨ Features

- 🎨 **Pure Black Background** - `#000000` gives the neon accents the highest possible contrast
- 💖 **Neon Pink Accents** - `#FF2DBE` as the primary color across the editor and workbench
- 🌃 **Cyberpunk / Future Neon** - Inspired by neon signs in nighttime cityscapes
- 🎯 **Layered Highlighting** - 55 TextMate rules plus semantic tokens: generic scopes that apply to every language, with dedicated rules for Markdown, HTML, CSS, JSON and YAML on top
- 🔧 **Customizable** - Easy to override colors through VS Code settings

> **Every surface is themed as of v0.3.0** — workbench UI, syntax, diagnostics, the diff editor and Git decorations — and every text color meets WCAG AA against the background it actually renders on. What's still missing is screenshots, the Soft and Dimmed variants and CI. See [Current Scope](#-current-scope) for what is covered, and the [Roadmap](#-roadmap) for what's next.

## 📊 Current Scope

| Area | Status |
|---|---|
| Editor background, foreground, cursor, selection, line numbers | ✅ Defined |
| Sidebar, status bar, activity bar, tabs, title bar, panel | ✅ Defined |
| Generic syntax scopes — 23 rules covering keywords, storage, operators, constants, variables, parameters, properties, functions, types, decorators, escapes, regex and `invalid` | ✅ Defined |
| Lists, trees, inputs, buttons, dropdowns, checkboxes, focus rings, text links | ✅ Defined |
| Command Palette, IntelliSense, hovers, peek view, notifications, menus, breadcrumbs, scrollbars | ✅ Defined |
| Terminal — all 16 ANSI slots, cursor, selection | ✅ Defined |
| Search / word highlights, bracket pair colors, overview ruler and minimap markers | ✅ Defined |
| Error / warning / info diagnostics, Problems panel, marker navigation | ✅ Defined |
| Diff editor, merge conflicts, the 3-way merge editor | ✅ Defined |
| Git decorations — Explorer labels, gutter, minimap, overview ruler | ✅ Defined |
| Language-specific scopes (HTML/JSX, CSS, Markdown, JSON, YAML, shell, regex) | ✅ Defined |
| Semantic highlighting (`readonly`, `defaultLibrary`, `deprecated` and the standard token types) | ✅ Enabled |

**Accessibility note.** Every text color in the theme meets WCAG AA (4.5:1) against the surface it actually renders on — not only pure black, but also the selection background and the current-line highlight, which raise the floor luminance and cost roughly 1.3× of the ratio. The tightest case is a keyword inside a selection at 4.7:1; on pure black the same keyword is 6.4:1, comments are 6.8:1, functions 7.7:1, strings 10.3:1 and body text 18.0:1.

`npm test` runs [`scripts/check-contrast.js`](scripts/check-contrast.js), which measures all 995 pairs — every syntax color against the twelve surfaces it can land on (editor, selection, current line, both sides of a diff at line and at word level, the three inline merge conflict regions and the 3-way merge editor), plus every workbench label against its own background — and fails if any drops below threshold. Colors carrying alpha are composited first, so the number is what reaches the eye rather than what the swatch suggests. Three decorations are exempt and say so in the output: whitespace markers, indent guides and the diff editor's diagonal fill are meant to stay faint.

## 📦 Installation

### From VS Code Marketplace (Recommended)

1. Open **Extensions** view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
2. Search for **"Neon Pink Dark"**
3. Click **Install**
4. Select theme (`Ctrl+K Ctrl+T` or `Cmd+K Cmd+T`)
5. Choose **"Neon Pink Dark"**

### From Command Line

```bash
code --install-extension kpab.neon-pink-dark
```

### Manual Installation (VSIX)

1. Download the latest `.vsix` file from [Releases](https://github.com/kpab/vscode-neon-pink-theme/releases)
2. Open VS Code
3. Run `Extensions: Install from VSIX...` from Command Palette
4. Select the downloaded file

### For Development

```bash
git clone https://github.com/kpab/vscode-neon-pink-theme.git
cd vscode-neon-pink-theme
code .
# Press F5 to launch Extension Development Host
```

## 🎨 Color Palette

Every value below is opaque, so the code is what the color measures as — no alpha is composited away.

| Element | Color Code | On black | Description |
|---------|-----------|---------|-------------|
| 🎯 Primary Accent | `#FF2DBE` | 6.4:1 | Neon pink (keywords, cursor, badges) |
| ⬛ Background | `#000000` | — | Pure black |
| 📝 Foreground | `#FFE6FF` | 18.0:1 | Light pink for regular text |
| 📜 Strings | `#FF8CF0` | 10.3:1 | Bright pink for string literals |
| 🔢 Numbers | `#FF55C3` | 7.3:1 | Vivid pink for numeric values |
| 💬 Comments | `#C77AAE` | 6.8:1 | Muted pink, italicized |
| 🔧 Functions | `#FF5EC4` | 7.7:1 | Medium pink for function names |
| 📦 Types | `#FF9AD6` | 10.9:1 | Light pink for type definitions |
| ⚙️ Operators | `#FFBEE8` | 13.8:1 | Pale pink for punctuation |
| #️⃣ Line numbers | `#B3689B` | 5.4:1 | Dim pink, one step below comments |

## 🖼️ Screenshots

> Screenshots coming soon

**Example code with Neon Pink Dark:**
- Keywords glow in vibrant neon pink
- Strings shimmer in bright pink tones
- Comments recede into a muted pink without dropping out of legibility
- The pure black background makes colors pop

## 🌐 Language Support

Syntax colors start from **generic TextMate scopes** rather than per-language rules. The same 23 rules apply to every language VS Code can tokenize, so JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, Ruby, PHP and the rest all get consistent coloring out of the box — and the same concept keeps the same shade across languages, so `if` is the same pink in Rust as it is in Python.

On top of that sit **language-specific rules** for the languages that markup and data files depend on:

- **Markdown** — headings step down the pink ramp h1–h6; bold, italic, strikethrough, blockquotes, inline code, fenced blocks, links, tables and thematic breaks are each distinct from body text
- **HTML / JSX** — tag names, attribute names and attribute values are three different colors
- **CSS / SCSS / LESS** — element, class, id and pseudo-class selectors are distinguished from each other, and property names from values; custom properties (`--var`) get their own color
- **JSON / YAML / TOML** — keys are distinguished from values
- **Shell / SQL / regex** — interpolation, character classes and anchors are colored separately

Coverage was checked by tokenizing sample files with the same TextMate grammars VS Code ships. What still falls back to the plain foreground is prose (HTML text nodes, Markdown paragraphs) and identifiers the grammars leave unscoped, such as SQL table and column names.

**Semantic highlighting** is enabled on top of both layers, so languages with a language server — TypeScript, Rust, C#, Java, Python — also get type-aware coloring: `const` reads differently from `let`, stdlib symbols are italic, and deprecated APIs are struck through. Semantic colors deliberately match their TextMate counterparts, so nothing changes color when the server finishes analysing the file.

## ⚙️ Customization

Override specific colors in your `settings.json`:

```json
{
  "workbench.colorCustomizations": {
    "[Neon Pink Dark]": {
      "editor.background": "#0a0005",
      "editorCursor.foreground": "#FF00FF"
    }
  },
  "editor.tokenColorCustomizations": {
    "[Neon Pink Dark]": {
      "comments": "#FF99E6",
      "strings": "#FFB3E6"
    }
  }
}
```

### Recommended Settings

For the best experience with this theme:

```json
{
  "editor.fontFamily": "'Fira Code', 'JetBrains Mono', Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "workbench.iconTheme": "material-icon-theme"
}
```

## 🎯 Design Philosophy

**Neon Pink Dark** is designed with these principles:

1. **Maximum Contrast**: Pure black (`#000000`) gives foreground colors the highest possible contrast ratio
2. **Consistent Color Language**: The same pink shade carries the same meaning in every language
3. **Aesthetic First**: The cyberpunk look is the point — but not at the cost of reading your own code
4. **Minimalist Approach**: A limited palette creates a cohesive, focused experience
5. **Meaning Outranks the Palette**: Where a color carries information rather than style, it is allowed outside the pink ramp

The fifth principle is a deliberate exception to the fourth, added in v0.3.0 along with the diff and Git colors. Added and removed lines cannot be the same hue, and neither can an error and a warning — at that point the color *is* the information, and a strictly pink palette would force you to read the text to learn what the color should already have told you. The exception is bounded to five hues, and each one was already in the theme through the bracket pair and ANSI palettes, so nothing new enters:

| Meaning | Hue | Also used by |
|---|---|---|
| Error, deletion | Coral `#FF4A5F` | `invalid.illegal`, unmatched brackets, ANSI red |
| Warning, conflict | Amber `#FFB05C` | ANSI yellow |
| Information | Cyan `#4DDDE8` | Escape sequences, regex character classes, ANSI cyan |
| Addition, untracked | Mint `#3FE0A0` / `#7DFFC6` | Regex literals, ANSI green, bracket level 6 |
| Modification | Violet `#C77DFF` | Decorators and macros, bracket level 3 |

Everything the editor says about your own code stays pink. Everything the editor says *about* the code — a diagnostic, a diff, a Git status — is allowed one of these five.

Where these conflict, readability wins. Comments used to be a semi-transparent pink that looked right and measured 3.6:1; they are now a solid `#C77AAE` at 6.8:1. The rule the theme follows from v0.3.0 on: nothing ships below 4.5:1 on the surface it actually renders on, and `npm test` is what enforces it.

## 🗺️ Roadmap

Tracked as [GitHub milestones](https://github.com/kpab/vscode-neon-pink-theme/milestones):

| Version | Focus |
|---|---|
| [v0.1.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/2) | Complete workbench UI coverage — no more fallbacks to the built-in dark theme |
| [v0.2.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/3) | Syntax depth — language-specific scopes and semantic highlighting |
| [v0.3.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/4) | Accessibility — error/warning/diff colors and WCAG AA contrast |
| [v0.4.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/5) | Soft and Dimmed variants for OLED and long sessions |
| [v1.0.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/6) | Screenshots, CI and release automation |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

- 🐛 Report bugs via [Issues](https://github.com/kpab/vscode-neon-pink-theme/issues)
- 💡 Suggest new features or improvements
- 🎨 Submit color refinements for specific languages
- 📖 Improve documentation
- 🌍 Add translations

### Development Workflow

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test with `F5` in VS Code, and run `npm test` if you touched any color
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by cyberpunk aesthetics and neon-lit cityscapes
- Color theory based on complementary pink/magenta palettes
- Community feedback and contributions

## 🔗 Links

- [GitHub Repository](https://github.com/kpab/vscode-neon-pink-theme)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=kpab.neon-pink-dark)
- [Report Issues](https://github.com/kpab/vscode-neon-pink-theme/issues)
- [Request Features](https://github.com/kpab/vscode-neon-pink-theme/issues/new)

## 🏷️ Keywords

`dark theme` `neon` `pink` `magenta` `cyberpunk` `black theme` `color theme` `syntax highlighting` `vscode theme` `futuristic` `neon lights` `developer tools` `code editor theme`

---

**If you enjoy this theme, please ⭐ star the repository and share it with other developers!**

**Enjoy coding in the neon! 💖✨**
