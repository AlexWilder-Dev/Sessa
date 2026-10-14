import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { animate, m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { VENUE } from '../data/sessa';
import { useClock } from '../lib/clock';
import { clock } from '../lib/time';
import { media, srcSet } from '../lib/media';
import { Wordmark } from '../components/Wordmark';
import { Rise, Words } from '../components/Reveal';
import { arrival, wroteMark } from '../components/Curtain';

const EASE = [0.2, 0.75, 0.15, 1] as const;

// Opacity goes through a CSS variable: handed over directly, scroll-linked
// opacity gets accelerated by the browser and lands on the wrong values.
const vo = (v: unknown) => ({ ['--o']: v }) as unknown as CSSProperties;

const SHOTS = {
  day: {
    name: 'room-day',
    widths: [900, 1600, 2000],
    alt: 'The room by day: butter-yellow walls, long wooden tables, a candle lit on the shelf, Railton Road through the windows',
    position: '58% 45%',
  },
  evening: {
    name: 'martini',
    widths: [900, 1600, 1920],
    alt: 'A martini being finished with a twist of lemon at the bar',
    position: '30% 40%',
  },
};

/*
 * The room fills the screen. On the first visit the wordmark written on the
 * shutter drops into place along the bottom as the shutter lifts.
 */
export function Hero() {
  const { now } = useClock();
  const ref = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const shot = now.open && now.min >= 17 * 60 ? SHOTS.evening : SHOTS.day;
  const [start] = useState(arrival);
  const [flying, setFlying] = useState(() => wroteMark() && !reduce);

  // The wordmark's flight from the shutter to the foot of the photograph.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const ms = useMotionValue(1);
  useLayoutEffect(() => {
    if (!flying) return;
    const from = document.querySelector<HTMLElement>('.curtain-mark');
    const to = markRef.current;
    if (!from || !to || window.scrollY > 10) return setFlying(false);
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    mx.set(a.left + a.width / 2 - (b.left + b.width / 2));
    my.set(a.top + a.height / 2 - (b.top + b.height / 2));
    ms.set(a.width / b.width);
    const options = { duration: 1.15, ease: [0.7, 0, 0.2, 1] as const, delay: start };
    const swap = window.setTimeout(() => (from.style.opacity = '0'), start * 1000);
    const land = window.setTimeout(() => setFlying(false), (start + options.duration) * 1000 + 50);
    const runs = [animate(mx, 0, options), animate(my, 0, options), animate(ms, 1, options)];
    return () => {
      window.clearTimeout(swap);
      window.clearTimeout(land);
      runs.forEach((r) => r.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Leaving: the photograph drifts slower than the page, the words lift away.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(p, [0, 1], ['0%', '28%']);
  const copyY = useTransform(p, [0, 1], ['0%', '-18%']);
  const copyO = useTransform(p, [0, 0.6], [1, 0]);

  // A little give under the pointer, so the room feels like a room.
  const px = useSpring(0, { stiffness: 50, damping: 20 });
  const py = useSpring(0, { stiffness: 50, damping: 20 });
  const onMove = (e: PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * -18);
    py.set(((e.clientY - r.top) / r.height - 0.5) * -12);
  };

  const status = now.open ? (
    <>
      <strong>Open now</strong>, until {clock(now.hours!.to)}. {now.kitchen}.
    </>
  ) : (
    <>
      <strong>Closed now.</strong> {now.next}.
    </>
  );
  const menuLabel = now.menu === 'evening' ? 'Tonight’s menu' : now.menu === 'daytime' ? 'Today’s menu' : 'The menus';

  return (
    <section ref={ref} className="hero on-dark" aria-label="Sessa" onPointerMove={onMove}>
      <m.div className="hero-photo" style={reduce ? undefined : { y: photoY }}>
        <m.img
          src={media(`${shot.name}-1600.jpg`)}
          srcSet={srcSet(shot.name, shot.widths)}
          sizes="100vw"
          alt={shot.alt}
          fetchPriority="high"
          style={reduce ? { objectPosition: shot.position } : { objectPosition: shot.position, x: px, y: py }}
          initial={reduce ? false : { scale: 1.16 }}
          animate={{ scale: reduce ? 1 : 1.04 }}
          transition={{ duration: 2.6, ease: EASE, delay: start }}
        />
      </m.div>

      <m.div className={`hero-copy fade-var ${flying ? 'is-flying' : ''}`} style={reduce ? undefined : { ...vo(copyO), y: copyY }}>
        <div className="wrap">
          <div className="hero-row">
            <h2>
              <Words text="Coffee from nine," delay={start + 0.55} />
              <br />
              <Words text="martinis till late." italicFrom={0} delay={start + 0.7} />
            </h2>
            <Rise className="hero-actions" delay={start + 0.9}>
              <p className="status">{status}</p>
              <a className="pill pill-solid" href={VENUE.bookHref} target="_blank" rel="noopener">
                Book a table
              </a>
              <Link className="pill" to="/menus">
                {menuLabel}
              </Link>
            </Rise>
          </div>
          <h1 className="hero-mark">
            <m.span ref={markRef} className="wm" style={{ x: mx, y: my, scale: ms }}>
              <Wordmark label="Sessa" />
            </m.span>
          </h1>
        </div>
      </m.div>
    </section>
  );
}
