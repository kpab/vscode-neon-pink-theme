![Neon Pink Dark — VS Code のカラーテーマ](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/banner.png)

# Neon Pink Dark Theme

**Cyberpunk スタイルの VS Code ダークテーマ**

> [English](README.md) | 日本語

ブラック背景に蛍光ピンクが映えるネオン系カラースキーム。夜の街のネオンサインをイメージした未来的なテーマです。

[![Marketplace installs](https://vsmarketplacebadges.dev/installs-short/kpab.neon-pink-dark.svg?style=flat-square&color=FF2DBE&labelColor=000000)](https://marketplace.visualstudio.com/items?itemName=kpab.neon-pink-dark)
![Theme Type](https://img.shields.io/badge/theme-dark-FF55C3?style=flat-square&labelColor=000000)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.80.0-FF8CF0?style=flat-square&labelColor=000000)

## ✨ 特徴

- 🎨 **完全なブラック背景** - `#000000` がネオンカラーを最大限に引き立てます
- 💖 **蛍光ピンクアクセント** - メインカラー `#FF2DBE` をエディタと UI 全体に適用
- 🌃 **Cyberpunk / Future Neon** - 夜の街のネオンサインをイメージ
- 🎯 **多層のハイライト** - 55 の TextMate ルールとセマンティックトークン。すべての言語に効く汎用スコープの上に、Markdown・HTML・CSS・JSON・YAML 向けの専用ルールを重ねています
- 🎚️ **4 つのテーマ** - オリジナルに加えて、OLED・明るい部屋・長時間作業向けの **Soft** と **Dimmed**、そして 0.0.1 のパレットを懐かしむ人のための **Classic**。1 回のインストールで[4 つのテーマ](#-バリアント)が入ります
- 🔧 **カスタマイズ可能** - VS Code の設定から個別に色を上書きできます

> **v0.3.0 ですべての面が定義済みになりました。** ワークベンチの UI、シンタックス、診断表示、差分エディタ、Git 装飾のいずれもテーマ側で色を持ち、すべてのテキストカラーが実際に描画される背景に対して WCAG AA を満たしています。**v0.4.0 では Soft / Dimmed バリアントを追加**し、同じ基準をそのまま満たしています。**v1.0.0 は、この一覧に積み残しがなくなった最初のリリースです。** テーマとして完成し、測定され、スクリーンショットも揃い、その状態を保つためのチェックはすべて CI で回っています。カバー範囲は[対応状況](#-対応状況)を、今後の予定は[ロードマップ](#-ロードマップ)をご覧ください。

## 📊 対応状況

| 対象 | 状態 |
|---|---|
| エディタの背景・前景・カーソル・選択範囲・行番号 | ✅ 定義済み |
| サイドバー・ステータスバー・アクティビティバー・タブ・タイトルバー・パネル | ✅ 定義済み |
| 汎用シンタックススコープ（キーワード、宣言、演算子、定数、変数、引数、プロパティ、関数、型、デコレータ、エスケープ、正規表現、`invalid` の 23 ルール） | ✅ 定義済み |
| リスト・ツリー・入力欄・ボタン・ドロップダウン・チェックボックス・フォーカスリング・テキストリンク | ✅ 定義済み |
| コマンドパレット・IntelliSense・ホバー・Peek・通知・メニュー・パンくず・スクロールバー | ✅ 定義済み |
| ターミナル（16 の ANSI スロット・カーソル・選択範囲） | ✅ 定義済み |
| 検索/単語ハイライト・ブラケットペア・概要ルーラーとミニマップのマーカー | ✅ 定義済み |
| エラー・警告・情報の診断表示、問題パネル、マーカーナビゲーション | ✅ 定義済み |
| 差分エディタ、マージコンフリクト、3-way マージエディタ | ✅ 定義済み |
| Git 装飾（エクスプローラーのラベル、ガター、ミニマップ、概要ルーラー） | ✅ 定義済み |
| 言語固有スコープ（HTML/JSX、CSS、Markdown、JSON、YAML、シェル、正規表現） | ✅ 定義済み |
| セマンティックハイライト（`readonly`・`defaultLibrary`・`deprecated` と標準トークン型） | ✅ 対応済み |
| Soft / Dimmed バリアント（ベーステーマから生成し、同じ基準で測定） | ✅ 定義済み |
| Neon Pink Dark・Soft・Dimmed のスクリーンショット（実際の VS Code 画面） | ✅ README に掲載 |
| Classic — 0.0.1 の修正版パレットスナップショット（[#24](https://github.com/kpab/vscode-neon-pink-theme/issues/24)） | ✅ 凍結・ハッシュ検証済み |
| CI — push と PR ごとに構造・生成物の鮮度・コントラストを検証。`v*` タグで公開 | ✅ 自動化済み |

**アクセシビリティについて。** 現行の 3 バリアントでは、すべてのテキストカラーが実際に描画される背景に対して WCAG AA（4.5:1）を満たしています。背景そのものだけでなく、選択範囲、現在行のハイライト、差分の両側も対象です。これらは背景の輝度を持ち上げるため、コントラスト比が約 1.3 分の 1 に落ちます。もっとも厳しいのは差分や選択範囲の中のキーワードで、Neon Pink Dark が 4.63:1、Soft が 4.58:1、Dimmed が 4.57:1。素の背景に対してなら同じキーワードが 6.4:1、コメント 6.8:1、関数 7.7:1、文字列 10.3:1、本文 18.0:1 です。**Classic** だけは意図的な例外です。この取り組みより前の修正版旧パレットを保つため、上記の保証は適用されません。AA を下回るのは 6 組で、行番号が 3.89:1、非アクティブなタブが 3.01:1、選択範囲の中のキーワードが 3.95:1、コメントがエディタ・現在行・選択範囲でそれぞれ 3.64:1・3.55:1・2.87:1 です。

`npm test` で [`scripts/check-contrast.js`](scripts/check-contrast.js) が走ります。シンタックスカラー × 12 種類の背景（エディタ、選択範囲、現在行、差分の追加/削除それぞれの行単位と語単位、インラインのマージコンフリクト 3 領域、3-way マージエディタ）、および UI のラベル × それぞれの背景で、現行 3 テーマは 1 テーマあたり 995 組を測定し、1 つでも基準を下回れば失敗します。Classic も測定します。131 組のうち 6 組が AA を下回り、その 6 組は毎回出力されますがビルドは落としません。Classic が定義しないキーは失敗とは別に数えます。そこに描かれるのは VS Code 標準の色であって、テーマの取りこぼしではなく、標準に任せること自体がこのテーマの趣旨だからです。全結果は `--verbose` で確認できます。アルファ値を持つ色は合成してから測るので、スウォッチの見た目ではなく実際に目に届く色の値が出ます。除外は空白文字マーカー・インデントガイド・差分エディタの斜線ハッチの 3 つだけで、いずれも薄いままであるべきものです（除外理由も出力されます）。

## 🎚️ バリアント

この拡張機能は 4 つのテーマを提供します。最初の 3 つは、色相も意味づけもルールも同じテーマを 3 段階の強さで用意したものです。切り替えても新しいテーマを覚え直す必要はなく、単に見やすさの選択になります。4 つ目は 0.0.1 パレットの修正版スナップショットです。

| テーマ | 背景 | 彩度 | こんなときに |
|---|---|---|---|
| **Neon Pink Dark** | `#000000` | 100% | コントラストを最大にしたい、ネオンらしさを全部味わいたい |
| **Neon Pink Dark Soft** | `#12000A` | 80% | ディスプレイが OLED、または純黒の縁がきつく感じる |
| **Neon Pink Dimmed** | `#0D0008` | 60% | 長時間の作業、明るい部屋、彩度が高いと疲れる |
| **Neon Pink Dark Classic** | `#000000` | —（スナップショット） | 0.0.1 の見た目が恋しい — VS Code 標準色の上に少しだけピンク |

`Ctrl+K Ctrl+T` / `Cmd+K Cmd+T` で選べます。1 回インストールすれば 4 つとも一覧に並びます。

下の比較画像は現行の 3 段階のテーマを示しています。Classic 専用のスクリーンショットはまだありません。

![同じファイルを現行の 3 段階のテーマで表示](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/variants.png)

**なぜ背景を持ち上げるのか。** 彩度の高いマゼンタを `#000000` に載せると、OLED ではスクロール中に尾を引いて見えます。ピクセルが完全に消えてから点き直すためです。黒から数ポイントだけ上げた背景ならピクセルが点いたままになり、この滲みは止まります。明るい場所で背景が「面」ではなく「穴」に見えてしまう問題にも効きます。

**バリアントの作り方。** `themes/neon-pink-dark-color-theme.json` は現行テーマの手動管理ベースです。Soft と Dimmed の 2 つは [`scripts/build-themes.js`](scripts/build-themes.js) が生成してコミットします。インストール時に依存パッケージが要らないまま、3 つのパレットが別々にずれていくことも防げる形です（`npm test` が再生成して、ディスク上の内容と違えば失敗します）。Classic は後述のハッシュ検証付きスナップショットとして別に管理します。変換は 3 段階です。

1. **輝度を保ったまま彩度を下げる。** 各色を自分自身の明度のグレーへ寄せたあと、元の相対輝度に戻るようスケールします。コントラストは輝度だけで決まるので、この工程では比率が 1 つも動きません。
2. **背景の持ち上げ。** 黒がバリアント固有の下地色になり、暗い面のランプもそれに応じて（上に行くほど弱く）持ち上がります。コントラストを削るのはこの工程だけです。
3. **前景のゲイン。** 持ち上げた背景が奪った分の輝度を、すべての前景色に戻します。約 3% で目には見えませんが、トークンが黒地で持っていた比率を保つには十分です。

残るのは、エディタ背景よりも大きく持ち上がる面 — 選択範囲や差分の変更語 — で、ここだけ元の値から数百分の 1 ほど下がります。だからこそ導出を信用せず、全バリアントを丸ごと測定しています。もっとも厳しい値はベースが 4.63:1、Soft が 4.58:1、Dimmed が 4.57:1 です。

**Classic はバリアントではなく修正版スナップショットです。** [#24](https://github.com/kpab/vscode-neon-pink-theme/issues/24) でのリクエストを受けて、0.0.1 のパレットを独立した名前で収録しました。ただし、旧 `contrastBorder` は除いています。このキーでは VS Code がアルファ値を無視し、ワークベンチ全体に不透明なピンクの枠を描くため、診断済みの回帰まで復活させないためです。Classic が定義するワークベンチカラーは 24 色で、残りは VS Code 標準の Dark+ に任せています — ソース管理の明るい青いコミットボタンもそのままです。ファイルはハッシュで固定して偶発的な編集を防ぎます。コントラストは測定して報告します。AA を下回る 6 組はそのまま残します。引き上げれば、このテーマが保とうとしている見た目そのものが変わってしまうからです。この 6 という数は [`scripts/theme-config.js`](scripts/theme-config.js) に固定してあるので、黙ってずれることはありません。

> **ライト**バリアントは意図的に入れていません。白地に蛍光ピンクは別のデザイン課題で、アクセントを「落ち着かせる」のではなく「暗くする」必要があり、5 色の例外パレットも一から引き直しになります。彩度を下げる作業と一緒に扱うものではなく、独立したマイルストーンの題材です。

## 📦 インストール方法

### VS Code Marketplace から（推奨）

1. VS Code を開く
2. 拡張機能ビュー（`Ctrl+Shift+X` / `Cmd+Shift+X`）を開く
3. "Neon Pink Dark" を検索
4. "Install" をクリック
5. カラーテーマを選択（`Ctrl+K Ctrl+T` / `Cmd+K Cmd+T`）— "Neon Pink Dark" / "Neon Pink Dark Soft" / "Neon Pink Dimmed" / "Neon Pink Dark Classic" から選べます

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

以下はすべて不透明な値です。アルファ合成は挟まないので、カラーコードがそのまま実測値になります。

| 用途 | カラーコード | 純黒に対する比 | 説明 |
|------|-------------|---------------|------|
| 🎯 メインアクセント | `#FF2DBE` | 6.4:1 | 蛍光ピンク（キーワード、カーソル） |
| ⬛ 背景 | `#000000` | — | 完全なブラック |
| 📝 通常テキスト | `#FFE6FF` | 18.0:1 | 薄いピンク |
| 📜 文字列 | `#FF8CF0` | 10.3:1 | 明るいピンク |
| 🔢 数値 | `#FF55C3` | 7.3:1 | ビビッドピンク |
| 💬 コメント | `#C77AAE` | 6.8:1 | くすんだピンク（イタリック） |
| 🔧 関数 | `#FF5EC4` | 7.7:1 | ミディアムピンク |
| 📦 型定義 | `#FF9AD6` | 10.9:1 | ライトピンク |
| ⚙️ 記号・区切り | `#FFBEE8` | 13.8:1 | ペールピンク |
| #️⃣ 行番号 | `#B3689B` | 5.4:1 | コメントより一段暗いピンク |

バリアントは色相と比率を保ったまま彩度だけを下げています。アクセントは Soft が `#F646C0`、Dimmed が `#E25DB9`、コメントはそれぞれ `#C082AC` と `#B487A6` です。実測値の全表は `node scripts/check-contrast.js --verbose` で確認できます。

## 📸 スクリーンショット

以下はすべて、実際に VS Code で動かした画面です。読めるフォントサイズで、サンプル用に作ったコードではなく実ファイルを開いています。

![Neon Pink Dark — JavaScript のコントラスト測定スクリプト](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/hero.png)

**ウィンドウ全体** — アクティビティバー、エクスプローラー、タブ、パンくず、ミニマップ、ターミナル、ステータスバー。ターミナルには ANSI 16 色と `git log` のグラフが出ています。どちらもテーマ側で定義した色で、既定値の流用ではありません。

![ターミナルを開いたワークベンチ全体](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/full-window.png)

**TypeScript** — 型・インターフェース・正規表現リテラル・テンプレート文字列。

![TypeScript](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/typescript.png)

**Python** — デコレーター、dataclass、docstring、f-string。

![Python](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/python.png)

**Markdown** — 見出し・強調・インラインコード・リンク・引用がそれぞれ別の扱いになります。

![Markdown](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/markdown.png)

**差分表示** — 追加行と削除行を行単位と語単位の両方で示し、語単位には変更の始まりと終わりを示す枠線が付きます。

![差分エディタ](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/diff.png)

**コマンドパレット** — オーバーレイ系のウィジェットにも色を当てています。パレット、クイックピック、IntelliSense、ホバー、通知。

![コマンドパレット](https://raw.githubusercontent.com/kpab/vscode-neon-pink-theme/main/images/command-palette.png)

## 🌐 対応言語

シンタックスカラーはまず**汎用の TextMate スコープ**で定義しています。23 のルールが VS Code の解析できるすべての言語に等しく適用されるため、JavaScript、TypeScript、Python、Go、Rust、Java、C/C++、Ruby、PHP などはインストール直後から一貫した配色になります。同じ概念には同じ色を割り当てているので、`if` の色は Rust でも Python でも変わりません。

その上に、マークアップ系・データ系の言語向けの**言語固有ルール**を重ねています。

- **Markdown** — 見出しは h1〜h6 でピンクの明度が段階的に変化。太字・斜体・打ち消し線・引用・インラインコード・コードブロック・リンク・表・区切り線もそれぞれ本文と区別されます
- **HTML / JSX** — タグ名・属性名・属性値が 3 色に分かれます
- **CSS / SCSS / LESS** — 要素・クラス・id・擬似クラスの各セレクタが区別され、プロパティ名と値も別色です。カスタムプロパティ（`--var`）にも専用色を割り当てています
- **JSON / YAML / TOML** — キーと値が区別されます
- **シェル / SQL / 正規表現** — 変数展開、文字クラス、アンカーを個別に着色します

カバー範囲は、VS Code に同梱されている TextMate 文法でサンプルファイルを実際にトークン化して確認しています。標準の前景色のままになるのは、地の文（HTML のテキストノード、Markdown の段落）と、文法側がスコープを付けない識別子（SQL のテーブル名・カラム名など）です。

さらに**セマンティックハイライト**を有効にしているため、言語サーバーのある言語（TypeScript、Rust、C#、Java、Python など）では型情報を使った着色も効きます。`const` と `let` が別の色になり、標準ライブラリのシンボルは斜体、非推奨 API には打ち消し線が付きます。セマンティックの色は対応する TextMate の色と一致させてあるので、解析完了のタイミングで色が変わることはありません。

## 🎯 デザイン方針

1. **コントラスト最優先** — 純黒（`#000000`）の背景が前景色のコントラスト比を最大化します。バリアントで見やすさのために一部を手放す場合も、下限は守ります
2. **一貫した色の意味づけ** — 同じ概念には、どの言語でも同じピンクを割り当てます
3. **見た目は妥協しない、ただし可読性が上** — Cyberpunk らしさは目的ですが、自分のコードが読めなくなるなら本末転倒です
4. **限られたパレット** — 色数を絞ることでまとまりのある画面になります
5. **情報を運ぶ色はパレットより優先** — 装飾ではなく情報を伝えている色は、ピンクの範囲外を使ってよいものとします

5 番目は 4 番目にあえて設けた例外で、差分・Git の色とともに v0.3.0 で追加しました。追加行と削除行、エラーと警告を同じ色相にはできません。ここでの色は情報そのものであり、単色パレットを貫くと「色が伝えるべきこと」をわざわざ本文を読んで判断させることになるからです。例外は以下の 5 色に限定しています。いずれもブラケットペアや ANSI パレットですでに使っている色なので、新しい色は増えません。

| 意味 | 色相 | 併用箇所 |
|---|---|---|
| エラー・削除 | コーラル `#FF4A5F` | `invalid.illegal`、対応の取れていない括弧、ANSI red |
| 警告・コンフリクト | アンバー `#FFB05C` | ANSI yellow |
| 情報 | シアン `#4DDDE8` | エスケープシーケンス、正規表現の文字クラス、ANSI cyan |
| 追加・未追跡 | ミント `#3FE0A0` / `#7DFFC6` | 正規表現リテラル、ANSI green、ブラケット 6 段目 |
| 変更 | バイオレット `#C77DFF` | デコレータ・マクロ、ブラケット 3 段目 |

コードそのものを表す色はピンクのまま。コードに*ついて*エディタが述べていること（診断、差分、Git の状態）だけが、この 5 色を使えます。

## 🗺️ ロードマップ

[GitHub のマイルストーン](https://github.com/kpab/vscode-neon-pink-theme/milestones)で管理しています。

| バージョン | 内容 |
|---|---|
| [v0.1.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/2) | UI カラーの網羅 — 標準ダークテーマへのフォールバックをなくす |
| [v0.2.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/3) | シンタックスの拡充 — 言語固有スコープとセマンティックハイライト |
| [v0.3.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/4) | アクセシビリティ — エラー/警告/差分の色と WCAG AA コントラスト |
| [v0.4.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/5) | OLED や長時間作業向けの Soft / Dimmed バリアント |
| [v1.0.0](https://github.com/kpab/vscode-neon-pink-theme/milestone/6) | スクリーンショット、CI、リリース自動化 |

ライトバリアントはまだこの一覧にありません。理由は[バリアント](#-バリアント)の末尾の補足をご覧ください。

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

角括弧の中はテーマ名なので、`[Neon Pink Dark]` は Soft・Dimmed・Classic には効きません。すべてに効かせるには `"[Neon Pink Dark][Neon Pink Dark Soft][Neon Pink Dimmed][Neon Pink Dark Classic]"` のように並べて書きます。

## 🤝 コントリビューション

Issue や Pull Request を歓迎します！詳しい手順は [CONTRIBUTING.md](CONTRIBUTING.md)（英語）にあります。要点だけ書くと:

```bash
npm install
npm run build   # Soft / Dimmed バリアントを再生成
npm test        # 構造・生成物の鮮度・コントラスト。CI と同じチェック
```

1. このリポジトリをフォークし、`main` からブランチを作成
2. 色を編集するのは `themes/neon-pink-dark-color-theme.json` だけ。Soft / Dimmed はここから生成されるので、古いままなら `npm test` が落ちます
3. VS Code で `F5` を押して確認
4. CHANGELOG の `## [Unreleased]` に変更を追記
5. Pull Request を作成

新しい色は、実際にレンダリングされる面すべてで WCAG AA を満たし、ピンクのランプ上にある必要があります（例外は[デザイン方針](#-デザイン方針)を参照）。`npm test` がそれを測定します。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください。

## 🔗 リンク

- [GitHub リポジトリ](https://github.com/kpab/vscode-neon-pink-theme)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=kpab.neon-pink-dark)
- [Issue トラッカー](https://github.com/kpab/vscode-neon-pink-theme/issues)

---

**Enjoy coding in the neon! 💖✨**
