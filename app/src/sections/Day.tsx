import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { DAYS_SHORT, QUOTES } from '../data/sessa';
import { useClock } from '../lib/clock';
import { DAY_END, DAY_START, clock, railSpans, whenText, type DayState } from '../lib/time';
import { media } from '../lib/media';

const ORDER = [2, 3, 4, 5, 6, 0, 1]; // Tuesday first; Monday, when they're shut, at the end
const SPAN = DAY_END - DAY_START;
const pct = (min: number) => `${((min - DAY_START) / SPAN) * 100}%`;
const clamp = (min: number) => Math.min(DAY_END, Math.max(DAY_START, min));

/* What the room looks like at that hour. */
function shotFor(s: DayState) {
  if (!s.open) return { src: 'quince-1100.jpg', alt: 'Oil painting of quinces on a red ground, by Katia', art: true };
  if (s.phase === 'daytime' && s.min < 12 * 60)
    return { src: 'room-day-900.jpg', alt: 'The room in the morning, light coming in off Railton Road' };
  if (s.phase === 'daytime') return { src: 'lunch-700.jpg', alt: 'A salad being plated in the kitchen' };
  if (s.phase === 'evening') return { src: 'dinner-700.jpg', alt: 'Dinner on the red-splattered tables: a stew, fried pasta, red wine' };
  if (s.phase === 'bar' && s.min >= 21 * 60)
    return { src: 'window-night-860.jpg', alt: 'Late, through the front window: full tables and candles' };
  return { src: 'bar-afternoon-700.jpg', alt: 'A cocktail, a martini and a porter on the bar' };
}

function Rail({ day, min, onChange }: { day: number; min: number; onChange: (min: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { hours, daytime, evening } = railSpans(day);

  const fromX = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (x - r.left) / r.width));
    onChange(clamp(Math.round((DAY_START + k * SPAN) / 5) * 5));
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
    fromX(e.clientX);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) fromX(e.clientX);
  };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 60 : 15;
    const to: Record<string, number> = {
      ArrowRight: min + step,
      ArrowUp: min + step,
      ArrowLeft: min - step,
      ArrowDown: min - step,
      PageUp: min + 60,
      PageDown: min - 60,
      Home: DAY_START,
      End: DAY_END,
    };
    if (e.key in to) {
      e.preventDefault();
      onChange(clamp(to[e.key]));
    }
  };

  const hourMarks = Array.from({ length: SPAN / 60 + 1 }, (_, i) => DAY_START + i * 60);
  const seg = (s: { from: number; to: number }) => ({ left: pct(s.from), width: `calc(${pct(s.to)} - ${pct(s.from)})` });

  return (
    <div
      ref={ref}
      className="rail"
      role="slider"
      tabIndex={0}
      aria-label="Time of day"
      aria-valuemin={DAY_START}
      aria-valuemax={DAY_END}
      aria-valuenow={min}
      aria-valuetext={clock(min)}
      onPointerDown={down}
      onPointerMove={move}
      onKeyDown={key}
    >
      <span className="rail-line" />
      {hours && <span className="rail-open" style={seg(hours)} />}
      {daytime && (
        <span className="rail-span daytime" style={seg(daytime)}>
          <span className="sc">daytime menu</span>
        </span>
      )}
      {evening && (
        <span className="rail-span evening" style={seg(evening)}>
          <span className="sc">evening menu</span>
        </span>
      )}
      <span className="rail-hours lnum" aria-hidden="true">
        {hourMarks.map((h, i) => (
          <span key={h} className={i % 2 ? 'odd' : ''} style={{ left: pct(h) }}>
            {i === 0 || i === hourMarks.length - 1 ? clock(h) : clock(h).replace(/am|pm/, '')}
          </span>
        ))}
      </span>
      <span className="rail-knob" style={{ left: pct(min) }}>
        <i />
      </span>
    </div>
  );
}

export function Day() {
  const { now, view, picked, pick } = useClock();
  const shot = shotFor(view);

  return (
    <section className="section day" id="day" aria-labelledby="day-title">
      <div className="wrap">
        <div className="day-head">
          <div>
            <span className="eyebrow sc">Morning to martini</span>
            <h2 id="day-title" className="title">
              Sessa, hour by hour.
            </h2>
          </div>
          <p>
            “{QUOTES.light.text[0].toUpperCase() + QUOTES.light.text.slice(1)},” wrote {QUOTES.light.where}. This
            page does the same. It’s set to the time in Herne Hill now; drag along the day, or pick another.
          </p>
        </div>

        <div className="days sc" role="group" aria-label="Day">
          {ORDER.map((d) => (
            <button
              key={d}
              className={d === 1 ? 'is-mon' : ''}
              aria-pressed={view.day === d}
              onClick={() => pick({ day: d, min: clamp(view.min) })}
            >
              {DAYS_SHORT[d]}
              {d === 1 && <small>closed</small>}
              {d === now.day && d !== 1 && <small>today</small>}
            </button>
          ))}
        </div>
        <Rail day={view.day} min={clamp(view.min)} onChange={(min) => pick({ day: view.day, min })} />

        <div className="day-body">
          <div>
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={`${view.day}-${view.phase}`}
                className="story"
                aria-live="polite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <span className="when">{whenText(view)}</span>
                {view.story.map((part, i) =>
                  typeof part === 'string' ? <span key={i}>{part}</span> : <em key={i}>{part.em}</em>,
                )}
              </m.p>
            </AnimatePresence>
            <dl className="facts">
              <div>
                <dt className="sc">Doors</dt>
                <dd>{view.doors}</dd>
              </div>
              <div>
                <dt className="sc">Kitchen</dt>
                <dd>{view.kitchen}</dd>
              </div>
              {view.next && (
                <div>
                  <dt className="sc">Next</dt>
                  <dd>{view.next}</dd>
                </div>
              )}
            </dl>
            <div className="day-foot">
              {picked ? (
                <button className="pill" onClick={() => pick(null)}>
                  Back to now
                </button>
              ) : (
                <span>
                  <em>That’s now, in Herne Hill.</em>
                </span>
              )}
              {view.menu && (
                <Link className="link" to="/menus" state={{ tab: view.menu }}>
                  See the {view.menu} menu
                </Link>
              )}
            </div>
          </div>
          <div className={`day-photo ${shot.art ? 'is-art' : ''}`}>
            <AnimatePresence initial={false}>
              <m.img
                key={shot.src}
                src={media(shot.src)}
                alt={shot.alt}
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
