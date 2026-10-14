import { useEffect } from 'react';
import { EVENTS, VENUE } from '../data/sessa';
import { media } from '../lib/media';

export function Events() {
  useEffect(() => {
    document.title = 'Events · Sessa, Herne Hill';
    return () => {
      document.title = 'Sessa · All-day bar & café, Herne Hill';
    };
  }, []);

  const mail = `mailto:${VENUE.email}?subject=${encodeURIComponent('Event enquiry')}`;

  return (
    <div className="events-page">
      <header className="page-head wrap">
        <p className="label eyebrow">Events</p>
        <h1 className="h-xl rough-lg">The bar, at yours.</h1>
      </header>
      <div className="wrap events-grid">
        <div className="events-copy">
          <p className="events-range" aria-label="30 to 300 guests">
            <span className="price rough-lg">30</span>
            <span className="events-to">to</span>
            <span className="price rough-lg">300</span>
            <span className="events-guests">guests</span>
          </p>
          <p className="lede">{EVENTS.lead}</p>
          <p>{EVENTS.body}</p>
          <p>{EVENTS.ask}</p>
          <a className="btn btn-book" href={mail}>
            {EVENTS.cta} <span className="arrow">→</span>
          </a>
          <p className="events-alt">
            Or write to{' '}
            <a className="link" href={mail}>
              {VENUE.email}
            </a>
            , or message us on{' '}
            <a className="link" href={VENUE.instagramHref} target="_blank" rel="noopener">
              Instagram
            </a>
            .
          </p>
        </div>
        <figure className="photo events-photo">
          <img
            src={media('photo-11.jpg')}
            width={860}
            height={600}
            loading="lazy"
            alt="A negroni over ice with a slice of orange on the steel bar"
          />
        </figure>
      </div>
    </div>
  );
}
