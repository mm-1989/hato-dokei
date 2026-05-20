export type Screen = 'home' | 'make' | 'quiz' | 'settings';
export type Diff = 'easy' | 'normal' | 'hard';
export type Num = 'arabic' | 'roman';

export interface State {
  screen: Screen;
  diff: Diff;
  num: Num;
  sound: boolean;     // マスター音(タップ/チャイム共通)
  chime: boolean;     // 毎正時の自動チャイム
  quietNight: boolean; // 夜間(21:00-6:59)はチャイムを鳴らさない
}

const KEY = 'hato-dokei.settings.v1';

function load(): State {
  const base: State = { screen: 'home', diff: 'normal', num: 'arabic', sound: true, chime: true, quietNight: false };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s.diff) base.diff = s.diff;
      if (s.num) base.num = s.num;
      if (typeof s.sound === 'boolean') base.sound = s.sound;
      if (typeof s.chime === 'boolean') base.chime = s.chime;
      if (typeof s.quietNight === 'boolean') base.quietNight = s.quietNight;
    }
  } catch { /* ignore */ }
  return base;
}

export const state: State = load();

// 永続化対象は設定のみ(screen は保存しない)
export function saveSettings(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ diff: state.diff, num: state.num, sound: state.sound, chime: state.chime, quietNight: state.quietNight }));
  } catch { /* ignore */ }
}
