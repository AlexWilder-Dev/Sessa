import { useCallback, useMemo, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DAYS, DAYS_SHORT, HEADLINE_PRICES } from '../data/sessa';
import { useClock } from '../lib/clock';
import { DAY_END, DAY_START, bandsFor, clock, clockParts, type Band, type DayState } from '../lib/time';
import { OpenSign } from '../components/OpenSign';

/* Tuesday first: that's how Sessa's week runs. Monday sits at the end. */
const DAY_ORDER = [2, 3, 4, 5, 6, 0, 1];
const SPAN = DAY_END - DAY_START;
const STEP = 5;
const pct = (min: number) => ((min - DAY_START) / SPAN) * 100;
const clamp = (min: number) => Math.min(DAY_END, Math.max(DAY_START, min));

const BAND_LABEL: Record<Band['kind'], [string, string]> = {
  daytime: ['Daytime menu', 'Daytime'],
  evening: ['Evening menu', 'Evening'],
  bar: ['Bar', 'Bar'],
  closed: ['Closed', 'Closed'],
};

function Track({ day, min, onChange }: { day: number; min: number; onChange: (min: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const bands = useMemo(() => bandsFor(day), [day]);

  const fromPointer = useCallback(
    (clientX: number) => {
      const r = ref.current!.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      onChange(clamp(Math.round((DAY_START + t * SPAN) / STEP) * STEP));
    },
    [onChange],
  );

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
    fromPointer(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e.clientX);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const big = e.shiftKey ? 60 : 15;
    const moves: Record<string, number> = {
      ArrowRight: min + big,
      ArrowUp: min + big,
      ArrowLeft: min - big,
      ArrowDown: min - big,
      PageUp: min + 60,
      PageDown: min - 60,
      Home: DAY_START,
      End: DAY_END,
    };
    if (e.key in moves) {
      e.preventDefault();
      onChange(clamp(moves[e.key]));
    }
  };

  const hours = Array.from({ length: SPAN / 60 + 1 }, (_, i) => DAY_START + i * 60);

  return (
    <div className="track-wrap">
      <div className="track-bands" aria-hidden="true">
        {bands.map((b) => (
          <div
            key={`${b.from}-${b.kind}`}
            className={`band band-${b.kind} ${b.to - b.from < 120 ? 'is-narrow' : ''}`}
            style={{ left: `${pct(b.from)}%`, width: `${pct(b.to) - pct(b.from)}%` }}
          >
            <span className="band-long">{BAND_LABEL[b.kind][0]}</span>
            <span className="band-short">{BAND_LABEL[b.kind][1]}</span>
          </div>
        ))}
      </div>
      <div
        ref={ref}
        className="track"
        role="slider"
        tabIndex={0}
        aria-label={`Time on ${DAYS[day]}`}
        aria-valuemin={DAY_START}
        aria-valuemax={DAY_END}
        aria-valuenow={min}
        aria-valuetext={`${DAYS[day]}, ${clock(min)}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      >
        <div className="track-rail" />
        <div className="track-fill" style={{ width: `${pct(min)}%` }} />
        <div className="track-ticks" aria-hidden="true">
          {hours.map((h) => (
            <span key={h} className={`tick ${((h - DAY_START) / 60) % 2 ? 'tick-odd' : ''}`} style={{ left: `${pct(h)}%` }}>
              <i />
              <b>{clock(h).replace(/(am|pm)$/, '')}</b>
            </span>
          ))}
        </div>
        <div className="track-handle" style={{ left: `${pct(min)}%` }}>
          <span className="handle-knob" />
        </div>
      </div>
    </div>
  );
}

function Board({ s }: { s: DayState }) {
  let title = 'On now';
  let items = s.board.map((b) => ({ ...b, faded: false }));

  if (!s.open) {
    title = s.phase === 'closed-day' ? 'Closed Mondays' : 'Closed';
    items = [];
  } else if (!s.menu) {
    title = 'Bar’s open';
    items = [
      { name: 'Fresh white or red', price: HEADLINE_PRICES.glass.price, when: 'a glass', faded: false },
      { name: 'House Martini', price: HEADLINE_PRICES.martini.price, faded: false },
      ...items,
    ];
  }
  const later = s.later.map((b) => ({ ...b, faded: true }));

  return (
    <div className="board" aria-live="polite">
      <div className="board-slate">
        <p className="board-title chalk">{title}</p>
        <ul className="board-list">
          <AnimatePresence initial={false} mode="popLayout">
            {[...items, ...later].map((it) => (
              <m.li
                key={it.name}
                className={`chalk ${it.faded ? 'is-later' : ''}`}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.3 }}
              >
                <span className="board-name">
                  {it.name}
                  {it.when && <em> – {it.when}</em>}
                </span>
                <span className="board-price">{it.price}</span>
              </m.li>
            ))}
          </AnimatePresence>
          {!s.open && <li className="chalk board-next">{s.next}</li>}
        </ul>
      </div>
    </div>
  );
}

export function DayScrubber() {
  const { now, view, setView, scrubbing } = useClock();
  const min = clamp(view.min);
  const outside = !scrubbing && (now.min < DAY_START || now.min > DAY_END);
  const { hm, suffix } = clockParts(view.min);

  const setMin = useCallback((m: number) => setView({ day: view.day, min: m }), [setView, view.day]);

  return (
    <section className="section day" id="day" aria-labelledby="day-title">
      <div className="wrap">
        <div className="day-head">
          <div>
            <p className="label eyebrow">Sessa, hour by hour</p>
            <h2 id="day-title" className="h-l rough">
              Morning to <em>martini.</em>
            </h2>
          </div>
          <p className="day-intro">
            It starts at the time it is in Herne Hill right now. Drag along the bar, or pick a day, and the page
            follows: doors, kitchen, what’s on the board, and the light.
          </p>
        </div>

        <div className="day-picker" role="group" aria-label="Day of the week">
          {DAY_ORDER.map((d) => (
            <button
              key={d}
              className={`day-btn ${view.day === d ? 'is-on' : ''} ${d === 1 ? 'is-closed' : ''} ${now.day === d ? 'is-today' : ''}`}
              aria-pressed={view.day === d}
              onClick={() => setView({ day: d, min })}
            >
              <span>{DAYS_SHORT[d]}</span>
              {d === 1 && <small>closed</small>}
              {now.day === d && d !== 1 && <small>today</small>}
            </button>
          ))}
        </div>

        <Track day={view.day} min={min} onChange={setMin} />

        <div className="day-grid">
          <div className="day-readout">
            <div className="readout-top">
              <OpenSign open={view.open} size={96} />
              <p className="readout-time" aria-live="polite">
                <span className="readout-day">{DAYS[view.day]}</span>
                <span className="readout-clock">
                  {hm}
                  <small>{suffix}</small>
                </span>
              </p>
            </div>
            <p className="readout-mood">{view.mood}</p>
            <dl className="ledger">
              <div>
                <dt className="label">Doors</dt>
                <dd>{view.doors}</dd>
              </div>
              <div>
                <dt className="label">Kitchen</dt>
                <dd>{view.kitchen}</dd>
              </div>
              {view.next && (
                <div>
                  <dt className="label">Next</dt>
                  <dd>{view.next}</dd>
                </div>
              )}
            </dl>
            <div className="day-actions">
              {scrubbing ? (
                <button className="btn btn-line" onClick={() => setView(null)}>
                  Back to now <span className="arrow">↺</span>
                </button>
              ) : outside ? (
                <p className="day-note">
                  It’s {clock(now.min)} in Herne Hill. The bar runs nine till late, so we’ve started you at the edge.
                </p>
              ) : (
                <p className="day-note">That’s right now.</p>
              )}
              {view.menu && (
                <Link className="link" to="/menus" state={{ tab: view.menu }}>
                  See the {view.menu} menu
                </Link>
              )}
            </div>
          </div>
          <Board s={view} />
        </div>
      </div>
    </section>
  );
}
