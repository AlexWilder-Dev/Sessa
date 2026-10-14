import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { QUOTES, VENUE } from '../data/sessa';
import { useClock } from '../lib/clock';
import { clock } from '../lib/time';
import { media } from '../lib/media';
import { Wordmark } from '../components/Wordmark';
import { OpenSign } from '../components/OpenSign';

export function Hero() {
  const { now } = useClock();
  // After five the window shot takes over: the room seen from the street, lit.
  const evening = now.open && now.min >= 17 * 60;

  const statusHead = now.open ? 'Open now.' : 'Closed now.';
  const statusBody = now.open
    ? `${now.kitchen} Doors close at ${clock(now.hours!.to)}.`
    : `${now.next ?? ''}.`;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <h1 id="hero-title" className="hero-mark">
          <Wordmark label="Sessa" />
          <span className="visually-hidden">, {VENUE.line}</span>
        </h1>

        <div className="hero-grid">
          <p className="hero-line">
            {VENUE.line}.
            <span> Coffee from nine, martinis till late, opposite the station.</span>
          </p>

          <figure className={`hero-photo photo ${now.open ? '' : 'is-dim'}`}>
            <AnimatePresence initial={false}>
              {evening ? (
                <m.img
                  key="night"
                  src={media('photo-1.jpg')}
                  width={860}
                  height={600}
                  alt="Sessa at night through the front window: full tables, candles, the open kitchen at the back"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  fetchPriority="high"
                />
              ) : (
                <m.img
                  key="day"
                  src={media('room-day-1600.jpg')}
                  srcSet={`${media('room-day-1000.jpg')} 1000w, ${media('room-day-1600.jpg')} 1600w`}
                  sizes="(min-width: 1000px) 58vw, 100vw"
                  width={1600}
                  height={1066}
                  alt="The room by day: yellow walls, long wooden tables, a candle on the shelf, the street through the windows"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  fetchPriority="high"
                />
              )}
            </AnimatePresence>
          </figure>

          <div className="hero-status">
            <OpenSign open={now.open} size={88} className="hero-sign" />
            <p aria-live="polite">
              <strong>{statusHead}</strong> {statusBody}
            </p>
          </div>

          <blockquote className="hero-quote">
            <p>“{QUOTES.molly.text}”</p>
            <footer>
              {QUOTES.molly.who}, chef, in <cite>{QUOTES.molly.source}</cite>
            </footer>
          </blockquote>

          <div className="hero-actions">
            <a className="btn btn-book" href={VENUE.bookHref} target="_blank" rel="noopener">
              Book a table <span className="arrow">→</span>
            </a>
            <Link className="btn btn-line" to="/menus">
              {now.menu === 'evening' ? 'Tonight’s menu' : now.menu === 'daytime' ? 'Today’s menu' : 'Menus'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
