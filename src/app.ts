import { state, saveSettings, type Screen } from './state';
import { BIRDS, chimeCount } from './birds';
import { playCall, unlockAudio, tickTock } from './audio';
import { clockSVG, birdMarkup, setHands, CX, CY, minAngle, hourAngle } from './render';

/* ---- inline icons (絵文字に頼らない) ---- */
const IC = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  make: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.8 11V5.4a1.5 1.5 0 0 1 3 0V10h1V4.4a1.5 1.5 0 0 1 3 0V11h1V6.4a1.5 1.5 0 0 1 3 0v6.6a6 6 0 0 1-6 6h-1.6a5 5 0 0 1-4.3-2.5l-2.2-3.7a1.5 1.5 0 0 1 2.5-1.7L8.8 14z"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M9.3 9.2a2.8 2.8 0 1 1 3.7 2.6c-.8.3-1 .9-1 1.6"/><circle cx="12" cy="16.6" r="0.4" fill="currentColor"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94a7.49 7.49 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.3 7.3 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.74 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.49 7.49 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="currentColor"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="currentColor" stroke-width="2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.4L12 16.6 5.9 19.3l1.5-6.4-5-4.3 6.6-.6z"/></svg>',
};

const TITLES: Record<Screen, string> = { home: 'とけい', make: 'とけいを つくろう', quiz: 'クイズ', settings: 'せってい' };

let viewEl: HTMLElement;
let titleEl: HTMLElement;
let navEl: HTMLElement;

function optsFor(): { hands: 'h' | 'hm' | 'all'; second: boolean; minorRing: boolean } {
  if (state.diff === 'easy') return { hands: 'h', second: false, minorRing: false };
  if (state.diff === 'hard') return { hands: 'all', second: true, minorRing: true };
  return { hands: 'hm', second: false, minorRing: false };
}
const randHour = () => 1 + Math.floor(Math.random() * 12);
const isNight = (h: number) => h >= 21 || h < 7;

/* ---- app shell ---- */
export function buildShell(): void {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <header class="appbar">
      <span class="title" id="title">とけい</span>
      <button class="gear" id="gear" aria-label="せってい">${IC.gear}<span class="lk">${IC.lock}</span></button>
    </header>
    <main class="view" id="view"></main>
    <nav class="nav" id="nav">
      <button data-go="home" class="on"><span class="ic">${IC.clock}</span>とけい</button>
      <button data-go="make"><span class="ic">${IC.make}</span>つくる</button>
      <button data-go="quiz"><span class="ic">${IC.quiz}</span>クイズ</button>
    </nav>`;
  viewEl = document.getElementById('view')!;
  titleEl = document.getElementById('title')!;
  navEl = document.getElementById('nav')!;

  navEl.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (b) mount(b.dataset.go as Screen);
  });
  // 親ゲート: 歯車ロング押しで設定へ
  setupParentGate(document.getElementById('gear')!);
  // 最初の操作で AudioContext を解錠
  document.addEventListener('pointerdown', () => unlockAudio(), { once: true });
}

function setupParentGate(gear: HTMLElement): void {
  let timer = 0;
  const start = () => { timer = window.setTimeout(() => mount('settings'), 650); };
  const cancel = () => { if (timer) { clearTimeout(timer); timer = 0; } };
  gear.addEventListener('pointerdown', start);
  gear.addEventListener('pointerup', cancel);
  gear.addEventListener('pointerleave', cancel);
  gear.addEventListener('pointercancel', cancel);
}

export function mount(screen: Screen): void {
  state.screen = screen;
  titleEl.textContent = TITLES[screen];
  navEl.querySelectorAll('button').forEach((b) => b.classList.toggle('on', (b as HTMLElement).dataset.go === screen));
  if (screen === 'home') renderHome();
  else if (screen === 'make') renderMake();
  else if (screen === 'quiz') renderQuiz();
  else renderSettings();
}

/* ================= HOME (飾り時計) ================= */
function renderHome(): void {
  const now = new Date();
  const html = clockSVG({ ...optsFor(), h: now.getHours(), m: now.getMinutes(), s: now.getSeconds(), num: state.num, birdHour: randHour(), pendulum: true, idp: 'home' });
  viewEl.innerHTML = `<div class="screen home">
    <div class="clock-wrap" id="home-clock">${html}</div>
  </div>`;
  const wrap = document.getElementById('home-clock')!;
  wrap.addEventListener('pointerdown', () => { unlockAudio(); summon(wrap, 1); });
}

/* ---- cuckoo 演出 ---- */
let busy = false;
function replay(el: Element, cls: string): void {
  el.classList.remove(cls);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add(cls)));
}
// ランダムな鳩を1羽選び、扉から times 回登場させる(鳴き声もその鳩のもの)
function summon(wrap: HTMLElement, times: number): void {
  if (busy) return;
  busy = true;
  const rh = randHour();
  const bg = wrap.querySelector('.bird-grp');
  if (bg) bg.innerHTML = birdMarkup(rh);   // 扉の中の鳩をランダムに差し替え
  const call = BIRDS[rh - 1].call;
  let i = 0;
  const once = () => {
    const dw = wrap.querySelector('.doors-wrap');
    dw?.classList.add('doors-open');
    if (bg) replay(bg, 'out');
    playCall(call);
    window.setTimeout(() => {
      i++;
      if (i < times) { window.setTimeout(once, 220); }
      else { dw?.classList.remove('doors-open'); busy = false; }
    }, 1450);
  };
  once();
}

/* ---- リアルタイム時計ループ ---- */
let lastChimeHour = -1;
let tickHigh = false;
export function startClockLoop(): void {
  // 起動直後に誤チャイムしないよう現在の時を記録
  lastChimeHour = new Date().getHours();
  window.setInterval(() => {
    if (state.screen !== 'home') return;
    const wrap = document.getElementById('home-clock');
    if (!wrap) return;
    const now = new Date();
    setHands(wrap, now.getHours(), now.getMinutes(), now.getSeconds());
    // 毎正時チャイム(設定で ON のとき。夜間サイレント中は鳴らさない)
    if (now.getMinutes() === 0 && now.getSeconds() < 3 && now.getHours() !== lastChimeHour) {
      lastChimeHour = now.getHours();
      if (state.chime && !(state.quietNight && isNight(now.getHours()))) {
        summon(wrap, chimeCount(now.getHours()));
      }
    }
  }, 250);
  // 振り子のカチ・コチ(半周ごと=0.8秒で高/低を交互)。home表示中＆音ONのときだけ。
  window.setInterval(() => {
    if (state.screen !== 'home' || !document.getElementById('home-clock')) return;
    tickTock(tickHigh);
    tickHigh = !tickHigh;
  }, 800);
}

/* ================= MAKE (とけいを つくろう) ================= */
const makeTime = { h: 3, m: 0 };
function renderMake(): void {
  const html = clockSVG({ ...optsFor(), h: makeTime.h, m: makeTime.m, s: 0, num: state.num, birdHour: 1, pendulum: false, idp: 'make' });
  viewEl.innerHTML = `<div class="screen make">
    <div class="clock-wrap" id="make-clock">${html}</div>
    <div class="readout" id="make-readout"></div>
    <p class="hint">はりを ぐるっと うごかしてみよう</p>
  </div>`;
  wireMakeDrag();
  updateMakeReadout();
}
function updateMakeReadout(): void {
  const el = document.getElementById('make-readout');
  if (!el) return;
  const h = makeTime.h === 0 ? 12 : makeTime.h;
  let t: string;
  if (state.diff === 'easy' || makeTime.m === 0) t = `${h}じ`;
  else if (state.diff === 'normal' && makeTime.m === 30) t = `${h}じはん`;
  else t = `${h}じ ${String(makeTime.m).padStart(2, '0')}ふん`;
  el.textContent = t;
}
function pointerAngle(svg: SVGSVGElement, ev: PointerEvent): number {
  const r = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  const cx = r.left + ((CX - vb.x) / vb.width) * r.width;
  const cy = r.top + ((CY - vb.y) / vb.height) * r.height;
  const a = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI;
  return (a + 90 + 360) % 360;
}
function angDist(a: number, b: number): number { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
function wireMakeDrag(): void {
  const svg = document.querySelector('#make-clock svg') as SVGSVGElement | null;
  const wrap = document.getElementById('make-clock');
  if (!svg || !wrap) return;
  let drag: 'hour' | 'min' | null = null;
  svg.addEventListener('pointerdown', (ev) => {
    const a = pointerAngle(svg, ev);
    if (state.diff === 'easy') drag = 'hour';
    else {
      const dh = angDist(a, hourAngle(makeTime.h, makeTime.m));
      const dm = angDist(a, minAngle(makeTime.m));
      drag = dh <= dm ? 'hour' : 'min';
    }
    svg.setPointerCapture(ev.pointerId);
    applyDrag(a, drag);
  });
  svg.addEventListener('pointermove', (ev) => { if (drag) applyDrag(pointerAngle(svg, ev), drag); });
  const end = () => { drag = null; };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);

  function applyDrag(a: number, which: 'hour' | 'min'): void {
    if (which === 'hour') {
      makeTime.h = Math.round(a / 30) % 12;
      if (state.diff === 'easy') makeTime.m = 0;
    } else {
      const step = state.diff === 'hard' ? 5 : 30;
      makeTime.m = (Math.round((a / 6) / step) * step) % 60;
    }
    setHands(wrap!, makeTime.h, makeTime.m, 0);
    updateMakeReadout();
  }
}

/* ================= QUIZ (なんじ?) ================= */
const quiz = { h: 3, m: 0, options: [3, 4, 5], answered: false, stars: 0 };
function newRound(): void {
  const h = 1 + Math.floor(Math.random() * 12);
  let m = 0;
  if (state.diff === 'normal') m = Math.random() < 0.5 ? 0 : 30;
  else if (state.diff === 'hard') m = Math.floor(Math.random() * 12) * 5;
  quiz.h = h; quiz.m = m; quiz.answered = false;
  const opts = new Set<number>([h]);
  while (opts.size < 3) opts.add(1 + Math.floor(Math.random() * 12));
  quiz.options = [...opts].sort(() => Math.random() - 0.5);
}
function renderQuiz(): void {
  if (quiz.stars === 0 && !quiz.answered) newRound();
  // クイズは hour 当て。h は 1-12 表記、内部 hour-hand 用に h%12
  const html = clockSVG({ ...optsFor(), h: quiz.h % 12, m: quiz.m, s: 0, num: state.num, birdHour: 1, pendulum: false, idp: 'quiz' });
  viewEl.innerHTML = `<div class="screen quiz">
    <div class="qcard"><div class="q">なんじ かな？</div></div>
    <div class="clock-wrap sm" id="quiz-clock">${html}</div>
    <div class="qrow" id="quiz-opts"></div>
    <div class="stars" id="quiz-stars"></div>
  </div>`;
  const row = document.getElementById('quiz-opts')!;
  quiz.options.forEach((n) => {
    const b = document.createElement('button');
    b.className = 'qopt';
    b.textContent = `${n}じ`;
    b.addEventListener('click', () => answerQuiz(n, b));
    row.appendChild(b);
  });
  renderStars();
}
function renderStars(): void {
  const el = document.getElementById('quiz-stars');
  if (el) el.innerHTML = IC.star.repeat(Math.min(quiz.stars, 5));
}
function answerQuiz(n: number, btn: HTMLButtonElement): void {
  if (quiz.answered) return;
  unlockAudio();
  if (n === quiz.h) {
    quiz.answered = true;
    quiz.stars++;
    btn.classList.add('correct');
    renderStars();
    const w = document.getElementById('quiz-clock') as HTMLElement | null;
    if (w) summon(w, 1);
    window.setTimeout(() => { newRound(); renderQuiz(); }, 1700);
  } else {
    btn.classList.add('wrong');
  }
}

/* ================= SETTINGS ================= */
function seg(group: string, items: [string, string][], cur: string): string {
  return `<div class="seg" data-set="${group}">` +
    items.map(([v, label]) => `<button data-v="${v}" class="${v === cur ? 'on' : ''}">${label}</button>`).join('') +
    `</div>`;
}
function renderSettings(): void {
  viewEl.innerHTML = `<div class="screen settings">
    <button class="close" id="set-close">＜ もどる</button>
    <div class="parent">${IC.lock}<span>おうちのひとへ：このがめんは「ながおし」でひらきます</span></div>
    <div class="set-grp"><h3>むずかしさ</h3>
      ${seg('diff', [['easy', 'やさしい'], ['normal', 'ふつう'], ['hard', 'むずかしい']], state.diff)}
      <p class="note">やさしい＝みじかい はりだけ／ふつう＝はん(30ぷん)／むずかしい＝5ふんめもり・びょうしん</p></div>
    <div class="set-grp"><h3>もじばん</h3>
      ${seg('num', [['arabic', '1 2 3'], ['roman', 'Ⅰ Ⅱ Ⅲ']], state.num)}
      <p class="note">がくしゅうは すうじ すいしょう。ローマすうじは クラシックな みため。</p></div>
    <div class="set-grp"><h3>おと</h3>
      ${seg('sound', [['on', 'オン'], ['off', 'オフ']], state.sound ? 'on' : 'off')}
      <p class="note">はとの なきごえ(ごうせいおん)。しずかな ばしょでは オフに。</p></div>
    <div class="set-grp"><h3>まいせいじの チャイム</h3>
      ${seg('chime', [['on', 'オン'], ['off', 'オフ']], state.chime ? 'on' : 'off')}
      <p class="note">ちょうどの じかんに はとが でて なく(でる かずは じこくの かず)。オフで しずかに。</p></div>
    <div class="set-grp"><h3>よるは しずかに</h3>
      ${seg('quietNight', [['on', 'オン'], ['off', 'オフ']], state.quietNight ? 'on' : 'off')}
      <p class="note">よる(よる9じ〜あさ7じ)は チャイムを ならしません。タップでは でます。</p></div>
  </div>`;
  document.getElementById('set-close')!.addEventListener('click', () => mount('home'));
  viewEl.querySelectorAll('.seg').forEach((g) => {
    g.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (!b) return;
      const key = (g as HTMLElement).dataset.set!;
      const v = (b as HTMLElement).dataset.v!;
      if (key === 'diff') state.diff = v as any;
      else if (key === 'num') state.num = v as any;
      else if (key === 'sound') state.sound = v === 'on';
      else if (key === 'chime') state.chime = v === 'on';
      else if (key === 'quietNight') state.quietNight = v === 'on';
      saveSettings();
      renderSettings();
    });
  });
}
