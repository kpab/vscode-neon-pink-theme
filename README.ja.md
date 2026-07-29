# Neon Pink Dark Theme

**Cyberpunk スタイルの VS Code ダークテーマ**

> [English](README.md) | 日本語

ブラック背景に蛍光ピンクが映えるネオン系カラースキーム。夜の街のネオンサインをイメージした未来的なテーマです。

![Theme Type](https://img.shields.io/badge/theme-dark-black?style=flat-square)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80.0-blue?style=flat-square)

## ✨ 特徴

- 🎨 **完全なブラック背景** - `#000000` がネオンカラーを最大限に引き立てます
- 💖 **蛍光ピンクアクセント** - メインカラー `#FF2DBE` をエディタと UI 全体に適用
- 🌃 **Cyberpunk / Future Neon** - 夜の街のネオンサインをイメージ
- 🎯 **言語非依存のハイライト** - キーワード・文字列・数値・関数・型・コメントの汎用スコープを、すべての言語に同じルールで適用
- 🔧 **カスタマイズ可能** - VS Code の設定から個別に色を上書きできます

> **このテーマはまだ初期段階（`0.0.x`）です。** 現時点では色の定義範囲を絞っており、テーマが定義していない部分は VS Code 標準のダークテーマの色にフォールバックします。カバー範囲は[対応状況](#-対応状況)を、今後の予定は[ロードマップ](#-ロードマップ)をご覧ください。

## 📊 対応状況

| 対象 | 状態 |
|---|---|
| エディタの背景・前景・カーソル・選択範囲・行番号 | ✅ 定義済み |
| サイドバー・ステータスバー・アクティビティバー・タブ・タイトルバー・パネル | ✅ 定義済み |
| 汎用シンタックススコープ（キーワード、文字列、変数、数値、関数、型、コメント、記号） | ✅ 定義済み |
| リスト・ツリー・入力欄・ボタン・ドロップダウン・チェックボックス・フォーカスリング・テキストリンク | ✅ 定義済み |
| コマンドパレット・IntelliSense・通知・メニュー | ⬜ フォールバック |
| ターミナルの ANSI カラー | ⬜ フォールバック |
| エラー・警告・差分・Git 装飾の色 | ⬜ フォールバック |
| 検索ハイライト・ブラケットペアの色 | ⬜ フォールバック |
| 言語固有スコープ（HTML、CSS、Markdown、JSON） | ⬜ 未定義 |
| セマンティックハイライト | ⬜ 未対応 |

**アクセシビリティについて。** 主要なシンタックスカラーは純黒背景に対して WCAG AA（4.5:1）を満たしています（キーワード 6.4:1、関数 7.7:1、文字列 10.3:1、本文 18.0:1）。一方、次の 3 つは基準を下回っており、[v0.3.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/4) で修正予定です — コメント 3.6:1、行番号 3.9:1、非アクティブタブのラベル 3.0:1。なお、今回定義したリスト・入力欄・ドロップダウン・ボタン上のラベルはすべて 4.5:1 以上を確保しています（最小はネオンピンク地のボタンラベルで 6.2:1）。

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

シンタックスカラーは言語ごとの個別ルールではなく、**汎用の TextMate スコープ**で定義しています。8 つのルールが VS Code の解析できるすべての言語に等しく適用されるため、JavaScript、TypeScript、Python、Go、Rust、Java、C/C++、Ruby、PHP などはインストール直後から一貫した配色になります。

その代わり、言語固有スコープに依存する言語は現状まだ色が乏しい状態です。

- **Markdown** — 見出し、太字、斜体、リンク、コードスパンが通常テキストと同じ色
- **HTML / JSX** — タグ名と属性名が区別されない
- **CSS** — セレクタ・プロパティ・値が区別されない
- **JSON / YAML** — キーと値が区別されない

これらの対応は [v0.2.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/3) で予定しています。

## 🗺️ ロードマップ

[GitHub のマイルストーン](https://github.com/kpab/vscode-neon-pink-theme/milestones)で管理しています。

| バージョン | 内容 |
|---|---|
| [v0.1.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/2) | UI カラーの網羅 — 標準ダークテーマへのフォールバックをなくす |
| [v0.2.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/3) | シンタックスの拡充 — 言語固有スコープとセマンティックハイライト |
| [v0.3.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/4) | アクセシビリティ — エラー/警告/差分の色と WCAG AA コントラスト |
| [v0.4.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/5) | OLED や長時間作業向けの Soft / Dimmed バリアント |
| [v1.0.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/6) | スクリーンショット、CI、リリース自動化 |

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
