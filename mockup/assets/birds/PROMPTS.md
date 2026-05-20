# はとどけい — 12羽の鳩 画像生成プロンプト一式

12時間（1〜12時）に対応した12種の鳥。各時刻にその鳥が「鳴いた回数＝時刻の数」だけ顔を出します。

---

## 0. 出力仕様（共通・厳守）

| 項目 | 指定 |
|---|---|
| 形式 | **透過 PNG**（背景は本物のアルファ透過。白背景・色背景はNG） |
| サイズ | 正方形 **1024×1024**（最終はWeb用に256〜512へ縮小予定。元は大きめでOK） |
| 構図 | **鳥1羽のみ**・中央・フレームの約80% |
| 向き | **3/4（こちら向き・半身）** — 顔を少しこちらに向け、くちばしを開けて鳴く。扉から顔を出すイメージ（真横でも真正面でもない） ※2026-05-20 確定 |
| 余計なもの | 背景・地面・止まり木・影・文字・枠は**すべて無し** |
| 画風 | 12羽で**完全に統一**（線の太さ・陰影・比率・ライティング） |
| 保存名 | `bird_01.png` 〜 `bird_12.png`（番号＝時刻）→ `~/hato-dokei/mockup/assets/birds/` に配置 |

> 透過について: **gpt-image-1 / ChatGPT画像 / Firefly など「背景透過」に対応したツールで透過PNG出力**が一番きれいです。透過非対応のツールしか無い場合は §3 のクロマキー手順を使ってください。

---

## 1. 共通スタイル文（テンプレート）

各鳥は、下の `STYLE` の `{BIRD}` を §2 の1行に差し替えて1枚ずつ生成します（英語のほうが安定します）。

```
STYLE:
A children's storybook illustration of a single small bird, drawn as a classic German
Black-Forest cuckoo-clock wood carving reimagined as a warm, friendly wooden toy.
Soft cel shading, thick clean dark-brown outline, gentle warm light from the upper-left.
Cute, rounded, appealing to toddlers, never scary.
A THREE-QUARTER FRONT view: the bird faces the viewer with its head turned slightly (cute eye contact), beak just open as if singing, as if peeking out of a little cuckoo-clock door toward you. Three-quarter body angle — NOT a flat side profile and NOT a dead-on front view.
The whole bird centered, filling about 80% of the frame.
Transparent background — absolutely no scenery, no perch, no ground, no drop shadow, no text, no border.
Part of a cohesive set of 12 birds that MUST share identical art style, line weight,
proportions and lighting. Output a 1024x1024 transparent PNG.

THE BIRD: {BIRD}
```

---

## 2. 12羽の `{BIRD}`（色を強く指定／色ブレ防止）

| # | 名前 | `{BIRD}`（英語・そのまま差し込む） |
|---|---|---|
| 01 | カッコー | `a cuckoo — slender soft grey-brown body, faintly barred cream chest, small pointed dark beak, long tail, a tiny perky crest. Instantly recognizable as "the cuckoo".` |
| 02 | コマドリ | `a European robin — round body, vivid orange-red face and breast, warm brown back and wings, pale belly, short straight beak.` |
| 03 | シジュウカラ | `a blue tit — sky-blue cap and wings, bright lemon-yellow belly, white cheeks with a small dark eye-stripe, tiny beak.` |
| 04 | スズメ | `a house sparrow — chubby chestnut-brown and cream body, streaky brown wings, grey crown, short conical beak; plain and homely.` |
| 05 | ウグイス | `a Japanese bush warbler (uguisu) — soft olive-green body, pale cream eyebrow stripe, slim pointed beak; slender and elegant.` |
| 06 | インコ | `a budgerigar — VIVID GRASS-GREEN back, wings and belly with a BRIGHT YELLOW head/face, small dark cere, tiny hooked beak. Green-and-yellow, NOT red, NOT blue.` |
| 07 | カナリア | `a canary — plump and glossy, bright sunny-yellow all over, small pale-orange beak; cheerful.` |
| 08 | フクロウ | `a little owl — round fluffy tan-brown body, very large round amber eyes, tiny hooked beak, small ear tufts; extremely cute and sleepy, not scary.` |
| 09 | カワセミ | `a common kingfisher — brilliant turquoise-blue back, head and wings, bright orange-rust belly and cheeks, a long straight dark dagger beak.` |
| 10 | あかいことり | `a scarlet crested finch (cardinal-like) — vivid scarlet-red body, a pointed red crest, a small black mask around a thick orange triangular beak.` |
| 11 | ハチドリ | `a hummingbird — tiny iridescent EMERALD-GREEN body, a glittering MAGENTA-PINK throat, a very long thin needle beak, small blurred wings. Emerald-and-magenta only, no blue, no orange.` |
| 12 | シマエナガ | `a long-tailed tit / "snow fairy" (shimaenaga) — a fluffy round ball of pure soft white down, tiny black bead eyes, a tiny stubby beak, a very long thin tail; magical, delicate, adorable.` |

---

## 3. 透過のフォールバック（ツールが透過非対応の場合）

色付きのフラット背景で生成 → その色をクロマキーで抜く。**鳥に無い色**を背景に選ぶのがコツ（緑/青の鳥に緑背景はNG）。

`STYLE` の最後を次に差し替え:
```
...Instead of a transparent background, place the bird on a PERFECTLY FLAT, UNIFORM, SOLID
{KEY} background that fills the whole frame (single color, no gradient/texture/shadow).
```

抜く色（`{KEY}`）と ffmpeg コマンド:

| # | 鳥 | 背景色 `{KEY}` | hex |
|---|---|---|---|
| 01,02,04,07,08,10,12 | 茶/橙/赤/黄/白系 | 緑 green | `0x00ff00` |
| 03,05,06,09 | 青/緑/水色系 | マゼンタ magenta | `0xff00ff` |
| 11 | エメラルド+マゼンタ | 橙 orange | `0xff7a00` |

```bash
ffmpeg -y -i raw.png \
  -vf "chromakey=0x00ff00:0.15:0.08,format=rgba,scale=1024:1024:flags=lanczos" \
  -frames:v 1 bird_01.png
```
（`0x00ff00` を上表の色に置換。`ffprobe` で `pix_fmt=rgba` を確認）

---

## 4. 鳴き声 12パターン（確認用・画像発注は不要）

鳴き声は**Web Audio で合成**するので画像のような発注は不要です（音源ファイル無し）。モックに組み込み済みで、ギャラリーで試聴できます。下が割当て:

| # | 鳥 | 鳴き声(イメージ) | 音の特徴 |
|---|---|---|---|
| 01 | カッコー | ポッ ポー | 下降する短3度・三角波（時計の定番） |
| 02 | コマドリ | ピリリィ↑ | 上がっていく柔らかいさえずり |
| 03 | シジュウカラ | ツー ピー | 明るい2音 |
| 04 | スズメ | チュン チュン | 短い連続チャープ |
| 05 | ウグイス | ホー ホケキョ | 3音 |
| 06 | インコ | ピロロロ | 早口のおしゃべり |
| 07 | カナリア | トゥルルル | 長い高速トリル |
| 08 | フクロウ | ホー ホー | 低い2音 |
| 09 | カワセミ | チーーッ | 鋭い一声の口笛 |
| 10 | あかいことり | ピチュイ↑ | 元気に跳ね上がる |
| 11 | ハチドリ | チチチチ | 非常に速い高音トリル |
| 12 | シマエナガ | チリリ♪ | 繊細できらきら |

---

## 5. スタイル見本（生成済み）

- `bird_01.png`（カッコー）… **確定向き 3/4 の見本**。狙う画風・向きの基準にしてください。
- `bird_06.png`（インコ）… 旧・横向きの参考（要 3/4 で再生成）。
- 上書きOK。最終は12枚すべて 3/4・統一スタイルで。

機械可読版は同フォルダ `birds_spec.json`（鳥の見た目＋鳴き声パラメータ）。
