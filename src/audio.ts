import type { Call } from './birds';
import { state } from './state';

let ac: AudioContext | null = null;
function ctx(): AudioContext {
  if (!ac) ac = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ac;
}
// iOS等でユーザー操作時に resume する
export function unlockAudio(): void {
  const a = ctx();
  if (a.state === 'suspended') a.resume();
}

// 鳴き声合成。force=true で mute 無視(プレビュー用)。
export function playCall(call: Call, force = false): void {
  if (!call || (!force && !state.sound)) return;
  const a = ctx();
  if (a.state === 'suspended') a.resume();
  let t = a.currentTime + 0.02;
  const seq: number[] = [];
  if (call.trill) {
    for (let i = 0; i < call.trill; i++) seq.push(call.notes[i % call.notes.length]);
  } else {
    for (const f of call.notes) seq.push(f);
  }
  for (const f of seq) {
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = call.type;
    o.frequency.setValueAtTime(f, t);
    if (call.vib) {
      const lfo = a.createOscillator();
      const lg = a.createGain();
      lfo.frequency.value = 13;
      lg.gain.value = call.vib;
      lfo.connect(lg);
      lg.connect(o.frequency);
      lfo.start(t);
      lfo.stop(t + call.dur + 0.02);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t + call.dur);
    o.connect(g);
    g.connect(a.destination);
    o.start(t);
    o.stop(t + call.dur + 0.03);
    t += call.dur + call.gap;
  }
}

// 振り子の「カチ・コチ」。high=カチ(高め), low=コチ(低め)。減衰ノイズ＋バンドパスで本物っぽく、大きめの音量。
export function tickTock(high: boolean): void {
  if (!state.sound) return;
  const a = ctx();
  if (a.state === 'suspended') return;
  const t = a.currentTime;
  const dur = 0.055;
  const len = Math.max(1, Math.ceil(a.sampleRate * dur));
  const buf = a.createBuffer(1, len, a.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len); // 減衰ノイズ(クリック感)
  const src = a.createBufferSource();
  src.buffer = buf;
  const bp = a.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = high ? 2600 : 1500;
  bp.Q.value = 6;
  const g = a.createGain();
  const peak = high ? 0.5 : 0.42; // 大きめ
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(a.destination);
  src.start(t);
  src.stop(t + dur + 0.01);
}
