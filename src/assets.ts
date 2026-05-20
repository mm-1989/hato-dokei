import { BIRDS } from './birds';

const BASE = import.meta.env.BASE_URL + 'assets/';

// 利用可能になった画像 URL を保持(無ければ未定義→プロシージャル仮表示)
export const birdImg: Record<number, string> = {};
export const partImg: Record<string, string> = {};

export const PART_SLOTS = ['case', 'ornament', 'door', 'dialPlate', 'pendulum'] as const;
export type PartName = typeof PART_SLOTS[number];

// 画像を1枚読み込み、成功したら map に登録して onChange を呼ぶ
function tryLoad(url: string, onOk: () => void): void {
  const img = new Image();
  img.onload = onOk;
  img.src = url;
}

export function preloadAssets(onChange: () => void): void {
  for (const b of BIRDS) {
    const nn = String(b.h).padStart(2, '0');
    const url = `${BASE}birds/bird_${nn}.webp`;
    tryLoad(url, () => { birdImg[b.h] = url; onChange(); });
  }
  for (const name of PART_SLOTS) {
    const url = `${BASE}parts/${name}.webp`;
    tryLoad(url, () => { partImg[name] = url; onChange(); });
  }
}
