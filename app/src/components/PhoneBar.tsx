import { Link } from 'react-router-dom';
import { VENUE } from '../data/sessa';

export function PhoneBar() {
  return (
    <nav className="phone-bar sc" aria-label="Quick links">
      <Link to="/menus">Menus</Link>
      <a className="pill" href={VENUE.bookHref} target="_blank" rel="noopener">
        Book
      </a>
      <a href={VENUE.directionsHref} target="_blank" rel="noopener">
        Directions
      </a>
    </nav>
  );
}
