import type { DayState } from './time';

/*
 * "Pale yellow walls that mirror the outside light" (The Nudge). The page
 * does the same: paler and airier at nine, their butter at midday, warming
 * towards apricot by eleven at night. Closed hours dim it.
 */

type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a: RGB, b: RGB, k: number) => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * k) as RGB;

const STOPS: { min: number; paper: RGB; butter: RGB; dusk: number }[] = [
  { min: 7 * 60, paper: hex('#fffdf7'), butter: hex('#fdeec9'), dusk: 0 },
  { min: 9 * 60, paper: hex('#fffcf5'), butter: hex('#fdebc0'), dusk: 0 },
  { min: 13 * 60, paper: hex('#fffbf0'), butter: hex('#fce5ad'), dusk: 0.1 },
  { min: 17 * 60, paper: hex('#fdf6e6'), butter: hex('#fadd9c'), dusk: 0.35 },
  { min: 20 * 60, paper: hex('#faefda'), butter: hex('#f6d18a'), dusk: 0.7 },
  { min: 23 * 60, paper: hex('#f6e8cf'), butter: hex('#f1c679'), dusk: 1 },
];
const DIM_PAPER = hex('#f2eee6');
const DIM_BUTTER = hex('#e9e0c9');

export function lightFor(s: Pick<DayState, 'min' | 'open'>) {
  const min = Math.min(Math.max(s.min, STOPS[0].min), STOPS[STOPS.length - 1].min);
  let i = 0;
  while (i < STOPS.length - 2 && min > STOPS[i + 1].min) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const k = Math.min(1, Math.max(0, (min - a.min) / (b.min - a.min)));
  let paper = mix(a.paper, b.paper, k);
  let butter = mix(a.butter, b.butter, k);
  if (!s.open) {
    paper = mix(paper, DIM_PAPER, 0.6);
    butter = mix(butter, DIM_BUTTER, 0.6);
  }
  return { paper: toHex(paper), butter: toHex(butter), dusk: a.dusk + (b.dusk - a.dusk) * k };
}

export function applyLight(s: Pick<DayState, 'min' | 'open'>) {
  const l = lightFor(s);
  const root = document.documentElement.style;
  root.setProperty('--paper', l.paper);
  root.setProperty('--butter-field', l.butter);
  root.setProperty('--dusk', l.dusk.toFixed(3));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', l.paper);
}
