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

// 振り子のカチコチ(任意・控えめ)
export function tick(): void {
  if (!state.sound) return;
  const a = ctx();
  if (a.state === 'suspended') return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = 'square';
  o.frequency.value = 1800;
  const t = a.currentTime;
  g.gain.setValueAtTime(0.06, t);
  g.gain.exponentialRampToValueAtTime(0.0005, t + 0.03);
  o.connect(g);
  g.connect(a.destination);
  o.start(t);
  o.stop(t + 0.04);
}
