# はとどけい 🕰️🐦

クラシックな木製カッコー時計を題材にした、幼児向けの時間学習 PWA。
実時刻に同期して動く飾り時計、毎正時にランダムな鳩が鳴くチャイム、針を動かして時刻を作る練習、なんじクイズを収録。

## 機能
- **とけい**: 実時刻の飾り時計。タップでランダムな鳩が登場（鳴き声つき）。毎正時は「時刻の数」だけ鳴く。
- **つくる**: 針をドラッグして時刻をつくる（難易度でスナップが変化）。
- **クイズ**: 「なんじ かな？」を当てる。
- **せってい**（歯車を長押し＝親ゲート）: むずかしさ／文字盤（数字・ローマ）／音／毎正時チャイム ON-OFF／夜間サイレント。設定は localStorage に保存。

## 技術
- Vite 6 + TypeScript（フレームワークなし）、SVG プロシージャル描画＋画像アセット（WebP）。
- 鳴き声は Web Audio で合成（音源ファイル不要）。
- PWA（manifest + Service Worker、オフライン対応）。Service Worker は本番ビルドのみ登録。

## 開発
```bash
npm install
npm run dev       # http://localhost:5173/
npm run build     # dist/ を生成（base=/hato-dokei/）
npm run preview   # ビルド結果を確認 → http://localhost:4173/hato-dokei/
```

## 公開（GitHub Pages）
`main` へ push すると GitHub Actions（`.github/workflows/deploy.yml`）が build → Pages へデプロイ。
リポジトリの Settings → Pages → Source を **GitHub Actions** に設定してください。
公開 URL: `https://<user>.github.io/hato-dokei/`

## アセット
- 配信用（軽量 WebP）: `public/assets/{birds,parts}/`
- 元データ（PNG マスター）・生成プロンプト: `mockup/assets/`（`birds/PROMPTS.md`, `parts/PROMPTS.md`）
