import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { VENUE } from '../data/sessa';
import { useClock } from '../lib/clock';
import { clock } from '../lib/time';
import { Wordmark } from './Wordmark';

const LINKS = [
  { to: '/menus', label: 'Menus' },
  { to: '/wine', label: 'Wine' },
  { to: '/events', label: 'Events' },
  { to: '/jobs', label: 'Jobs' },
];

export function Header() {
  const { now } = useClock();
  const { pathname, key } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname, key]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const status = now.open ? `Open until ${clock(now.hours!.to)}` : 'Closed now';

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : pathname === '/' ? 'is-over on-dark' : ''}`}>
        <div className="wrap">
          <Link to="/" className="header-mark" aria-label="Sessa, home">
            <Wordmark small />
          </Link>
          <nav className="nav sc" aria-label="Main">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {l.label}
              </NavLink>
            ))}
            <Link to="/" state={{ scrollTo: 'find-us' }}>
              Find us
            </Link>
          </nav>
          <p className="header-status sc">
            <span className={`dot ${now.open ? 'on' : ''}`} aria-hidden="true" />
            <span>
              {status}
              <span className="long">{now.open ? '' : ` · ${now.next}`}</span>
            </span>
          </p>
          <a className="pill header-book" href={VENUE.bookHref} target="_blank" rel="noopener">
            Book a table
          </a>
          <button className="header-menu sc" aria-expanded={open} onClick={() => setOpen(true)}>
            Menu
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="sheet-top">
              <Link to="/" className="header-mark" aria-label="Sessa, home">
                <Wordmark small />
              </Link>
              <button className="sc" onClick={() => setOpen(false)} autoFocus>
                Close
              </button>
            </div>
            <nav aria-label="Pages">
              <Link to="/">Home</Link>
              {LINKS.map((l) => (
                <Link key={l.to} to={l.to}>
                  {l.label}
                </Link>
              ))}
              <Link to="/" state={{ scrollTo: 'find-us' }}>
                Find us
              </Link>
            </nav>
            <div className="sheet-foot">
              <p>
                {VENUE.street}, {VENUE.area} {VENUE.postcode}
              </p>
              <p>
                <a className="link" href={VENUE.phoneHref}>
                  {VENUE.phone}
                </a>{' '}
                ·{' '}
                <a className="link" href={`mailto:${VENUE.email}`}>
                  {VENUE.email}
                </a>
              </p>
              <p>
                <a className="link" href={VENUE.instagramHref} target="_blank" rel="noopener">
                  Instagram
                </a>
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
