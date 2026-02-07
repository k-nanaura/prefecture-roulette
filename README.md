# 🎰 都道府県ルーレット

日本の47都道府県からランダムに1つを選ぶルーレットアプリケーションです。

![都道府県ルーレット](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 機能

- **都道府県の選択**: チェックボックスで対象となる都道府県を自由に選択
- **全選択/全解除**: ワンクリックで全都道府県を選択または解除
- **ルーレット演出**: ドラムロール効果とともに都道府県名が高速で切り替わり、徐々に減速
- **サウンドエフェクト**: ドラムロール、ティック音、バン！効果音、ファンファーレ
- **視覚エフェクト**: 結果発表時の紙吹雪アニメーション

## 🚀 使い方

1. ブラウザで `index.html` を開きます
2. ルーレットの対象にしたい都道府県にチェックを入れます（デフォルトは全選択）
3. 「スタート！」ボタンをクリックします
4. ルーレットが回転し、ランダムに1つの都道府県が選ばれます

## 📁 ファイル構成

```
prefecture-roulette/
├── index.html    # メインのHTMLファイル
├── styles.css    # スタイルシート
├── app.js        # JavaScriptアプリケーション
└── README.md     # このファイル
```

## 🛠️ 技術スタック

- **HTML5**: セマンティックなマークアップ
- **CSS3**: モダンなデザイン、グラデーション、アニメーション
- **JavaScript (ES6+)**: ルーレットロジック、Web Audio API
- **Google Fonts**: Noto Sans JP フォント

## 🌐 ブラウザ対応

- Google Chrome（推奨）
- Firefox
- Safari
- Microsoft Edge

## 📝 ライセンス

MIT License

## 🔧 ローカルでの実行

特別なセットアップは不要です。`index.html` をブラウザで直接開くか、お好みのローカルサーバーを使用してください。

```bash
# Pythonを使用する場合
python -m http.server 8000

# Node.jsを使用する場合
npx serve
```

その後、ブラウザで `http://localhost:8000` を開きます。

---

© 2026 都道府県ルーレット
