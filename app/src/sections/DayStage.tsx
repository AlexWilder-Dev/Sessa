import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { DAYS, DAYS_SHORT, QUOTES } from '../data/sessa';
import { useClock } from '../lib/clock';
import { DAY_END, DAY_START, clock, railSpans, whenText, type DayState } from '../lib/time';
import { media } from '../lib/media';

const ORDER = [2, 3, 4, 5, 6, 0, 1]; // their week starts on Tuesday; Monday they're shut
const SPAN = DAY_END - DAY_START;
const PLAY_MS = 13000;
const pct = (min: number) => `${((min - DAY_START) / SPAN) * 100}%`;
const clamp = (min: number) => Math.min(DAY_END, Math.max(DAY_START, min));

/* The room at that hour. */
function shotFor(s: DayState) {
  if (!s.open) return { src: 'quince-1100.jpg', alt: 'Oil painting of quinces on a red ground, by Katia' };
  if (s.phase === 'daytime' && s.min < 12 * 60)
    return { src: 'room-day-1600.jpg', alt: 'The room in the morning, light coming in off Railton Road' };
  if (s.phase === 'daytime') return { src: 'lunch-1200.jpg', alt: 'A salad being plated in the kitchen' };
  if (s.phase === 'evening')
    return { src: 'dinner-1200.jpg', alt: 'Dinner on the red-splattered tables: a stew, fried pasta, red wine' };
  if (s.phase === 'bar' && s.min >= 21 * 60) return { src: 'martini-1600.jpg', alt: 'A martini, finished with lemon' };
  return { src: 'bar-afternoon-1200.jpg', alt: 'A cocktail, a martini and a porter on the bar' };
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
  const marks = Array.from({ length: SPAN / 60 + 1 }, (_, i) => DAY_START + i * 60);
  const seg = (s: { from: number; to: number }) => ({ left: pct(s.from), width: `calc(${pct(s.to)} - ${pct(s.from)})` });

  return (
    <div
      ref={ref}
      className="rail"
      role="slider"
      tabIndex={0}
      aria-label={`Time on ${DAYS[day]}`}
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
        {marks.map((h, i) => (
          <span key={h} className={i % 2 ? 'odd' : ''} style={{ left: pct(h) }}>
            {i === 0 || i === marks.length - 1 ? clock(h) : clock(h).replace(/am|pm/, '')}
          </span>
        ))}
      </span>
      <span className="rail-knob" style={{ left: pct(min) }}>
        <i />
      </span>
    </div>
  );
}

export function DayStage() {
  const { now, view, picked, pick } = useClock();
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const shot = shotFor(view);
  const minNow = clamp(view.min);
  const h = Math.floor(view.min / 60);
  const mm = String(view.min % 60).padStart(2, '0');

  // Play the day: nine till eleven in a dozen seconds.
  useEffect(() => {
    if (!playing) return;
    const day = view.day;
    const start = performance.now();
    const from = minNow >= DAY_END - 30 ? DAY_START : minNow;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / (PLAY_MS * ((DAY_END - from) / SPAN)));
      pick({ day, min: Math.round((from + k * (DAY_END - from)) / 5) * 5 });
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const choose = (min: number) => {
    setPlaying(false);
    pick({ day: view.day, min });
  };

  return (
    <section className={`stage on-dark ${view.open ? '' : 'is-closed'}`} id="day" aria-labelledby="day-title">
      <AnimatePresence initial={false}>
        <m.img
          key={shot.src}
          className="stage-img"
          src={media(shot.src)}
          alt={shot.alt}
          loading="lazy"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0.75, 0.15, 1] }}
        />
      </AnimatePresence>
      <div className="wrap stage-inner">
        <div className="stage-top">
          <h2 id="day-title" className="sc">
            Morning to martini
          </h2>
          <p>
            “{QUOTES.light.text[0].toUpperCase() + QUOTES.light.text.slice(1)},” wrote {QUOTES.light.where}. The page
            does the same: it’s set to the time in Herne Hill now. Drag along the day, or press play.
          </p>
        </div>

        <div className="stage-clock">
          <p className="time" aria-hidden="true">
            {h % 12 || 12}:{mm}
            <small>{h < 12 ? 'am' : 'pm'}</small>
          </p>
          <div className="meta">
            <span className="sc">{DAYS[view.day]}</span>
            <span className="state sc">
              <i aria-hidden="true" />
              {view.doors}
            </span>
            <span className="sc">{view.kitchen}</span>
          </div>
        </div>

        <p className="stage-story" aria-live="polite">
          <span className="hidden">{whenText(view)} </span>
          {view.story.map((part, i) => (typeof part === 'string' ? <span key={i}>{part}</span> : <em key={i}>{part.em}</em>))}
        </p>

        <div className="stage-controls">
          <div className="days sc" role="group" aria-label="Day">
            {ORDER.map((d) => (
              <button
                key={d}
                aria-pressed={view.day === d}
                onClick={() => {
                  setPlaying(false);
                  pick({ day: d, min: minNow });
                }}
              >
                {DAYS_SHORT[d]}
                {d === 1 && <small>closed</small>}
                {d === now.day && d !== 1 && <small>today</small>}
              </button>
            ))}
            <span className="spacer" />
            {picked && !playing && (
              <button
                onClick={() => {
                  setPlaying(false);
                  pick(null);
                }}
              >
                Back to now
              </button>
            )}
            {view.menu && !playing && (
              <Link className="sc" to="/menus" state={{ tab: view.menu }} style={{ color: 'var(--butter)' }}>
                The {view.menu} menu
              </Link>
            )}
            <button className="play" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
              <i aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  {playing ? (
                    <path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor" />
                  ) : (
                    <path d="M3 1l8 5-8 5z" fill="currentColor" />
                  )}
                </svg>
              </i>
              {playing ? 'Pause' : 'Play the day'}
            </button>
          </div>
          <Rail day={view.day} min={minNow} onChange={choose} />
        </div>
      </div>
    </section>
  );
}
