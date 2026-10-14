import { Link } from 'react-router-dom';
import { SUPPLIERS, VENUE } from '../data/sessa';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-mark">
              <Wordmark />
            </div>
            <p className="footer-line">{VENUE.line}.</p>
          </div>
          <div>
            <h3 className="sc">Visit</h3>
            <ul>
              <li>{VENUE.street}</li>
              <li>
                {VENUE.area}, {VENUE.city} {VENUE.postcode}
              </li>
              <li>Tue – Thu 9am – 10:30pm</li>
              <li>Fri – Sat 9am – 11pm</li>
              <li>Sun 9am – 3pm · Mon closed</li>
            </ul>
          </div>
          <div>
            <h3 className="sc">Get in touch</h3>
            <ul>
              <li>
                <a href={VENUE.phoneHref}>{VENUE.phone}</a>
              </li>
              <li>
                <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>
              </li>
              <li>
                <a href={VENUE.instagramHref} target="_blank" rel="noopener">
                  {VENUE.instagram}
                </a>
              </li>
              <li>
                <Link to="/events">Events</Link> · <Link to="/jobs">Jobs</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="sc">From</h3>
            <ul>
              {SUPPLIERS.map((s) => (
                <li key={s.who}>
                  {s.what}: {s.who}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="footer-credits">
          <span>Photography: Rob Greig and others</span>
          <span>Painting: Katia, 2023</span>
          <span>Site by AlexWilder-Dev</span>
        </p>
      </div>
    </footer>
  );
}
