import { useLayoutEffect, useRef, useState } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { PEOPLE, ROOM, VENUE } from '../data/sessa';
import { media } from '../lib/media';
import { useMedia } from '../lib/useMedia';
import { Picture, Rise, Words } from '../components/Reveal';

const PANELS = [
  {
    src: 'room-evening-860.jpg',
    alt: 'An evening at Sessa: candles on dark wooden tables, the long banquette, the kitchen pass behind',
    w: 66,
    caption: (
      <>
        <b>Candles on every table</b>, and the long banquette under the mirror.
      </>
    ),
  },
  {
    src: 'chalkboard-860.jpg',
    alt: 'The handwritten chalkboard menu in its wooden frame on the yellow wall',
    w: 50,
    caption: (
      <>
        <b>The food on a handwritten chalkboard</b>, which changes often.
      </>
    ),
  },
  {
    src: 'kitchen-1200.jpg',
    alt: 'Laughing in the open kitchen, pans hanging behind',
    w: 58,
    caption: (
      <>
        <b>The open kitchen.</b> Sit at the big table by it and you’re in the action.
      </>
    ),
  },
  {
    src: 'room-day-1600.jpg',
    alt: 'The room by day, the windows onto Railton Road',
    w: 72,
    caption: (
      <>
        <b>Vintage furniture</b>, and bar chairs from the sisters’ grandparents’ house.
      </>
    ),
  },
  {
    src: 'shelf-860.jpg',
    alt: 'A wooden shelf on the butter-yellow wall, lined with small vases of white flowers',
    w: 56,
    caption: (
      <>
        <b>Butter-yellow walls</b> that, as The Nudge put it, mirror the outside light.
      </>
    ),
  },
  {
    src: 'window-night-860.jpg',
    alt: 'Sessa at night from Railton Road, through the front window',
    w: 60,
    caption: (
      <>
        <b>From Railton Road</b>, after dark. Opposite Herne Hill station.
      </>
    ),
  },
];

/* A walk along the wall: scroll down, the room slides past. */
export function Room() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wide = useMedia('(min-width: 900px)');
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const sideways = wide && !reduce;

  return (
    <section className="room" id="room" aria-labelledby="room-title">
      <div
        ref={wrap}
        className="room-track-wrap"
        style={{ height: sideways ? `calc(100vh + ${distance}px)` : undefined }}
      >
        <div className="room-sticky">
          <m.div ref={track} className="room-track" style={sideways ? { x } : undefined}>
            <div className="room-intro">
              <span className="eyebrow sc">The room</span>
              <h2 id="room-title" className="display">
                <Words text="The little yellow bar." italicFrom={2} />
              </h2>
              <p>
                {ROOM.said} {ROOM.description} Open since {VENUE.opened}.
              </p>
            </div>
            {PANELS.map((pnl) => (
              <figure key={pnl.src} className="room-panel" style={{ width: wide ? `${pnl.w}vh` : undefined }}>
                <Picture src={media(pnl.src)} alt={pnl.alt} />
                <figcaption>{pnl.caption}</figcaption>
              </figure>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  );
}

export function People() {
  const { molly, edd, liv } = PEOPLE;
  return (
    <section className="people" aria-labelledby="people-title">
      <div className="wrap">
        <div>
          <span className="eyebrow sc">The people</span>
          <h2 id="people-title">
            <Words text="Molly cooks." />
            <Words text="Edd runs the drinks." delay={0.12} />
            <Words text="Liv runs the business." delay={0.24} italicFrom={0} />
          </h2>
          <Rise>
            <p>
              Sisters {molly.name} and {liv.name}, and Molly’s partner {edd.name}. The sisters also run Planted, the
              catering company they’ve had for ten years, cooking for fashion, TV and film.
            </p>
          </Rise>
        </div>
        <figure>
          <Picture src={media('team-860.jpg')} alt="Edd Clibbens, Molly Kyte and Liv Kyte at a table in Sessa" />
          <figcaption>
            {edd.name}, {molly.name} and {liv.name}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
