# Neon Pink Dark Theme

**Cyberpunk スタイルの VS Code ダークテーマ**

> [English](README.md) | 日本語

ブラック背景に蛍光ピンクが映えるネオン系カラースキーム。夜の街のネオンサインをイメージした未来的なテーマです。

![Theme Type](https://img.shields.io/badge/theme-dark-black?style=flat-square)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80.0-blue?style=flat-square)

## ✨ 特徴

- 🎨 **完全なブラック背景** - ネオンカラーを最大限に強調
- 💖 **蛍光ピンクアクセント** - メインカラー #FF2DBE でサイバーパンクな雰囲気
- 🌃 **Cyberpunk / Future Neon** - 夜の街のネオンサインをイメージ
- 👁️ **目に優しい配色** - 暗いピンク〜パープルで適度なコントラスト
- ⚡ **高いコントラスト** - コード可読性を保ちながらスタイリッシュに
- 🎯 **多言語対応** - JavaScript, Python, Go, Rust など主要言語を最適化

## 📦 インストール方法

### VS Code Marketplace から（推奨）

1. VS Code を開く
2. 拡張機能ビュー（`Ctrl+Shift+X` / `Cmd+Shift+X`）を開く
3. "Neon Pink Dark" を検索
4. "Install" をクリック
5. カラーテーマを選択（`Ctrl+K Ctrl+T` / `Cmd+K Cmd+T`）

### コマンドラインから

```bash
code --install-extension kpab.neon-pink-dark
```

### ローカルでテスト（開発者向け）

```bash
git clone https://github.com/kpab/vscode-neon-pink-theme.git
cd vscode-neon-pink-theme
code .
# F5 キーを押して Extension Development Host を起動
```

## 🎨 カラーパレット

| 用途 | カラーコード | 説明 |
|------|-------------|------|
| 🎯 メインアクセント | `#FF2DBE` | 蛍光ピンク（キーワード、カーソル） |
| ⬛ 背景 | `#000000` | 完全なブラック |
| 📝 通常テキスト | `#FFE6FF` | 薄いピンク |
| 📜 文字列 | `#FF8CF0` | 明るいピンク |
| 🔢 数値 | `#FF55C3` | ビビッドピンク |
| 💬 コメント | `#FF66CAA3` | 半透明ピンク（イタリック） |
| 🔧 関数 | `#FF5EC4` | ミディアムピンク |
| 📦 型定義 | `#FF9AD6` | ライトピンク |

## 📸 スクリーンショット

> スクリーンショットは近日公開予定

## 🌐 対応言語

シンタックスハイライトは以下の言語で最適化されています：

- JavaScript / TypeScript
- Python
- Java / Kotlin
- C / C++ / C#
- Go
- Rust
- Ruby
- PHP
- HTML / CSS / SCSS
- JSON / YAML / TOML
- Markdown
- その他多数

## ⚙️ カスタマイズ

`settings.json` でテーマの一部を上書きできます：

```json
{
  "workbench.colorCustomizations": {
    "[Neon Pink Dark]": {
      "editor.background": "#0a0005"
    }
  },
  "editor.tokenColorCustomizations": {
    "[Neon Pink Dark]": {
      "comments": "#FF99E6"
    }
  }
}
```

## 🤝 コントリビューション

Issue や Pull Request を歓迎します！

1. このリポジトリをフォーク
2. Feature ブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. Pull Request を作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください。

## 🔗 リンク

- [GitHub リポジトリ](https://github.com/kpab/vscode-neon-pink-theme)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=kpab.neon-pink-dark)
- [Issue トラッカー](https://github.com/kpab/vscode-neon-pink-theme/issues)

---

**Enjoy coding in the neon! 💖✨**
