import type { DayState } from './time';

/*
 * "Pale yellow walls that mirror the outside light" (The Nudge). So does the
 * page: the yellow wall is paler at nine, their butter at lunch, and deepens
 * towards apricot by eleven. Closed hours dim it.
 */

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a: RGB, b: RGB, k: number) => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * k) as RGB;

const STOPS: { min: number; wall: RGB; paper: RGB; dusk: number }[] = [
  { min: 7 * 60, wall: hex('#fdefcd'), paper: hex('#fffdf6'), dusk: 0 },
  { min: 9 * 60, wall: hex('#fdebc0'), paper: hex('#fffcf3'), dusk: 0 },
  { min: 13 * 60, wall: hex('#fce5ad'), paper: hex('#fffaee'), dusk: 0.1 },
  { min: 17 * 60, wall: hex('#f9d99a'), paper: hex('#fef6e5'), dusk: 0.35 },
  { min: 20 * 60, wall: hex('#f4ca82'), paper: hex('#fbefd9'), dusk: 0.7 },
  { min: 23 * 60, wall: hex('#ecbb6c'), paper: hex('#f7e7cc'), dusk: 1 },
];
const DIM_WALL = hex('#e9e0c8');
const DIM_PAPER = hex('#f3efe6');

export function lightFor(s: Pick<DayState, 'min' | 'open'>) {
  const min = Math.min(Math.max(s.min, STOPS[0].min), STOPS[STOPS.length - 1].min);
  let i = 0;
  while (i < STOPS.length - 2 && min > STOPS[i + 1].min) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const k = Math.min(1, Math.max(0, (min - a.min) / (b.min - a.min)));
  let wall = mix(a.wall, b.wall, k);
  let paper = mix(a.paper, b.paper, k);
  if (!s.open) {
    wall = mix(wall, DIM_WALL, 0.6);
    paper = mix(paper, DIM_PAPER, 0.6);
  }
  return { wall: toHex(wall), paper: toHex(paper), dusk: a.dusk + (b.dusk - a.dusk) * k };
}

export function applyLight(s: Pick<DayState, 'min' | 'open'>) {
  const l = lightFor(s);
  const root = document.documentElement.style;
  root.setProperty('--wall', l.wall);
  root.setProperty('--paper', l.paper);
  root.setProperty('--dusk', l.dusk.toFixed(3));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', l.wall);
}
