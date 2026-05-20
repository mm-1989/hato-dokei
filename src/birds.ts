// 12羽の鳩（時刻1-12）。pal=プロシージャル仮表示の配色 / call=Web Audio 鳴き声パラメータ
export interface Call {
  label: string;
  notes: number[];
  type: OscillatorType;
  dur: number;
  gap: number;
  vib: number;
  trill?: number;
}
export interface Pal {
  body: string; head?: string; belly: string; wing: string; beak: string;
  crest?: boolean; longBeak?: boolean; longTail?: boolean; round?: boolean;
}
export interface Bird { h: number; ja: string; en: string; pal: Pal; call: Call; }

export const BIRDS: Bird[] = [
  { h: 1, ja: 'カッコー', en: 'Cuckoo', pal: { body: '#8a6a45', head: '#8a6a45', belly: '#dcc69a', wing: '#5f4630', beak: '#e0892a', crest: true, longTail: true }, call: { label: 'ポッ ポー', notes: [784, 659], type: 'triangle', dur: 0.32, gap: 0.12, vib: 0 } },
  { h: 2, ja: 'コマドリ', en: 'Robin', pal: { body: '#9a6a3a', head: '#9a6a3a', belly: '#e8743a', wing: '#6e4824', beak: '#2a1a0c' }, call: { label: 'ピリリィ↑', notes: [660, 740, 880], type: 'sine', dur: 0.12, gap: 0.04, vib: 18 } },
  { h: 3, ja: 'シジュウカラ', en: 'Blue tit', pal: { body: '#3f74c4', head: '#3f74c4', belly: '#f2d34a', wing: '#2a55a0', beak: '#2a1a0c' }, call: { label: 'ツー ピー', notes: [1320, 990], type: 'square', dur: 0.16, gap: 0.07, vib: 0 } },
  { h: 4, ja: 'スズメ', en: 'Sparrow', pal: { body: '#9c7a4e', head: '#7a5e38', belly: '#ddc89c', wing: '#6a4f2e', beak: '#3a2a14' }, call: { label: 'チュン チュン', notes: [1500, 1500, 1400], type: 'square', dur: 0.07, gap: 0.09, vib: 0 } },
  { h: 5, ja: 'ウグイス', en: 'Warbler', pal: { body: '#8a9a4a', head: '#8a9a4a', belly: '#cdd49a', wing: '#6a7a34', beak: '#3a2a14' }, call: { label: 'ホー ホケキョ', notes: [700, 1050, 860], type: 'sine', dur: 0.26, gap: 0.06, vib: 10 } },
  { h: 6, ja: 'インコ', en: 'Budgie', pal: { body: '#5aa83a', head: '#e6d23a', belly: '#7ec24a', wing: '#3f7a26', beak: '#cfa05a' }, call: { label: 'ピロロロ', notes: [1175, 1320, 1175, 1480, 1320], type: 'sawtooth', dur: 0.06, gap: 0.02, vib: 24 } },
  { h: 7, ja: 'カナリア', en: 'Canary', pal: { body: '#f2cf2a', head: '#f2cf2a', belly: '#f7e06a', wing: '#d8b020', beak: '#d8923a' }, call: { label: 'トゥルルル', notes: [1568, 1660], type: 'triangle', dur: 0.045, gap: 0.02, vib: 0, trill: 9 } },
  { h: 8, ja: 'フクロウ', en: 'Owl', pal: { body: '#b58a55', head: '#b58a55', belly: '#e0c89a', wing: '#8a6a3a', beak: '#b07a3a', round: true }, call: { label: 'ホー ホー', notes: [300, 280], type: 'sine', dur: 0.45, gap: 0.2, vib: 6 } },
  { h: 9, ja: 'カワセミ', en: 'Kingfisher', pal: { body: '#1fb6c4', head: '#1f9ac4', belly: '#e07a3a', wing: '#1f7aa0', beak: '#1a1208', longBeak: true }, call: { label: 'チーーッ', notes: [2200, 2400], type: 'square', dur: 0.5, gap: 0, vib: 40 } },
  { h: 10, ja: 'あかいことり', en: 'Red finch', pal: { body: '#cf2a2a', head: '#cf2a2a', belly: '#e85a4a', wing: '#a01818', beak: '#e0892a', crest: true }, call: { label: 'ピチュイ↑', notes: [880, 1175], type: 'triangle', dur: 0.14, gap: 0.05, vib: 14 } },
  { h: 11, ja: 'ハチドリ', en: 'Hummingbird', pal: { body: '#2fae6a', head: '#2fae6a', belly: '#c44a8a', wing: '#1f8a4f', beak: '#1a1208', longBeak: true }, call: { label: 'チチチチ', notes: [2637, 2794], type: 'sine', dur: 0.03, gap: 0.015, vib: 0, trill: 12 } },
  { h: 12, ja: 'シマエナガ', en: 'Snow fairy', pal: { body: '#f4f4f6', head: '#f4f4f6', belly: '#ffffff', wing: '#d8dde6', beak: '#c98f4a', longTail: true }, call: { label: 'チリリ♪', notes: [2093, 2349, 2637], type: 'sine', dur: 0.08, gap: 0.04, vib: 8 } },
];

// 12時間表記での「その時刻の数」(N時にN回鳴く)。0時/12時は12回。
export function chimeCount(hour24: number): number {
  const h = hour24 % 12;
  return h === 0 ? 12 : h;
}
// 24時間 → 1..12 の鳩インデックス
export function birdHourOf(hour24: number): number {
  const h = hour24 % 12;
  return h === 0 ? 12 : h;
}
