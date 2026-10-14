import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { londonNow, readAtParam, stateAt, type DayState, type Moment } from './time';
import { applyPalette, paletteFor } from './palette';

type Clock = {
  /* The real London time, or the ?at= override. */
  now: DayState;
  /* What the page is showing: the scrubbed time, or now. */
  view: DayState;
  scrubbing: boolean;
  demo: boolean;
  setView: (m: Moment | null) => void;
};

const ClockContext = createContext<Clock | null>(null);

const AT = readAtParam();

export function initialMoment(): Moment {
  return AT ?? londonNow();
}

export function ClockProvider({ children }: { children: ReactNode }) {
  const [nowMoment, setNow] = useState<Moment>(initialMoment);
  const [scrub, setScrub] = useState<Moment | null>(null);

  useEffect(() => {
    if (AT) return;
    const id = window.setInterval(() => setNow(londonNow()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo<Clock>(() => {
    const now = stateAt(nowMoment);
    const view = scrub ? stateAt(scrub) : now;
    return {
      now,
      view,
      scrubbing: !!scrub && (scrub.day !== nowMoment.day || scrub.min !== nowMoment.min),
      demo: !!AT,
      setView: setScrub,
    };
  }, [nowMoment, scrub]);

  useEffect(() => {
    applyPalette(paletteFor(value.view));
    const root = document.documentElement;
    root.dataset.lights = value.view.open ? 'on' : 'off';
    root.dataset.hour = String(Math.floor(value.view.min / 60));
  }, [value.view]);

  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
}

export function useClock(): Clock {
  const c = useContext(ClockContext);
  if (!c) throw new Error('useClock outside ClockProvider');
  return c;
}
