import type { DayState } from './time';

/*
 * The page is lit like the room: pale and airy at nine, full butter yellow
 * at lunch, deepening to candlelit ochre by eleven. Closed hours dim it.
 */

type RGB = [number, number, number];

const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a: RGB, b: RGB, t: number): RGB => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as RGB;

type Stop = { min: number; ground: RGB; paper: RGB; dusk: number };

const STOPS: Stop[] = [
  { min: 6 * 60, ground: hex('#F6EBC0'), paper: hex('#FBF5DE'), dusk: 0 },
  { min: 9 * 60, ground: hex('#F7E7A4'), paper: hex('#FCF3D0'), dusk: 0 },
  { min: 12 * 60, ground: hex('#F4D977'), paper: hex('#F9EAB0'), dusk: 0.08 },
  { min: 15 * 60, ground: hex('#F0CD62'), paper: hex('#F6E09A'), dusk: 0.18 },
  { min: 18 * 60, ground: hex('#E5B64C'), paper: hex('#EFCD7E'), dusk: 0.45 },
  { min: 21 * 60, ground: hex('#D49D3A'), paper: hex('#E2B862'), dusk: 0.78 },
  { min: 23 * 60, ground: hex('#C48A2F'), paper: hex('#D6A653'), dusk: 1 },
];

const DIM = hex('#CBBF98');
const DIM_PAPER = hex('#DDD3B2');

export type Palette = {
  ground: string;
  paper: string;
  dusk: number;
  lights: number;
};

export function paletteFor(s: Pick<DayState, 'min' | 'open'>): Palette {
  const min = Math.min(Math.max(s.min, STOPS[0].min), STOPS[STOPS.length - 1].min);
  let i = 0;
  while (i < STOPS.length - 2 && min > STOPS[i + 1].min) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const t = Math.min(1, Math.max(0, (min - a.min) / (b.min - a.min)));
  let ground = mix(a.ground, b.ground, t);
  let paper = mix(a.paper, b.paper, t);
  const dusk = a.dusk + (b.dusk - a.dusk) * t;
  if (!s.open) {
    ground = mix(ground, DIM, 0.55);
    paper = mix(paper, DIM_PAPER, 0.55);
  }
  return { ground: toHex(ground), paper: toHex(paper), dusk, lights: s.open ? 1 : 0 };
}

export function applyPalette(p: Palette, root: HTMLElement = document.documentElement) {
  root.style.setProperty('--ground', p.ground);
  root.style.setProperty('--paper', p.paper);
  root.style.setProperty('--dusk', p.dusk.toFixed(3));
  root.style.setProperty('--lights', String(p.lights));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', p.ground);
}
