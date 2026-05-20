# はとどけい — 鳥以外のアセット 画像生成プロンプト一式

時計本体まわりのパーツ（木枠／屋根飾り／扉／文字盤／振り子）を、12羽の鳩と**同じ画風**でハイクオリティに作るためのプロンプト。

---

## 0. 出力仕様（共通・厳守）

| 項目 | 指定 |
|---|---|
| 形式 | **透過 PNG**（本物のアルファ。背景・地面・影・文字なし） |
| 視点 | **真正面（front elevation）・左右対称**。斜め・パースなし |
| 構図 | パーツ1点のみ・中央・透過マージン付き |
| 画風 | **12羽の鳩と統一**（線の太さ・陰影・ライティング・木/真鍮/アイボリーのパレット） |
| 配置 | パーツは**個別に合成**するので、各々を自己完結で（隣接パーツを描き込まない） |
| 保存先 | `~/hato-dokei/mockup/assets/parts/` に下表のファイル名 |

> **重要（整合）**: 数字・目盛り・針は学習用に**ベクターで上描き**します。だから **文字盤プレートには数字・針・目盛りを描かない**でください。また木枠の**中央前面はプレーン**にして（文字盤と扉はアプリが上に重ねる）、装飾は屋根・縁・側面に寄せてください。

> **透過**: gpt-image-1 / ChatGPT画像 / Firefly など透過対応ツールでの**透過PNG出力**が確実。非対応なら §3 のクロマキー（木・真鍮・アイボリーには緑が無いので **緑背景 `#00FF00`** が安全）。

---

## 1. 共通スタイル文（テンプレート）

`{ASSET}` を §2 の1行に差し替えて1点ずつ生成。

```
STYLE:
A high-quality children's-storybook illustration asset for a classic German Black-Forest
(Schwarzwald) cuckoo clock, in the SAME art style as a set of cute carved-wood toy birds:
warm hand-carved wooden-toy feel, soft cel shading, thick clean dark-brown outline,
gentle warm light from the upper-left. Palette: rich walnut-brown wood with warm visible
grain, aged gold/brass, and ivory-cream. A single object, centered, straight-on FRONT view,
left-right symmetric. Fully transparent background (real alpha) — no scenery, no ground,
no cast shadow, no text, no border.

THE ASSET: {ASSET}
```

---

## 2. パーツ別 `{ASSET}`（ファイル名・推奨キャンバス・整合メモ付き）

### ① 木枠（本体＋屋根）— `case.png` / 枠 304×426（縦長 ≈3:4）
```
{ASSET}: an ornate Black-Forest cuckoo-clock wooden HOUSE — a steeply peaked carved gable
roof with a decorated ridge and small turned finials, walls of rich walnut wood with warm
grain, and carved oak-leaf scrollwork running along the roof eaves and down the LEFT and
RIGHT edges. Keep the CENTER-FRONT a relatively PLAIN flat wood panel (a clock face and a
small door will be placed on top of it), so do not draw a dial or a door. Front elevation,
symmetric. The house silhouette fills the tall frame (roof at top ~25%, body below).
```
推奨: 縦長 768×1024。中央は空けて、装飾は屋根・縁・側面に。

### ② 屋根飾り（頂部の彫り）— `ornament.png` / 枠 100×48（横長 ≈2:1）
```
{ASSET}: a small carved Black-Forest crest ornament for the very top of the clock — a
symmetric arrangement of carved oak leaves with a tiny pair of antlers (or a tiny carved
bird) in wood and aged gold. Ornamental, centered.
```
推奨: 横長 1024×512。

### ③ カッコー扉（閉じた状態）— `door.png` / 枠 76×60（≈5:4）
```
{ASSET}: a small CLOSED cuckoo-clock door — an arched carved wooden double-door (two leaves)
with fine carved trim, tiny brass hinges and a little knob, matching the walnut wood. Shown
closed, straight-on, centered.
```
推奨: ≈4:3。観音開きアニメ用に **左右の扉を別々**（`door_l.png` / `door_r.png`）でも可（任意）。

### ④ 文字盤プレート（数字・針なし）— `dialPlate.png` / 枠 204×204（正方形・円）
```
{ASSET}: a round antique clock-face PLATE with NO numbers, NO hands and NO center boss — an
ornate gilt/brass outer ring with fine engraving enclosing an aged ivory-cream enamel dial
with a faint minute-track groove near the rim. Just the empty decorated plate, perfectly
circular, straight-on, filling the square frame. Absolutely no numerals or hands.
```
推奨: 正方形 1024×1024。**数字・針・大きな目盛りは描かない**（ベクターで上描き）。

### ⑤ 振り子（棒＋錘）— `pendulum.png` / 枠 56×194（縦長 ≈2:7）
```
{ASSET}: a cuckoo-clock PENDULUM — a slim brass rod hanging vertically, with a decorative
brass bob at the bottom shaped like an ornate sunburst or oak-leaf disc. The TOP-CENTER of
the rod is the pivot. Vertical, centered, straight-on.
```
推奨: 縦長 320×1024。**棒の上端中央＝揺れの支点**になるよう中央に。

---

## 3. 透過のフォールバック（ツールが透過非対応の場合）

木・真鍮・アイボリーには緑が無いので**全パーツ緑背景**でOK。

`STYLE` 末尾を差し替え:
```
...Instead of transparency, place the asset on a PERFECTLY FLAT UNIFORM SOLID GREEN (#00FF00)
field filling the frame (single color, no gradient/texture/shadow).
```
```bash
ffmpeg -y -i raw.png -vf "chromakey=0x00ff00:0.15:0.08,format=rgba" -frames:v 1 case.png
```
（`ffprobe` で `pix_fmt=rgba` 確認）

---

## 4. 任意の追加パーツ（クラシック度を上げたい場合）

- `weight.png` — 松ぼっくり型の真鍮錘（鎖付き）。本物の黒い森時計の定番。※現モックのレイアウト未配置（入れる場合は別途配置調整）。
- `hand_hour.png` / `hand_minute.png` — 装飾針（spade & leaf の真鍮）。**真上向き・回転軸は下端中央**。短針=太く短い／長針=細く長い。
  ※既定は**ベクター針**（幼児の可読性優先）。装飾針画像にすると見栄えは上がるが小さい子には読みにくくなるトレードオフあり。

---

## 5. 整合メモ（重要）

- パーツは各スロット枠（上表 W×H）に **`preserveAspectRatio` 中央フィット**で合成。1:1 しか出せないツールなら、被写体を中央に置き透過余白で調整 → 本制作で SVG スロット座標を微調整します。
- **文字盤プレートが整列の基準**（数字・針はその中心に重なる）。だから dial は数字・針なしの素のプレートで。
- **木枠の中央前面はプレーン**に（dial と door が上に乗る）。
- 鳥と同じ「木＋真鍮＋アイボリー」「太い茶の輪郭」「左上光源」で揃えると一体感が出ます。可能なら鳥と同じセッションで連続生成を推奨。
