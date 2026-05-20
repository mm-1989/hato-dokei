import type { Num } from './state';
import { BIRDS, type Pal } from './birds';
import { birdImg, partImg } from './assets';

export const CX = 200, CY = 342, R = 90;
const TOP = 32;

export const SLOTS: Record<string, { x: number; y: number; w: number; h: number }> = {
  case:      { x: 48, y: 44, w: 304, h: 426 },
  ornament:  { x: 150, y: 26, w: 100, h: 48 },
  door:      { x: 162, y: 166, w: 76, h: 60 },
  bird:      { x: 172, y: 180, w: 56, h: 54 },
  dialPlate: { x: 98, y: 240, w: 204, h: 204 },
  pendulum:  { x: 172, y: 410, w: 56, h: 180 },
};

const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

export const hourAngle = (h: number, m: number) => ((h % 12) + m / 60) * 30;
export const minAngle = (m: number) => (m % 60) * 6;
export const secAngle = (s: number) => (s % 60) * 6;

/* ---- procedural parts (仮素材) ---- */
function dialPlateSVG(p: string): string {
  return `<circle cx="${CX}" cy="${CY}" r="${R + 12}" fill="#caa53d" stroke="#7a5a14" stroke-width="3"/>
    <circle cx="${CX}" cy="${CY}" r="${R + 5}" fill="url(#brass_${p})"/>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="url(#face_${p})" stroke="#cdb48a" stroke-width="1.5"/>`;
}
function caseSVG(p: string): string {
  return `<g filter="url(#soft_${p})">
    <path d="M44 150 L200 44 L356 150 Z" fill="url(#roof_${p})" stroke="#241405" stroke-width="3"/>
    <path d="M44 150 L200 44 L356 150 Z" fill="none" filter="url(#grain_${p})" opacity="0.28"/>
    <path d="M30 150 H370 L357 169 H43 Z" fill="#3c2410" stroke="#241405" stroke-width="2"/>
    <rect x="56" y="150" width="288" height="320" rx="14" fill="url(#wood_${p})" stroke="#241405" stroke-width="3"/>
    <rect x="56" y="150" width="288" height="320" rx="14" fill="none" filter="url(#grain_${p})" opacity="0.28"/>
    <rect x="64" y="156" width="272" height="6" rx="3" fill="#fff" opacity="0.07"/>
  </g>
  <g fill="#caa53d" opacity="0.92">
    <path d="M70 168 q-22 16 -7 40 q22 -7 19 -33 q-6 -5 -12 -7Z"/>
    <path d="M330 168 q22 16 7 40 q-22 -7 -19 -33 q6 -5 12 -7Z"/>
  </g>`;
}
function ornamentSVG(): string {
  return `<g stroke="#caa53d" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.92">
    <path d="M200 70 v-16 M200 60 l-13 -10 M200 60 l13 -10 M200 52 l-9 -12 M200 52 l9 -12 M187 50 l-7 -8 M213 50 l7 -8"/>
    <circle cx="200" cy="72" r="3" fill="#caa53d"/></g>`;
}
function doorOpeningSVG(): string {
  return `<path d="M166 200 q34 -32 68 0 v22 a5 5 0 0 1 -5 5 h-58 a5 5 0 0 1 -5 -5 z" fill="#140b04"/>`;
}
function doorLeavesSVG(p: string): string {
  return `<g class="doors-wrap">
    <rect class="door-l" x="162" y="167" width="38" height="59" rx="4" fill="url(#roof_${p})" stroke="#caa53d" stroke-width="1.5"/>
    <rect class="door-r" x="200" y="167" width="38" height="59" rx="4" fill="url(#roof_${p})" stroke="#caa53d" stroke-width="1.5"/>
    <circle cx="199" cy="196" r="2" fill="#caa53d"/>
  </g>`;
}
function pendulumInnerSVG(p: string): string {
  return `<rect x="${CX - 2.5}" y="455" width="5" height="150" rx="2.5" fill="url(#brass_${p})"/>
    <circle cx="${CX}" cy="612" r="25" fill="url(#brass_${p})" stroke="#7a5a14" stroke-width="2"/>
    <circle cx="${CX}" cy="612" r="12" fill="#caa53d" stroke="#8a6a1c" stroke-width="1.5"/>`;
}

/* ---- parameterized procedural bird (仮表示) ---- */
export function birdSVG(p: Pal): string {
  const cx = 200, cy = 205, bk = p.longBeak ? 17 : 9, eyeR = p.round ? 2.6 : 1.9, out = '#3a2410';
  return `<g stroke="${out}" stroke-width="1.3" stroke-linejoin="round">
    ${p.longTail
      ? `<path d="M186 ${cy + 2} q-30 5 -40 -3 q26 -1 37 -11Z" fill="${p.wing}"/>`
      : `<path d="M186 ${cy + 2} q-17 5 -23 -3 q14 0 21 -9Z" fill="${p.wing}"/>`}
    <ellipse cx="${cx}" cy="${cy + 1}" rx="18" ry="${p.round ? 15 : 13}" fill="${p.body}"/>
    <path d="M192 ${cy + 3} q12 -9 23 1 q-6 11 -23 5Z" fill="${p.belly}"/>
    <path d="M185 ${cy - 1} q-13 4 -18 -3 q11 0 17 -7Z" fill="${p.wing}"/>
    <circle cx="${cx + 11}" cy="${cy - 7}" r="${p.round ? 10 : 9}" fill="${p.head || p.body}"/>
    ${p.crest ? `<path d="M${cx + 8} ${cy - 15} q2 -11 9 -7 q-1 6 -4 9Z" fill="${p.head || p.body}"/>` : ''}
    <path d="M${cx + 19} ${cy - 8} l${bk} 3 l-${bk} 5 Z" fill="${p.beak}" stroke="none"/>
    <circle cx="${cx + 13}" cy="${cy - 9}" r="${eyeR}" fill="#1a0f06" stroke="none"/>
    ${p.round ? `<circle cx="${cx + 13}" cy="${cy - 9}" r="6" fill="none" stroke="${p.beak}" stroke-width="1.3" opacity="0.6"/>` : ''}
  </g>`;
}

function imageSlot(name: string): string {
  const s = SLOTS[name];
  const img = `<image href="${partImg[name]}" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" preserveAspectRatio="xMidYMid meet"/>`;
  return name === 'door' ? `<g class="doors-wrap doorimg">${img}</g>` : img;
}
function slot(name: string, draw: () => string): string {
  return partImg[name] ? imageSlot(name) : draw();
}
export function birdMarkup(hour: number): string {
  const src = birdImg[hour];
  const s = SLOTS.bird;
  if (src) return `<image href="${src}" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" preserveAspectRatio="xMidYMid meet"/>`;
  return birdSVG((BIRDS[hour - 1] || BIRDS[0]).pal);
}

export interface ClockOpts {
  h: number; m: number; s: number;
  hands: 'h' | 'hm' | 'all';
  second: boolean;
  minorRing: boolean;
  num: Num;
  birdHour: number;
  pendulum: boolean;
  idp: string;
}

export function clockSVG(o: ClockOpts): string {
  // numerals — クリーム面の内側に配置し、クリーム色のハロー(縁取り)で背景から浮かせて可読性UP
  let nums = '';
  for (let i = 0; i < 12; i++) {
    const ang = (i * 30 - 90) * Math.PI / 180, rr = R - 34;     // クリーム面内・上の縁に当たらない半径
    const x = CX + rr * Math.cos(ang), y = CY + rr * Math.sin(ang);
    const isRoman = o.num === 'roman';
    const val = i === 0 ? 12 : i;
    const label = isRoman ? ROMAN[i] : val;
    const fs = isRoman ? 17 : 24;
    const ls = (!isRoman && val >= 10) ? ' letter-spacing="-1.5"' : '';  // 2桁(10/11/12)を詰めて隣接の窮屈さを解消
    nums += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="${fs}" font-weight="800" fill="#241405" stroke="#fbf3df" stroke-width="2.8" stroke-linejoin="round" paint-order="stroke"${ls} font-family="${isRoman ? 'Georgia,serif' : 'inherit'}">${label}</text>`;
  }
  // ticks — 5分位置の控えめなマークのみ(クリーム面内・縁取りの唐草と被らない)
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const ang = (i * 30 - 90) * Math.PI / 180, r1 = R - 21, r2 = R - 28;
    ticks += `<line x1="${(CX + r1 * Math.cos(ang)).toFixed(1)}" y1="${(CY + r1 * Math.sin(ang)).toFixed(1)}" x2="${(CX + r2 * Math.cos(ang)).toFixed(1)}" y2="${(CY + r2 * Math.sin(ang)).toFixed(1)}" stroke="#9a7838" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  // 5-min ring (むずかしい)
  let minor = '';
  if (o.minorRing) {
    for (let i = 0; i < 12; i++) {
      const ang = (i * 30 - 90) * Math.PI / 180, rr = R - 52;
      const x = CX + rr * Math.cos(ang), y = CY + rr * Math.sin(ang);
      minor += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="10" font-weight="700" fill="#b06a2a" stroke="#fbf3df" stroke-width="2.4" paint-order="stroke">${i * 5}</text>`;
    }
  }
  const showM = o.hands === 'all' || o.hands === 'hm';
  const showS = o.second && o.hands === 'all';
  const hAng = hourAngle(o.h, o.m), mAng = minAngle(o.m), sAng = secAngle(o.s);
  const hourHand = `<g class="js-hour" transform="rotate(${hAng} ${CX} ${CY})"><path d="M${CX} ${CY + 13} L${CX - 7} ${CY - 17} L${CX} ${CY - 46} L${CX + 7} ${CY - 17} Z" fill="#2a1a0c"/></g>`;
  const minHand = `<g class="js-min" transform="rotate(${mAng} ${CX} ${CY})"><path d="M${CX} ${CY + 15} L${CX - 5} ${CY - 18} L${CX} ${CY - 64} L${CX + 5} ${CY - 18} Z" fill="#3a2410"/></g>`;
  const secHand = showS ? `<g class="js-sec" transform="rotate(${sAng} ${CX} ${CY})"><line x1="${CX}" y1="${CY + 16}" x2="${CX}" y2="${CY - 68}" stroke="#b23a2a" stroke-width="2"/><circle cx="${CX}" cy="${CY}" r="3.5" fill="#b23a2a"/></g>` : '';

  const pend = o.pendulum ? `<g class="pendulum">${slot('pendulum', () => pendulumInnerSVG(o.idp))}</g>` : '';
  const H = o.pendulum ? 645 : 472;

  return `<svg viewBox="0 ${TOP} 400 ${H - TOP}" class="clock-svg" role="img" aria-label="木製カッコー時計">
    <defs>
      <linearGradient id="wood_${o.idp}" x1="0" y1="0" x2="0.2" y2="1"><stop offset="0" stop-color="#8a5526"/><stop offset="0.5" stop-color="#643f1d"/><stop offset="1" stop-color="#3f2611"/></linearGradient>
      <linearGradient id="roof_${o.idp}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4a22"/><stop offset="1" stop-color="#48290f"/></linearGradient>
      <radialGradient id="face_${o.idp}" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#fbf3df"/><stop offset="0.8" stop-color="#f1e3c2"/><stop offset="1" stop-color="#e3d0a4"/></radialGradient>
      <linearGradient id="brass_${o.idp}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e7cd72"/><stop offset="0.5" stop-color="#caa53d"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <filter id="grain_${o.idp}"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="3" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.8 0.8 0.8 0 -0.5" result="a"/><feFlood flood-color="#34200d" result="d"/><feComposite in="d" in2="a" operator="in"/></filter>
      <filter id="soft_${o.idp}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#2a1809" flood-opacity="0.32"/></filter>
    </defs>
    ${pend}
    ${slot('case', () => caseSVG(o.idp))}
    ${doorOpeningSVG()}
    <g class="bird-grp">${birdMarkup(o.birdHour)}</g>
    ${slot('door', () => doorLeavesSVG(o.idp))}
    ${slot('ornament', () => ornamentSVG())}
    ${slot('dialPlate', () => dialPlateSVG(o.idp))}
    ${ticks}${minor}${nums}
    ${showM ? minHand : ''}${hourHand}${secHand}
    <circle cx="${CX}" cy="${CY}" r="6.5" fill="#2a1a0c"/><circle cx="${CX}" cy="${CY}" r="3" fill="#caa53d"/>
  </svg>`;
}

// 既存の SVG の針だけを更新(再描画せずアニメ維持)
export function setHands(root: ParentNode, h: number, m: number, s: number): void {
  const hh = root.querySelector('.js-hour') as SVGGElement | null;
  const mm = root.querySelector('.js-min') as SVGGElement | null;
  const ss = root.querySelector('.js-sec') as SVGGElement | null;
  if (hh) hh.setAttribute('transform', `rotate(${hourAngle(h, m)} ${CX} ${CY})`);
  if (mm) mm.setAttribute('transform', `rotate(${minAngle(m)} ${CX} ${CY})`);
  if (ss) ss.setAttribute('transform', `rotate(${secAngle(s)} ${CX} ${CY})`);
}
