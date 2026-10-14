import { EVENTS, VENUE } from '../data/sessa';
import { media } from '../lib/media';
import { useTitle } from '../lib/title';
import { Picture, Rise, Words } from '../components/Reveal';

export function Events() {
  useTitle('Events');
  const mail = `mailto:${VENUE.email}?subject=${encodeURIComponent('Event enquiry')}`;
  return (
    <div className="page">
      <header className="page-head wrap">
        <span className="eyebrow sc">Events</span>
        <h1 className="poster">
          <Words text="The bar, wherever you need it." italicFrom={2} />
        </h1>
      </header>
      <div className="wrap split">
        <Rise>
          <p className="guests">
            30 – 300 <em>guests</em>
          </p>
          <p className="lede">{EVENTS.lead}</p>
          <p>{EVENTS.body}</p>
          <p>{EVENTS.ask}</p>
          <div className="actions">
            <a className="pill pill-solid" href={mail}>
              {EVENTS.cta}
            </a>
            <a className="pill" href={VENUE.instagramHref} target="_blank" rel="noopener">
              Instagram
            </a>
          </div>
        </Rise>
        <Picture src={media('martini-900.jpg')} alt="A martini being finished with a twist of lemon" position="34% 50%" />
      </div>
    </div>
  );
}
