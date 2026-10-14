import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import {
  BOTTLES,
  BY_THE_GLASS,
  COUNTRIES,
  FIZZ_NOTE,
  HEADLINE_PRICES,
  WINE_STYLES,
  type Bottle,
  type StyleId,
} from '../data/sessa';

const PRICE_MIN = Math.min(...BOTTLES.map((b) => b.price));
const PRICE_MAX = Math.max(...BOTTLES.map((b) => b.price));
const isChilled = (b: Bottle) => b.note === 'Chilled' || b.note === 'Available chilled';
const CHILLED_COUNT = BOTTLES.filter(isChilled).length;

function PriceRange({
  lo,
  hi,
  onChange,
}: {
  lo: number;
  hi: number;
  onChange: (lo: number, hi: number) => void;
}) {
  const pos = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  return (
    <div className="range">
      <div className="range-read">
        <span className="label">Price</span>
        <span className="range-values">
          £{lo} – £{hi}
        </span>
      </div>
      <div className="range-track">
        <div className="range-rail" />
        <div className="range-fill" style={{ left: `${pos(lo)}%`, right: `${100 - pos(hi)}%` }} />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={1}
          value={lo}
          aria-label="Lowest price"
          aria-valuetext={`£${lo}`}
          onChange={(e) => onChange(Math.min(Number(e.target.value), hi - 4), hi)}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={1}
          value={hi}
          aria-label="Highest price"
          aria-valuetext={`£${hi}`}
          onChange={(e) => onChange(lo, Math.max(Number(e.target.value), lo + 4))}
        />
      </div>
    </div>
  );
}

function BottleRow({ b }: { b: Bottle }) {
  const where = [b.region, b.country ? COUNTRIES[b.country] ?? b.country : null].filter(Boolean).join(', ');
  return (
    <li className="bottle">
      <span className="b-vintage">{b.vintage}</span>
      <div className="b-main">
        <span className="b-name">{b.name}</span>
        {b.producer && <span className="b-producer">{b.producer}</span>}
      </div>
      <span className="b-meta">
        <span className="b-grape">{b.grape}</span>
        <span className="b-where">{where}</span>
      </span>
      <span className="b-note">{b.note && <span className={`note note-${b.note.replace(/\W+/g, '-').toLowerCase()}`}>{b.note}</span>}</span>
      <span className="b-price price">£{b.price}</span>
    </li>
  );
}

export function Wine() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('style');
  const style: StyleId | 'all' = WINE_STYLES.some((s) => s.id === raw) ? (raw as StyleId) : 'all';
  const [lo, setLo] = useState(PRICE_MIN);
  const [hi, setHi] = useState(PRICE_MAX);
  const [chilled, setChilled] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);

  // Keep the chosen style's chip in view in the sideways-scrolling row.
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>('.chip.is-on');
    if (!row || !chip) return;
    const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [style]);

  useEffect(() => {
    document.title = 'Find a bottle · Sessa, Herne Hill';
    return () => {
      document.title = 'Sessa · All-day bar & café, Herne Hill';
    };
  }, []);

  const matching = useMemo(
    () => BOTTLES.filter((b) => b.price >= lo && b.price <= hi && (!chilled || isChilled(b))),
    [lo, hi, chilled],
  );
  const shown = style === 'all' ? matching : matching.filter((b) => b.style === style);
  const countFor = (id: StyleId | 'all') =>
    id === 'all' ? matching.length : matching.filter((b) => b.style === id).length;

  const setStyle = (id: StyleId | 'all') => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('style');
    else next.set('style', id);
    setParams(next, { replace: true });
  };

  const reset = () => {
    setLo(PRICE_MIN);
    setHi(PRICE_MAX);
    setChilled(false);
    setStyle('all');
  };

  const filtered = lo !== PRICE_MIN || hi !== PRICE_MAX || chilled || style !== 'all';
  const filterKey = `${style}-${lo}-${hi}-${chilled}`;

  const sections = WINE_STYLES.filter((s) => style === 'all' || s.id === style)
    .map((s) => ({ ...s, bottles: shown.filter((b) => b.style === s.id) }))
    .filter((s) => s.bottles.length > 0);

  return (
    <div className="wine-page">
      <header className="page-head wrap wine-head">
        <div>
          <p className="label eyebrow">Wine</p>
          <h1 className="h-xl rough-lg">Find a bottle</h1>
          <p className="lede">
            {BOTTLES.length} low-intervention bottles, sorted by style, plus a cellar list priced at small margins. A
            sample of the list: bottles come and go.
          </p>
        </div>
        <aside className="glass-note">
          <p className="label">Or by the glass</p>
          <p className="glass-note-big">
            <span className="price">{HEADLINE_PRICES.glass.price}</span>
            <span>a glass of fresh white or red</span>
          </p>
          <p>
            {BY_THE_GLASS.length} wines by the glass, 125ml.{' '}
            <Link className="link" to="/menus?tab=drinks">
              See them
            </Link>
          </p>
        </aside>
      </header>

      <div className="finder">
        <div className="wrap">
          <div className="chips" role="group" aria-label="Style" ref={chipsRef}>
            {(['all', ...WINE_STYLES.map((s) => s.id)] as (StyleId | 'all')[]).map((id) => {
              const s = WINE_STYLES.find((w) => w.id === id);
              const n = countFor(id);
              return (
                <button
                  key={id}
                  className={`chip chip-${id} ${style === id ? 'is-on' : ''} ${n === 0 ? 'is-empty' : ''}`}
                  aria-pressed={style === id}
                  onClick={() => setStyle(id)}
                >
                  {s ? s.short : 'All'}
                  <small>{n}</small>
                </button>
              );
            })}
          </div>
          <div className="finder-row">
            <button
              className={`finder-price-btn ${priceOpen ? 'is-open' : ''}`}
              aria-expanded={priceOpen}
              aria-controls="price-panel"
              onClick={() => setPriceOpen((o) => !o)}
            >
              <span className="label">Price</span> £{lo} – £{hi}
            </button>
            <div id="price-panel" className={`finder-price ${priceOpen ? 'is-open' : ''}`}>
              <PriceRange
                lo={lo}
                hi={hi}
                onChange={(a, b) => {
                  setLo(a);
                  setHi(b);
                }}
              />
            </div>
            <button
              role="switch"
              aria-checked={chilled}
              className={`toggle ${chilled ? 'is-on' : ''}`}
              onClick={() => setChilled((c) => !c)}
            >
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-knob" />
              </span>
              Serve chilled <small>({CHILLED_COUNT})</small>
            </button>
            <p className="finder-count" aria-live="polite">
              {shown.length} {shown.length === 1 ? 'bottle' : 'bottles'}
              {filtered && (
                <button className="finder-reset" onClick={reset}>
                  Reset
                </button>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="wrap wine-list">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={filterKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {sections.length === 0 && (
              <div className="wine-empty">
                <p className="h-m">Nothing on the list fits that.</p>
                <p>Try a wider price range, or turn off “Serve chilled”.</p>
                <button className="btn btn-line" onClick={reset}>
                  Show everything
                </button>
              </div>
            )}
            {sections.map((s) => {
              const groups = [...new Set(s.bottles.map((b) => b.group ?? ''))];
              const prices = s.bottles.map((b) => b.price);
              return (
                <section key={s.id} className={`wine-style wine-${s.id}`} aria-labelledby={`style-${s.id}`}>
                  <header className="wine-style-head">
                    <h2 id={`style-${s.id}`}>{s.title}</h2>
                    <p>
                      {s.bottles.length} {s.bottles.length === 1 ? 'bottle' : 'bottles'} · £{Math.min(...prices)}
                      {prices.length > 1 && ` – £${Math.max(...prices)}`}
                    </p>
                  </header>
                  {s.note && <p className="cellar-note">{s.note}</p>}
                  {s.id === 'fizz' && <p className="fizz-note">{FIZZ_NOTE}</p>}
                  {groups.map((g) => (
                    <div key={g || 'all'} className="wine-group">
                      {g && <h3 className="label">{g}</h3>}
                      <ol className="bottles">
                        {s.bottles
                          .filter((b) => (b.group ?? '') === g)
                          .map((b) => (
                            <BottleRow key={`${b.vintage}-${b.name}-${b.producer}`} b={b} />
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
  );
}
