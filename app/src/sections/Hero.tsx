import { useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { m, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { VENUE } from '../data/sessa';
import { useClock } from '../lib/clock';
import { clock } from '../lib/time';
import { media, srcSet } from '../lib/media';
import { useMedia } from '../lib/useMedia';
import { Wordmark } from '../components/Wordmark';

// Opacity goes through a CSS variable: handed over directly, scroll-linked
// opacity gets accelerated by the browser and lands on the wrong values.
const vo = (v: unknown) => ({ ['--o']: v }) as unknown as CSSProperties;

const SHOTS = {
  day: {
    name: 'room-day',
    alt: 'The room by day: butter-yellow walls, long wooden tables, a candle lit on the shelf, Railton Road through the windows',
    position: '52% 50%',
  },
  evening: {
    name: 'martini',
    alt: 'A martini being finished with a twist of lemon at the bar',
    position: '36% 45%',
  },
};

/*
 * The photograph starts out hung on the yellow wall, in front of the
 * wordmark. Scroll, and it opens until you're standing in the room.
 */
export function Hero() {
  const { now } = useClock();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const narrow = useMedia('(max-width: 799px)');
  const shot = now.open && now.min >= 17 * 60 ? SHOTS.evening : SHOTS.day;

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Where the picture hangs on the wall to begin with: top, sides, bottom (as % of the screen).
  const [t0, s0, b0] = narrow ? [30, 6, 15] : [15, 35, 11];
  const from = `inset(${t0}% ${s0}% ${b0}% ${s0}%)`;
  const top = useTransform(p, [0, 0.62], [t0, 0], { clamp: true });
  const side = useTransform(p, [0, 0.62], [s0, 0], { clamp: true });
  const bottom = useTransform(p, [0, 0.62], [b0, 0], { clamp: true });
  const clip = useMotionTemplate`inset(${top}% ${side}% ${bottom}% ${side}%)`;
  const scale = useTransform(p, [0, 0.62], [1.22, 1]);
  const markY = useTransform(p, [0, 0.5], ['0%', '-30%']);
  const fade = useTransform(p, [0, 0.25], [1, 0]);
  const over = useTransform(p, [0.6, 0.85], [0, 1]);
  const overY = useTransform(p, [0.6, 0.85], [40, 0]);
  const shade = useTransform(p, [0.45, 0.8], [0, 1]);

  const status = now.open ? (
    <>
      <strong>Open now</strong>, until {clock(now.hours!.to)}. {now.kitchen}.
    </>
  ) : (
    <>
      <strong>Closed now.</strong> {now.next}.
    </>
  );

  return (
    <section ref={ref} className={`hero ${reduce ? 'still' : ''}`} aria-label="Sessa">
      <div className="hero-stage">
        <m.div className="hero-mark" style={reduce ? undefined : { y: markY }}>
          <h1>
            <span className="wm">
              <Wordmark label="Sessa" />
            </span>
          </h1>
        </m.div>

        <m.div
          className="hero-photo"
          style={reduce ? { clipPath: from } : { clipPath: clip, ['--shade' as string]: shade }}
        >
          <m.img
            src={media(`${shot.name}-1600.jpg`)}
            srcSet={srcSet(shot.name, [900, 1600])}
            sizes="100vw"
            alt={shot.alt}
            style={{ objectPosition: shot.position, scale: reduce ? 1 : scale }}
            fetchPriority="high"
          />
        </m.div>

        <m.p className="hero-side left sc fade-var" style={reduce ? undefined : vo(fade)}>
          {VENUE.line}
          <br />
          {VENUE.street}
        </m.p>
        <m.div className="hero-side right fade-var" style={reduce ? undefined : vo(fade)}>
          <p className="status">{status}</p>
        </m.div>
        {!reduce && (
          <m.p className="hero-hint sc fade-var" style={vo(fade)}>
            Come in
          </m.p>
        )}

        {!reduce && (
          <m.div className="hero-over on-dark fade-var" style={{ ...vo(over), y: overY }}>
            <div className="wrap">
              <h2>
                Coffee from nine, <em>martinis till late.</em>
              </h2>
              <div className="row">
                <a className="pill pill-solid" href={VENUE.bookHref} target="_blank" rel="noopener">
                  Book a table
                </a>
                <Link className="pill" to="/menus">
                  {now.menu === 'evening' ? 'Tonight’s menu' : now.menu === 'daytime' ? 'Today’s menu' : 'The menus'}
                </Link>
                <p className="status">{status}</p>
              </div>
            </div>
          </m.div>
        )}
      </div>
    </section>
  );
}
