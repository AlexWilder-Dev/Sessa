import { useEffect, type ReactNode } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, LazyMotion, MotionConfig, m } from "framer-motion";
import { ClockProvider } from "./lib/clock";
import { Header } from "./components/Header";
import { MobileBar } from "./components/MobileBar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Menus } from "./pages/Menus";
import { Wine } from "./pages/Wine";
import { Events } from "./pages/Events";
import { Jobs } from "./pages/Jobs";
import { NotFound } from "./pages/NotFound";

const loadFeatures = () =>
  import("./lib/motion-features").then((r) => r.default);

/* Filters that give big headings the same hand-cut edge as the logo. */
function Filters() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <filter id="rough" x="-2%" y="-8%" width="104%" height="116%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.045"
          numOctaves="2"
          seed="4"
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale="2.6"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id="rough-lg" x="-2%" y="-8%" width="104%" height="116%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.028"
          numOctaves="2"
          seed="9"
          result="n"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="n"
          scale="4.5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter id="chalk" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="1"
          seed="2"
          result="grain"
        />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75"
          result="mask"
        />
        <feComposite in="SourceGraphic" in2="mask" operator="in" />
      </filter>
    </svg>
  );
}

function ScrollManager() {
  const location = useLocation();
  const target = (location.state as { scrollTo?: string } | null)?.scrollTo;

  // New page: start at the top (unless we're heading for a section).
  useEffect(() => {
    if (!target) window.scrollTo(0, 0);
  }, [location.pathname]);

  // "Find us" and friends: wait for the section to exist, then glide to it.
  useEffect(() => {
    if (!target) return;
    let tries = 0;
    let raf = 0;
    const go = () => {
      const el = document.getElementById(target);
      if (el) {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches;
        el.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "start",
        });
      } else if (tries++ < 90) raf = requestAnimationFrame(go);
    };
    raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, [location.key, target]);
  return null;
}

function Page({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </m.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Page>
              <Home />
            </Page>
          }
        />
        <Route
          path="/menus"
          element={
            <Page>
              <Menus />
            </Page>
          }
        />
        <Route
          path="/wine"
          element={
            <Page>
              <Wine />
            </Page>
          }
        />
        <Route
          path="/events"
          element={
            <Page>
              <Events />
            </Page>
          }
        />
        <Route
          path="/jobs"
          element={
            <Page>
              <Jobs />
            </Page>
          }
        />
        <Route
          path="*"
          element={
            <Page>
              <NotFound />
            </Page>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <ClockProvider>
          <HashRouter>
            <Filters />
            <div className="light" aria-hidden="true" />
            <div className="site">
              <a
                className="skip"
                href="#main"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("main")?.focus();
                }}
              >
                Skip to content
              </a>
              <ScrollManager />
              <Header />
              <main id="main" tabIndex={-1}>
                <AppRoutes />
              </main>
              <Footer />
              <MobileBar />
            </div>
          </HashRouter>
        </ClockProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
