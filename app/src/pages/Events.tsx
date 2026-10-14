import { EVENTS, VENUE } from '../data/sessa';
import { media } from '../lib/media';
import { useTitle } from '../lib/title';

export function Events() {
  useTitle('Events');
  const mail = `mailto:${VENUE.email}?subject=${encodeURIComponent('Event enquiry')}`;
  return (
    <div className="page">
      <header className="page-head wrap">
        <span className="eyebrow sc">Events</span>
        <h1 className="display">
          The bar, <em>wherever you need it.</em>
        </h1>
      </header>
      <div className="wrap split">
        <div>
          <p className="guests">
            30 – 300 <em>guests</em>
          </p>
          <p className="lede">{EVENTS.lead}</p>
          <p>{EVENTS.body}</p>
          <p>{EVENTS.ask}</p>
          <div className="actions">
            <a className="pill pill-ink" href={mail}>
              {EVENTS.cta}
            </a>
            <a className="pill" href={VENUE.instagramHref} target="_blank" rel="noopener">
              Instagram
            </a>
          </div>
        </div>
        <figure className="photo">
          <img
            src={media('martini-900.jpg')}
            loading="lazy"
            alt="A martini being finished with a twist of lemon"
            style={{ objectPosition: '34% 50%' }}
          />
        </figure>
      </div>
    </div>
  );
}
