import { Link } from 'react-router-dom';
import { HOURS_TEXT, SUPPLIERS, VENUE } from '../data/sessa';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Wordmark decorative />
            <p className="footer-line">{VENUE.line}.</p>
          </div>
          <div>
            <h3>Visit</h3>
            <ul>
              <li>
                {VENUE.street}, {VENUE.city} {VENUE.postcode}
              </li>
              {HOURS_TEXT.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.hours}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Say hello</h3>
            <ul>
              <li>
                <a href={VENUE.phoneHref}>{VENUE.phone}</a>
              </li>
              <li>
                <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>
              </li>
              <li>
                <a href={VENUE.instagramHref} target="_blank" rel="noopener">
                  @sessa.london
                </a>
              </li>
              <li>
                <Link to="/events">Events</Link> · <Link to="/jobs">Jobs</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Supplied by</h3>
            <ul>
              {SUPPLIERS.map((s) => (
                <li key={s.who}>
                  {s.what}: {s.who}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Photography: Rob Greig</span>
          <span>Painting: Katia, 2023</span>
          <span>Site by AlexWilder-Dev</span>
        </div>
      </div>
    </footer>
  );
}
