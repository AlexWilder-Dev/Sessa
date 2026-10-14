import {
  COCKTAILS,
  DAYS,
  DAYS_SHORT,
  DAYTIME_MENU,
  EVENING_MENU,
  HOURS,
  KITCHEN,
  SUPPLIERS,
  type MenuId,
  type Span,
} from '../data/sessa';

/* A moment in Sessa's week: day 0 = Sunday, minutes after midnight in London. */
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
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  const day = DAYS_SHORT.indexOf(get('weekday'));
  return { day: day < 0 ? date.getDay() : day, min: Number(get('hour')) * 60 + Number(get('minute')) };
}

/* ?at=sat-11:30 (also sat-1130, saturday-11:30, fri-21) */
export function parseAt(value: string | null): Moment | null {
  const m = value?.trim().toLowerCase().match(/^([a-z]{3})[a-z]*[-_ ]?(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return null;
  const day = DAYS_SHORT.findIndex((d) => d.toLowerCase() === m[1]);
  const h = Number(m[2]);
  const min = Number(m[3] ?? 0);
  if (day < 0 || h > 23 || min > 59) return null;
  return { day, min: h * 60 + min };
}

export function readAt(): Moment | null {
  const direct = new URLSearchParams(window.location.search).get('at');
  const inHash = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('at');
  return parseAt(direct ?? inHash);
}

/* 9am, 11:30am, 10:30pm */
export function clock(min: number): string {
  const h24 = Math.floor(min / 60) % 24;
  const m = min % 60;
  const h = h24 % 12 || 12;
  const suffix = h24 < 12 ? 'am' : 'pm';
  return m ? `${h}:${String(m).padStart(2, '0')}${suffix}` : `${h}${suffix}`;
}

const WORDS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
const hourWord = (h: number) => (h % 24 === 12 ? 'midday' : WORDS[h % 12]);

/* "half past eleven", "nine", "quarter to six" */
export function spoken(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return hourWord(h);
  if (m === 15) return `quarter past ${hourWord(h)}`;
  if (m === 30) return `half past ${hourWord(h)}`;
  if (m === 45) return `quarter to ${hourWord(h + 1)}`;
  return clock(min);
}

function partOfDay(min: number): string {
  if (min < 12 * 60) return 'in the morning';
  if (min < 17 * 60) return 'in the afternoon';
  if (min < 21 * 60) return 'in the evening';
  return 'at night';
}

/* The heading of the sentence: "Saturday, half past eleven in the morning." */
export function whenText(m: Moment): string {
  const words = spoken(m.min);
  if (/\d/.test(words)) return `${DAYS[m.day]}, ${words}.`;
  if (words === 'midday') return `${DAYS[m.day]}, midday.`;
  const oclock = m.min % 60 === 0 ? ' o’clock' : '';
  return `${DAYS[m.day]}, ${words}${oclock} ${partOfDay(m.min)}.`;
}

const within = (span: Span | null | undefined, min: number) => !!span && min >= span.from && min < span.to;

export type Phase = 'closed-day' | 'before-open' | 'after-close' | 'daytime' | 'between' | 'evening' | 'bar';

/* A run of text, with dish and drink names marked for emphasis. */
export type Part = string | { em: string };

export type DayState = Moment & {
  open: boolean;
  hours: Span | null;
  menu: MenuId | null;
  phase: Phase;
  doors: string;
  kitchen: string;
  next: string | null;
  story: Part[];
};

function nextOpening(m: Moment): { text: string; spokenText: string } {
  for (let i = 0; i < 8; i++) {
    const day = (m.day + i) % 7;
    const span = HOURS[day];
    if (!span || (i === 0 && m.min >= span.from)) continue;
    const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : `on ${DAYS[day]}`;
    return {
      text: `Opens ${when === `on ${DAYS[day]}` ? DAYS[day] : when} at ${clock(span.from)}`,
      spokenText: `Back ${when} at ${spoken(span.from)}.`,
    };
  }
  return { text: '', spokenText: '' };
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const keepCase = (s: string) => (/^(Gilda|Pyefleet|Spanish|Westcombe)/.test(s) ? s : lower(s));

function garibaldi(m: Moment): Part[] {
  const g = COCKTAILS.find((c) => c.window && c.days);
  if (!g?.window || !g.days?.includes(m.day)) return [];
  if (within(g.window, m.min)) return [' ', { em: 'Garibaldis' }, ` until ${spoken(g.window.to)}.`];
  if (m.min < g.window.from) return [' ', { em: 'Garibaldis' }, ` from ${spoken(g.window.from)}.`];
  return [];
}

function storyFor(m: Moment, phase: Phase, hours: Span | null): Part[] {
  const day = m.day;
  const dayK = KITCHEN.daytime[day];
  const eveK = KITCHEN.evening[day];
  switch (phase) {
    case 'closed-day':
      return [`We’re closed on Mondays. ${nextOpening(m).spokenText}`];
    case 'before-open':
      return [`Not open yet. Doors at ${spoken(hours!.from)}.`];
    case 'after-close':
      return hours!.to <= 18 * 60
        ? [`We closed at ${spoken(hours!.to)}. ${nextOpening(m).spokenText}`]
        : [`We’ve closed for the night. ${nextOpening(m).spokenText}`];
    case 'daytime': {
      const parts: Part[] = [`The daytime menu’s on until ${spoken(dayK!.to)}.`];
      if (m.min < 12 * 60) {
        const coffee = SUPPLIERS.find((s) => s.what === 'Coffee')!.who;
        const pastry = SUPPLIERS.find((s) => s.what === 'Pastries')!.who;
        parts.push(' ', { em: `${coffee} coffee` }, ' and ', { em: `${pastry} pastries` }, '.');
      }
      const dishes = DAYTIME_MENU.flat();
      const sandwich = dishes.find((d) => d.from !== undefined)!;
      const name = lower(sandwich.name);
      if (m.min < sandwich.from!) parts.push(' The ', { em: name }, ` comes on at ${spoken(sandwich.from!)}.`);
      else if (m.min < sandwich.from! + 30) parts.push(' The ', { em: name }, ' has just come on.');
      else parts.push(' There’s the ', { em: name }, '.');
      const tortilla = dishes.find((d) => d.days?.includes(day));
      if (tortilla) parts.push(' It’s the weekend, so there’s ', { em: keepCase(tortilla.name) }, '.');
      parts.push(...garibaldi(m));
      return parts;
    }
    case 'between':
      return [
        'The kitchen’s between menus, so it’s the bar for now: ',
        { em: '£6.50' },
        ' a glass, ',
        { em: '£7' },
        ' for the house martini. The evening menu starts at ',
        `${spoken(eveK!.from)}.`,
      ];
    case 'evening': {
      const featured = EVENING_MENU.flat().filter((d) => d.feature);
      const parts: Part[] = [`The evening menu’s on until ${spoken(eveK!.to)}: `];
      featured.forEach((d, i) => {
        parts.push({ em: keepCase(d.name) });
        parts.push(i < featured.length - 2 ? ', ' : i === featured.length - 2 ? ' and ' : '.');
      });
      return parts;
    }
    case 'bar': {
      const kitchenDone = eveK ? 'The kitchen’s closed' : 'The kitchen’s finished for the day';
      return [`${kitchenDone}; the bar’s open until ${spoken(hours!.to)}.`, ...garibaldi(m)];
    }
  }
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
  else phase = KITCHEN.evening[m.day] && m.min < KITCHEN.evening[m.day]!.from ? 'between' : 'bar';

  const dayK = KITCHEN.daytime[m.day];
  const eveK = KITCHEN.evening[m.day];
  const kitchen =
    phase === 'daytime'
      ? `Daytime menu until ${clock(dayK!.to)}`
      : phase === 'evening'
        ? `Evening menu until ${clock(eveK!.to)}`
        : phase === 'between'
          ? `Between menus · evening menu from ${clock(eveK!.from)}`
          : phase === 'bar'
            ? 'Kitchen closed · bar open'
            : 'Closed';

  let next: string | null = null;
  if (!open) next = nextOpening(m).text;
  else if (phase === 'daytime') next = eveK ? `Evening menu from ${clock(eveK.from)}` : `Bar until ${clock(hours!.to)}`;
  else next = `Doors close at ${clock(hours!.to)}`;

  return {
    ...m,
    open,
    hours,
    menu,
    phase,
    doors: open ? `Open until ${clock(hours!.to)}` : 'Closed',
    kitchen,
    next,
    story: storyFor(m, phase, hours),
  };
}

/* Which menu to show first. */
export function defaultMenu(s: DayState): MenuId {
  if (s.menu) return s.menu;
  if ((s.phase === 'between' || s.phase === 'bar') && KITCHEN.evening[s.day]) return 'evening';
  return 'daytime';
}

/* Kitchen spans drawn along the day rail. */
export function railSpans(day: number) {
  const hours = HOURS[day];
  return {
    hours,
    daytime: KITCHEN.daytime[day],
    evening: KITCHEN.evening[day],
  };
}
