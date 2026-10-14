import {
  COCKTAILS,
  DAYS,
  DAYS_SHORT,
  DAYTIME_MENU,
  EVENING_MENU,
  HOURS,
  KITCHEN,
  type Dish,
  type MenuId,
  type Span,
} from '../data/sessa';

/* A moment in Sessa's week: day 0 = Sunday, minutes after midnight (London). */
export type Moment = { day: number; min: number };

export const DAY_START = 9 * 60;
export const DAY_END = 23 * 60;

const londonFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function londonNow(date = new Date()): Moment {
  const parts = londonFormat.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = DAYS_SHORT.indexOf(get('weekday'));
  return { day: day < 0 ? date.getDay() : day, min: Number(get('hour')) * 60 + Number(get('minute')) };
}

/* ?at=sat-11:30, ?at=sun-14:30, ?at=fri-21 … */
export function parseAt(value: string | null): Moment | null {
  if (!value) return null;
  const m = value.trim().toLowerCase().match(/^([a-z]{3})[a-z]*[-_ ]?(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return null;
  const day = DAYS_SHORT.findIndex((d) => d.toLowerCase() === m[1]);
  const h = Number(m[2]);
  const min = Number(m[3] ?? 0);
  if (day < 0 || h > 23 || min > 59) return null;
  return { day, min: h * 60 + min };
}

/* Reads ?at= from the real query string or from the query inside the hash. */
export function readAtParam(): Moment | null {
  if (typeof window === 'undefined') return null;
  const direct = new URLSearchParams(window.location.search).get('at');
  const hashQuery = window.location.hash.split('?')[1] ?? '';
  const inHash = new URLSearchParams(hashQuery).get('at');
  return parseAt(direct ?? inHash);
}

/* 9am, 11:30am, 3pm, 10:30pm */
export function clock(min: number): string {
  const h24 = Math.floor(min / 60) % 24;
  const m = min % 60;
  const suffix = h24 < 12 ? 'am' : 'pm';
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h}${suffix}` : `${h}:${String(m).padStart(2, '0')}${suffix}`;
}

/* 11:30 without the suffix, for big numerals. */
export function clockParts(min: number): { hm: string; suffix: string } {
  const h24 = Math.floor(min / 60) % 24;
  const m = min % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return { hm: `${h}:${String(m).padStart(2, '0')}`, suffix: h24 < 12 ? 'am' : 'pm' };
}

const within = (span: Span | null | undefined, min: number) =>
  !!span && min >= span.from && min < span.to;

export type Phase =
  | 'closed-day'
  | 'before-open'
  | 'after-close'
  | 'daytime'
  | 'between'
  | 'evening'
  | 'bar-only';

export type OnBoard = { name: string; price: string; when?: string; drink?: boolean };

export type DayState = Moment & {
  open: boolean;
  hours: Span | null;
  menu: MenuId | null;
  phase: Phase;
  /* "Open till 11pm" / "Closed" */
  doors: string;
  /* What the kitchen is doing, in a sentence. */
  kitchen: string;
  /* What changes next. */
  next: string | null;
  /* Today's items for the chalkboard, at this moment. */
  board: OnBoard[];
  /* Items that come on later in this service. */
  later: OnBoard[];
  /* One line on what the room is like at this hour. */
  mood: string;
};

function nextOpening(m: Moment): string {
  for (let i = 0; i < 8; i++) {
    const day = (m.day + i) % 7;
    const span = HOURS[day];
    if (!span) continue;
    if (i === 0 && m.min >= span.from) continue;
    const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[day];
    return `Opens ${when} at ${clock(span.from)}`;
  }
  return '';
}

function dishAvailable(d: Dish, m: Moment): boolean {
  if (d.days && !d.days.includes(m.day)) return false;
  if (d.from !== undefined && m.min < d.from) return false;
  return true;
}

function boardFor(menu: MenuId | null, m: Moment, open: boolean): { board: OnBoard[]; later: OnBoard[] } {
  const board: OnBoard[] = [];
  const later: OnBoard[] = [];
  if (menu) {
    const dishes = (menu === 'daytime' ? DAYTIME_MENU : EVENING_MENU).flat().filter((d) => d.board);
    for (const d of dishes) {
      if (d.days && !d.days.includes(m.day)) continue;
      const item = { name: d.name, price: d.price, when: d.note };
      if (dishAvailable(d, m)) board.push(item);
      else later.push(item);
    }
  }
  if (open) {
    for (const c of COCKTAILS) {
      if (!c.days || !c.window) continue;
      if (!c.days.includes(m.day)) continue;
      const item = { name: c.name, price: c.price, when: c.note, drink: true };
      if (within(c.window, m.min)) board.push(item);
      else if (m.min < c.window.from) later.push(item);
    }
  }
  return { board, later };
}

function moodFor(min: number, phase: Phase): string {
  if (phase === 'bar-only' && min < 18 * 60) return 'Sliding into wine and cocktails.';
  if (phase === 'closed-day') return 'Lights off.';
  if (phase === 'before-open') return 'Not open yet.';
  if (phase === 'after-close') return 'Candles out.';
  if (min < 12 * 60) return 'Coffee and pastries.';
  if (min < 15 * 60) return 'Lunch, and maybe a glass with it.';
  if (min < 18 * 60) return 'Sliding into wine and cocktails.';
  if (min < 21 * 60) return 'Candles lit. Small plates and a bottle.';
  return 'Late. Martinis.';
}

export function stateAt(m: Moment): DayState {
  const hours = HOURS[m.day];
  const open = within(hours, m.min);
  const menu: MenuId | null = within(KITCHEN.daytime[m.day], m.min)
    ? 'daytime'
    : within(KITCHEN.evening[m.day], m.min)
      ? 'evening'
      : null;

  let phase: Phase;
  if (!hours) phase = 'closed-day';
  else if (m.min < hours.from) phase = 'before-open';
  else if (m.min >= hours.to) phase = 'after-close';
  else if (menu) phase = menu;
  else {
    const eve = KITCHEN.evening[m.day];
    phase = eve && m.min < eve.from ? 'between' : 'bar-only';
  }

  const dayK = KITCHEN.daytime[m.day];
  const eveK = KITCHEN.evening[m.day];
  let kitchen = '';
  let next: string | null = null;

  switch (phase) {
    case 'closed-day':
      kitchen = 'Closed on Mondays.';
      next = nextOpening(m);
      break;
    case 'before-open':
      kitchen = `Daytime menu from ${clock(dayK!.from)}.`;
      next = nextOpening(m);
      break;
    case 'after-close':
      kitchen = hours!.to <= 18 * 60 ? 'Closed for the day.' : 'Closed for the night.';
      next = nextOpening(m);
      break;
    case 'daytime':
      kitchen = `Daytime menu, until ${clock(dayK!.to)}.`;
      next = eveK
        ? `Evening menu from ${clock(eveK.from)}`
        : `Bar open until ${clock(hours!.to)}`;
      break;
    case 'between':
      kitchen = 'Kitchen’s between menus. The bar is open.';
      next = `Evening menu from ${clock(eveK!.from)}`;
      break;
    case 'evening':
      kitchen = `Evening menu, until ${clock(eveK!.to)}.`;
      next = `Bar open until ${clock(hours!.to)}`;
      break;
    case 'bar-only':
      kitchen = 'Kitchen’s closed. The bar is open.';
      next = `Doors close at ${clock(hours!.to)}`;
      break;
  }

  const doors = open ? `Open until ${clock(hours!.to)}` : 'Closed';
  const { board, later } = boardFor(menu, m, open);

  return {
    ...m,
    open,
    hours,
    menu,
    phase,
    doors,
    kitchen,
    next,
    board,
    later,
    mood: moodFor(m.min, phase),
  };
}

/* Which menu tab makes sense to show first at this moment. */
export function defaultMenu(m: Moment): MenuId {
  const s = stateAt(m);
  if (s.menu) return s.menu;
  const eve = KITCHEN.evening[m.day];
  if (s.phase === 'between' || s.phase === 'bar-only') return eve ? 'evening' : 'daytime';
  return 'daytime';
}

/* The bands drawn on the day scrubber for one day. */
export type Band = { from: number; to: number; kind: 'daytime' | 'evening' | 'bar' | 'closed' };

export function bandsFor(day: number): Band[] {
  const hours = HOURS[day];
  if (!hours) return [{ from: DAY_START, to: DAY_END, kind: 'closed' }];
  const marks = new Set<number>([DAY_START, DAY_END, hours.from, hours.to]);
  for (const id of ['daytime', 'evening'] as const) {
    const k = KITCHEN[id][day];
    if (k) {
      marks.add(k.from);
      marks.add(k.to);
    }
  }
  const points = [...marks].filter((p) => p >= DAY_START && p <= DAY_END).sort((a, b) => a - b);
  const bands: Band[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const s = stateAt({ day, min: from });
    const kind: Band['kind'] = !s.open ? 'closed' : s.menu ?? 'bar';
    const last = bands[bands.length - 1];
    if (last && last.kind === kind) last.to = to;
    else bands.push({ from, to, kind });
  }
  return bands;
}
