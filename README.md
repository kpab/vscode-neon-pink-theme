# Neon Pink Dark Theme

**Cyberpunk スタイルの VS Code ダークテーマ**

ブラック背景に蛍光ピンクが映えるネオン系カラースキーム。夜の街のネオンサインをイメージした未来的なテーマです。

![Theme Type](https://img.shields.io/badge/theme-dark-black?style=flat-square)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80.0-blue?style=flat-square)

## 特徴

- 🎨 **完全なブラック背景** - ネオンカラーを最大限に強調
- 💖 **蛍光ピンクアクセント** - メインカラー #FF2DBE
- 🌃 **Cyberpunk / Future Neon** - 夜の街のネオンをイメージ
- 👁️ **目に優しい配色** - 暗いピンク〜パープルで適度なコントラスト

## インストール方法

### 方法1: ローカルでテスト（開発中）

1. このリポジトリをクローン:
   ```bash
   git clone https://github.com/kpab/vscode-neon-pink-theme.git
   cd vscode-neon-pink-theme
   ```

2. VS Code でこのフォルダを開く:
   ```bash
   code .
   ```

3. `F5` キーを押して **Extension Development Host** を起動

4. 新しく開いた VS Code ウィンドウで:
   - `Ctrl+K Ctrl+T` (macOS: `Cmd+K Cmd+T`)
   - または Command Palette (`Ctrl+Shift+P`) → `Preferences: Color Theme`
   - リストから **"Neon Pink Dark"** を選択

### 方法2: VSIX パッケージからインストール

1. パッケージをビルド:
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

2. 生成された `.vsix` ファイルをインストール:
   - VS Code で `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
   - または: `code --install-extension neon-pink-dark-0.0.1.vsix`

3. テーマを選択:
   - `Ctrl+K Ctrl+T` → **"Neon Pink Dark"** を選択

### 方法3: Marketplace から（公開後）

VS Code の拡張機能マーケットプレイスで "Neon Pink Dark" を検索してインストール

## カラーパレット

| 用途 | カラーコード | プレビュー |
|------|-------------|-----------|
| メインアクセント | `#FF2DBE` | ![#FF2DBE](https://via.placeholder.com/50x20/FF2DBE/FF2DBE) |
| 背景 | `#000000` | ![#000000](https://via.placeholder.com/50x20/000000/000000) |
| 通常テキスト | `#FFE6FF` | ![#FFE6FF](https://via.placeholder.com/50x20/FFE6FF/FFE6FF) |
| キーワード | `#FF2DBE` | ![#FF2DBE](https://via.placeholder.com/50x20/FF2DBE/FF2DBE) |
| 文字列 | `#FF8CF0` | ![#FF8CF0](https://via.placeholder.com/50x20/FF8CF0/FF8CF0) |
| コメント | `#FF66CAA3` | ![#FF66CAA3](https://via.placeholder.com/50x20/FF66CAA3/FF66CAA3) |

## スクリーンショット

（TODO: テーマ適用後のスクリーンショットを追加）

## 対応言語

シンタックスハイライトは以下の言語で最適化されています:
- JavaScript / TypeScript
- Python
- Java
- C / C++ / C#
- Go
- Rust
- HTML / CSS
- JSON / YAML
- その他多数

## 開発

```bash
# 依存関係のインストール
npm install

# パッケージング
vsce package

# 公開（要: Azure DevOps PAT）
vsce publish
```

## ライセンス

MIT License

## フィードバック

Issue や Pull Request をお待ちしています！

---

**Enjoy coding in the neon! 💖✨**
