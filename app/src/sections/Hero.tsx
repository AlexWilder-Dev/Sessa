import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { QUOTES, VENUE } from '../data/sessa';
import { useClock } from '../lib/clock';
import { media, srcSet } from '../lib/media';
import { Wordmark } from '../components/Wordmark';

const SHOTS = {
  day: {
    name: 'room-day',
    widths: [900, 1600],
    alt: 'The room by day: butter-yellow walls, long wooden tables, a candle lit on the shelf, Railton Road through the windows',
    position: '50% 55%',
  },
  evening: {
    name: 'martini',
    widths: [900, 1600],
    alt: 'A martini being finished with a twist of lemon at the bar',
    position: '38% 40%',
  },
};

export function Hero() {
  const { now } = useClock();
  const shot = now.open && now.min >= 17 * 60 ? SHOTS.evening : SHOTS.day;

  return (
    <section className={`hero ${now.open ? '' : 'is-closed'}`} aria-label="Sessa">
      <AnimatePresence initial={false}>
        <m.div
          key={shot.name}
          className="hero-img"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src={media(`${shot.name}-1600.jpg`)}
            srcSet={srcSet(shot.name, shot.widths)}
            sizes="100vw"
            alt={shot.alt}
            style={{ objectPosition: shot.position }}
            fetchPriority="high"
          />
        </m.div>
      </AnimatePresence>
      <div className="hero-foot">
        <div className="wrap">
          <h1 className="hero-mark">
            <Wordmark label="Sessa" />
          </h1>
          <p className="hero-meta sc">
            All day bar &amp; café
            <br />
            {VENUE.street}, {VENUE.area}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Intro() {
  const { now } = useClock();
  const menuLabel = now.menu === 'evening' ? 'Tonight’s menu' : now.menu === 'daytime' ? 'Today’s menu' : 'Menus';
  return (
    <>
      <section className="intro" aria-label="Open now">
        <div className="wrap">
          <h2>
            Coffee from nine, <em>martinis till late.</em>
          </h2>
          <div>
            <p className="status">
              {now.open ? (
                <>
                  <strong>Open now.</strong> {now.kitchen}. {now.next}.
                </>
              ) : (
                <>
                  <strong>Closed now.</strong> {now.next}.
                </>
              )}
            </p>
            <div className="actions">
              <a className="pill pill-ink" href={VENUE.bookHref} target="_blank" rel="noopener">
                Book a table
              </a>
              <Link className="pill" to="/menus">
                {menuLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section quote field" aria-label="What Sessa is">
        <div className="wrap">
          <blockquote>
            <p>“{QUOTES.molly.text}”</p>
            <footer className="sc">
              {QUOTES.molly.who}, chef · in {QUOTES.molly.where}
            </footer>
          </blockquote>
          <figure className="painting">
            <img
              src={media('quince-1100.jpg')}
              width={1100}
              height={1100}
              loading="lazy"
              alt="Oil painting of five yellow quinces on a red ground, signed Katia, 2023"
            />
            <figcaption>Quinces. Katia, 2023.</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
