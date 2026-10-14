import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { ClockProvider } from './lib/clock';
import { Smooth, useScrollTo } from './components/Smooth';
import { Page } from './components/Curtain';
import { Header } from './components/Header';
import { PhoneBar } from './components/PhoneBar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Menus } from './pages/Menus';
import { Wine } from './pages/Wine';
import { Events } from './pages/Events';
import { Jobs } from './pages/Jobs';
import { NotFound } from './pages/NotFound';

function Pages() {
  const location = useLocation();
  const scrollTo = useScrollTo();
  const target = (location.state as { scrollTo?: string } | null)?.scrollTo;

  // "Find us" and other in-page links: once the page is up, glide to the section.
  useEffect(() => {
    if (!target) return;
    let tries = 0;
    let frame = 0;
    const go = () => {
      const el = document.getElementById(target);
      if (el) scrollTo(el);
      else if (tries++ < 90) frame = requestAnimationFrame(go);
    };
    const t = window.setTimeout(() => (frame = requestAnimationFrame(go)), 350);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(frame);
    };
  }, [location.key, target]);

  return (
    <AnimatePresence mode="wait" initial={true} onExitComplete={() => scrollTo(0, true)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/menus" element={<Page><Menus /></Page>} />
        <Route path="/wine" element={<Page><Wine /></Page>} />
        <Route path="/events" element={<Page><Events /></Page>} />
        <Route path="/jobs" element={<Page><Jobs /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ClockProvider>
          <Smooth>
            <HashRouter>
              <Header />
              <main id="main">
                <Pages />
              </main>
              <Footer />
              <PhoneBar />
            </HashRouter>
          </Smooth>
        </ClockProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
