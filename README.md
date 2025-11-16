# Neon Pink Dark - VS Code Theme

**A cyberpunk-inspired dark theme with neon pink accents for Visual Studio Code**

> English | [日本語](README.ja.md)

Transform your VS Code into a futuristic cyberpunk environment with pure black backgrounds and vibrant neon pink highlights. Perfect for developers who want their editor to match the aesthetic of late-night coding sessions in a neon-lit cityscape.

![Theme Type](https://img.shields.io/badge/theme-dark-black?style=flat-square)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-pink?style=flat-square)

## ✨ Features

- 🎨 **Pure Black Background** - Maximizes neon color contrast and reduces eye strain in dark environments
- 💖 **Neon Pink Accents** - Vibrant #FF2DBE primary color for a true cyberpunk aesthetic
- 🌃 **Cyberpunk / Future Neon** - Inspired by neon signs in nighttime cityscapes
- 👁️ **Eye-Friendly Design** - Carefully balanced pink-to-purple gradient reduces eye fatigue
- ⚡ **High Contrast** - Maintains excellent code readability while looking stylish
- 🎯 **Multi-Language Support** - Optimized syntax highlighting for JavaScript, Python, Go, Rust, and more
- 🔧 **Customizable** - Easy to override colors through VS Code settings

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

| Element | Color Code | Description |
|---------|-----------|-------------|
| 🎯 Primary Accent | `#FF2DBE` | Neon pink (keywords, cursor, badges) |
| ⬛ Background | `#000000` | Pure black |
| 📝 Foreground | `#FFE6FF` | Light pink for regular text |
| 📜 Strings | `#FF8CF0` | Bright pink for string literals |
| 🔢 Numbers | `#FF55C3` | Vivid pink for numeric values |
| 💬 Comments | `#FF66CAA3` | Semi-transparent pink, italicized |
| 🔧 Functions | `#FF5EC4` | Medium pink for function names |
| 📦 Types | `#FF9AD6` | Light pink for type definitions |
| ⚙️ Operators | `#FFBEE8` | Pale pink for punctuation |

## 🖼️ Screenshots

> Screenshots coming soon

**Example code with Neon Pink Dark:**
- Keywords glow in vibrant neon pink
- Strings shimmer in bright pink tones
- Comments fade with subtle transparency
- The pure black background makes colors pop

## 🌐 Language Support

Syntax highlighting optimized for:

**Web Development**
- JavaScript / TypeScript / JSX / TSX
- HTML / CSS / SCSS / LESS
- Vue / React / Svelte

**Backend & Systems**
- Python
- Go
- Rust
- Java / Kotlin
- C / C++ / C#
- PHP / Ruby

**Data & Config**
- JSON / YAML / TOML / XML
- Markdown
- SQL
- Shell scripts

And many more!

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

1. **Maximum Contrast**: Pure black (#000000) background provides the highest possible contrast
2. **Consistent Color Language**: Pink shades indicate semantic meaning across all languages
3. **Reduced Eye Strain**: Semi-transparent comments and balanced brightness levels
4. **Aesthetic First**: While maintaining readability, we prioritize the cyberpunk aesthetic
5. **Minimalist Approach**: Limited color palette creates a cohesive, focused experience

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
4. Test with `F5` in VS Code
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
