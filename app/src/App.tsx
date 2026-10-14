import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { LazyMotion, MotionConfig } from 'framer-motion';
import { ClockProvider } from './lib/clock';
import { Header } from './components/Header';
import { PhoneBar } from './components/PhoneBar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Menus } from './pages/Menus';
import { Wine } from './pages/Wine';
import { Events } from './pages/Events';
import { Jobs } from './pages/Jobs';
import { NotFound } from './pages/NotFound';

const features = () => import('./lib/motion').then((r) => r.default);

function Scroll() {
  const { pathname, key, state } = useLocation();
  const target = (state as { scrollTo?: string } | null)?.scrollTo;

  useEffect(() => {
    if (!target) window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!target) return;
    let tries = 0;
    let frame = 0;
    const go = () => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      else if (tries++ < 60) frame = requestAnimationFrame(go);
    };
    frame = requestAnimationFrame(go);
    return () => cancelAnimationFrame(frame);
  }, [key, target]);
  return null;
}

export function App() {
  return (
    <LazyMotion features={features} strict>
      <MotionConfig reducedMotion="user">
        <ClockProvider>
          <HashRouter>
            <Scroll />
            <Header />
            <main id="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menus" element={<Menus />} />
                <Route path="/wine" element={<Wine />} />
                <Route path="/events" element={<Events />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <PhoneBar />
          </HashRouter>
        </ClockProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
