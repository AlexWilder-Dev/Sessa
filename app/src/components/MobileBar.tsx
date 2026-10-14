import { Link } from 'react-router-dom';
import { VENUE } from '../data/sessa';
import { useClock } from '../lib/clock';

export function MobileBar() {
  const { now } = useClock();
  const menuNote = now.menu === 'daytime' ? 'Daytime on' : now.menu === 'evening' ? 'Evening on' : 'Food & drink';
  return (
    <nav className="mobile-bar" aria-label="Quick links">
      <Link to="/menus">
        Menus <small>{menuNote}</small>
      </Link>
      <a className="bar-book" href={VENUE.bookHref} target="_blank" rel="noopener">
        Book <small>a table</small>
      </a>
      <a href={VENUE.directionsHref} target="_blank" rel="noopener">
        Directions <small>{VENUE.postcode}</small>
      </a>
    </nav>
  );
}
