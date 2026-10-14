import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { londonNow, readAt, stateAt, type DayState, type Moment } from './time';
import { applyLight } from './light';

type Clock = {
  /* London time now, or the ?at= override. */
  now: DayState;
  /* What the page is showing: the moment picked on the day rail, or now. */
  view: DayState;
  picked: boolean;
  pick: (m: Moment | null) => void;
};

const ClockContext = createContext<Clock | null>(null);
const AT = readAt();
export const startMoment = (): Moment => AT ?? londonNow();

export function ClockProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<Moment>(startMoment);
  const [picked, pick] = useState<Moment | null>(null);

  useEffect(() => {
    if (AT) return;
    const id = window.setInterval(() => setNow(londonNow()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo<Clock>(() => {
    const nowState = stateAt(now);
    const view = picked ? stateAt(picked) : nowState;
    return {
      now: nowState,
      view,
      picked: !!picked && (picked.day !== now.day || picked.min !== now.min),
      pick,
    };
  }, [now, picked]);

  useEffect(() => applyLight(value.view), [value.view]);

  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
}

export function useClock() {
  const c = useContext(ClockContext);
  if (!c) throw new Error('useClock needs ClockProvider');
  return c;
}
