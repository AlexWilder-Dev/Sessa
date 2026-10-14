import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { VENUE } from '../data/sessa';
import { useClock } from '../lib/clock';
import { clock } from '../lib/time';
import { Wordmark } from './Wordmark';

const NAV = [
  { to: '/menus', label: 'Menus', note: 'Daytime, evening, drinks' },
  { to: '/wine', label: 'Wine', note: 'Find a bottle' },
  { to: '/events', label: 'Events', note: 'Our bar, at yours' },
  { to: '/jobs', label: 'Jobs', note: 'Chef de Partie' },
];

export function StatusText() {
  const { now } = useClock();
  const long = now.open ? `Open now, until ${clock(now.hours!.to)}` : `Closed. ${now.next ?? ''}`;
  const short = now.open ? `Open till ${clock(now.hours!.to)}` : 'Closed now';
  return (
    <>
      <span className={`status-dot ${now.open ? 'is-open' : ''}`} aria-hidden="true" />
      <span className="status-long">{long}</span>
      <span className="status-short">{short}</span>
    </>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname, location.key]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap">
          <Link to="/" className="header-mark" aria-label="Sessa, home">
            <Wordmark variant="clean" decorative />
          </Link>
          <nav className="header-nav" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && <m.span layoutId="nav-line" className="nav-line" />}
                  </>
                )}
              </NavLink>
            ))}
            <Link to="/" state={{ scrollTo: 'find-us' }}>
              Find us
            </Link>
          </nav>
          <p className="header-status" aria-live="polite">
            <StatusText />
          </p>
          <a className="btn btn-book header-book" href={VENUE.bookHref} target="_blank" rel="noopener">
            Book a table
          </a>
          <button
            className="header-more"
            aria-expanded={open}
            aria-controls="more-sheet"
            onClick={() => setOpen(true)}
          >
            More
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <m.div
              className="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <m.div
              id="more-sheet"
              className="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="More"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              <button className="sheet-close" onClick={() => setOpen(false)} autoFocus>
                Close
              </button>
              <nav aria-label="More">
                <Link to="/">
                  Home <small>The little yellow bar</small>
                </Link>
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to}>
                    {n.label} <small>{n.note}</small>
                  </Link>
                ))}
                <Link to="/" state={{ scrollTo: 'find-us' }}>
                  Find us <small>Hours, phone, email</small>
                </Link>
              </nav>
              <p className="sheet-foot">
                <a className="link" href={VENUE.phoneHref}>
                  {VENUE.phone}
                </a>{' '}
                ·{' '}
                <a className="link" href={`mailto:${VENUE.email}`}>
                  {VENUE.email}
                </a>{' '}
                ·{' '}
                <a className="link" href={VENUE.instagramHref} target="_blank" rel="noopener">
                  Instagram
                </a>
              </p>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
