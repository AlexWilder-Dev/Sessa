import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { BOTTLES, BY_THE_GLASS, COUNTRIES, FIZZ_NOTE, STYLES, type Bottle, type StyleId } from '../data/sessa';
import { useTitle } from '../lib/title';
import { Words } from '../components/Reveal';
import { useScrollTo } from '../components/Smooth';
import { SWATCH } from '../sections/Bar';

const LOW = Math.min(...BOTTLES.map((b) => b.price));
const HIGH = Math.max(...BOTTLES.map((b) => b.price));
const chilled = (b: Bottle) => b.note === 'Chilled' || b.note === 'Available chilled';

function Range({ lo, hi, set }: { lo: number; hi: number; set: (lo: number, hi: number) => void }) {
  const at = (v: number) => `${((v - LOW) / (HIGH - LOW)) * 100}%`;
  return (
    <div className="price-range">
      <output className="sc" aria-live="polite">
        £{lo} – £{hi}
      </output>
      <div className="range">
        <span className="range-fill" style={{ left: at(lo), right: `calc(100% - ${at(hi)})` }} />
        <input
          type="range"
          min={LOW}
          max={HIGH}
          value={lo}
          aria-label="Lowest price"
          aria-valuetext={`£${lo}`}
          onChange={(e) => set(Math.min(Number(e.target.value), hi - 2), hi)}
        />
        <input
          type="range"
          min={LOW}
          max={HIGH}
          value={hi}
          aria-label="Highest price"
          aria-valuetext={`£${hi}`}
          onChange={(e) => set(lo, Math.max(Number(e.target.value), lo + 2))}
        />
      </div>
    </div>
  );
}

function Row({ b }: { b: Bottle }) {
  const where = [b.region, b.country ? (COUNTRIES[b.country] ?? b.country) : null].filter(Boolean).join(', ');
  return (
    <li className="bottle">
      <span className="v lnum">{b.vintage}</span>
      <span>
        <span className="n">
          {b.name}
          {b.producer && (
            <>
              , <i>{b.producer}</i>
            </>
          )}
        </span>
        <span className="m">
          {[b.grape, where].filter(Boolean).join(' · ')}
          {b.note && (
            <>
              {' · '}
              <b>{b.note.toLowerCase()}</b>
            </>
          )}
        </span>
      </span>
      <span className="p">£{b.price}</span>
    </li>
  );
}

export function Wine() {
  useTitle('Find a bottle');
  const [params, setParams] = useSearchParams();
  const raw = params.get('style');
  const style: StyleId | 'all' = STYLES.some((s) => s.id === raw) ? (raw as StyleId) : 'all';
  const [lo, setLo] = useState(LOW);
  const [hi, setHi] = useState(HIGH);
  const [cold, setCold] = useState(false);
  const stylesRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollTo = useScrollTo();
  const first = useRef(true);

  // Keep the chosen style in view in the sideways-scrolling row.
  useEffect(() => {
    const row = stylesRef.current;
    const on = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && on) row.scrollTo({ left: Math.max(0, on.offsetLeft - (row.clientWidth - on.offsetWidth) / 2) });
  }, [style]);

  // When a filter shortens the list, bring its top back out from under the filters.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const list = listRef.current;
    const bar = filtersRef.current;
    if (!list || !bar) return;
    const b = bar.getBoundingClientRect();
    const beside = b.right <= list.getBoundingClientRect().left;
    const under = beside ? b.top : b.bottom + 12;
    const top = list.getBoundingClientRect().top;
    if (top < under) scrollTo(window.scrollY + top - under, true);
  }, [style, lo, hi, cold]); // eslint-disable-line react-hooks/exhaustive-deps

  const matching = useMemo(
    () => BOTTLES.filter((b) => b.price >= lo && b.price <= hi && (!cold || chilled(b))),
    [lo, hi, cold],
  );
  const shown = style === 'all' ? matching : matching.filter((b) => b.style === style);
  const count = (id: StyleId | 'all') => (id === 'all' ? matching.length : matching.filter((b) => b.style === id).length);
  const pickStyle = (id: StyleId | 'all') => setParams(id === 'all' ? {} : { style: id }, { replace: true });
  const reset = () => {
    setLo(LOW);
    setHi(HIGH);
    setCold(false);
    pickStyle('all');
  };
  const filtered = style !== 'all' || cold || lo !== LOW || hi !== HIGH;

  const sections = STYLES.map((s) => ({ ...s, list: shown.filter((b) => b.style === s.id) })).filter(
    (s) => s.list.length > 0,
  );

  return (
    <div className="page">
      <header className="page-head wrap">
        <span className="eyebrow sc">Wine</span>
        <h1 className="poster">
          <Words text="Find a bottle." italicFrom={1} />
        </h1>
        <p className="lede">
          {BOTTLES.length} bottles, low-intervention but “non-funky”, set out the way the printed list is. From £6.50 a
          glass, too: {BY_THE_GLASS.length} by the glass,{' '}
          <Link className="link" to="/menus?tab=drinks">
            here
          </Link>
          .
        </p>
      </header>

      <div className="wrap wine-layout">
        <aside className="filters" aria-label="Filter the list" ref={filtersRef}>
          <div className="styles" role="group" aria-label="Style" ref={stylesRef}>
            {(['all', ...STYLES.map((s) => s.id)] as (StyleId | 'all')[]).map((id) => {
              const n = count(id);
              return (
                <button key={id} aria-pressed={style === id} className={n === 0 ? 'empty' : ''} onClick={() => pickStyle(id)}>
                  <i style={{ background: id === 'all' ? 'transparent' : SWATCH[id] }} aria-hidden="true" />
                  {id === 'all' ? 'Everything' : STYLES.find((s) => s.id === id)!.short}
                  <small>{n}</small>
                </button>
              );
            })}
          </div>
          <div className="filter-row">
            <Range
              lo={lo}
              hi={hi}
              set={(a, b) => {
                setLo(a);
                setHi(b);
              }}
            />
            <button className="toggle" role="switch" aria-checked={cold} onClick={() => setCold((c) => !c)}>
              <i aria-hidden="true" />
              Serve chilled
            </button>
            <p className="count" aria-live="polite">
              {shown.length} {shown.length === 1 ? 'bottle' : 'bottles'}
              {filtered && <button onClick={reset}>Reset</button>}
            </p>
          </div>
        </aside>

        <div className="sheet-list" ref={listRef}>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={`${style}-${lo}-${hi}-${cold}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {sections.length === 0 && (
                <p className="wine-empty">
                  {style !== 'all' && matching.length > 0 ? (
                    <>
                      Nothing under “{STYLES.find((s) => s.id === style)!.short}” fits that, but {matching.length}{' '}
                      {matching.length === 1 ? 'other bottle does' : 'other bottles do'}.{' '}
                      <button onClick={() => pickStyle('all')}>Show {matching.length === 1 ? 'it' : 'them'}</button>
                    </>
                  ) : (
                    <>
                      Nothing on the list fits that. <button onClick={reset}>Show everything</button>
                    </>
                  )}
                </p>
              )}
              {sections.map((s) => {
                const groups = [...new Set(s.list.map((b) => b.group ?? ''))];
                const prices = s.list.map((b) => b.price);
                return (
                  <section key={s.id} className="wine-style" aria-labelledby={`h-${s.id}`}>
                    <header>
                      <h2 id={`h-${s.id}`}>{s.title}</h2>
                      <p>
                        {s.list.length} {s.list.length === 1 ? 'bottle' : 'bottles'}, £{Math.min(...prices)}
                        {prices.length > 1 && ` – £${Math.max(...prices)}`}
                      </p>
                    </header>
                    {s.note && <p className="cellar-note">{s.note}</p>}
                    {s.id === 'fizz' && <p className="style-note">{FIZZ_NOTE}</p>}
                    {groups.map((g) => (
                      <div key={g || 'list'} className="wine-group">
                        {g && <h3 className="sc">{g}</h3>}
                        <ol>
                          {s.list
                            .filter((b) => (b.group ?? '') === g)
                            .map((b) => (
                              <Row key={`${b.vintage}${b.name}${b.producer}`} b={b} />
                            ))}
                        </ol>
                      </div>
                    ))}
                  </section>
                );
              })}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
