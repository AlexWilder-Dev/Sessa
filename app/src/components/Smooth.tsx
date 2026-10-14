import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';

/* Smooth scrolling, off for anyone who prefers reduced motion. */
const LenisContext = createContext<{ current: Lenis | null }>({ current: null });

export function Smooth({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    ref.current = lenis;
    let frame = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      ref.current = null;
    };
  }, []);
  return <LenisContext.Provider value={ref}>{children}</LenisContext.Provider>;
}

/* Scroll to an element or to the top, smoothly if Lenis is running. */
export function useScrollTo() {
  const ref = useContext(LenisContext);
  return (target: HTMLElement | number, immediate = false) => {
    const lenis = ref.current;
    if (lenis) lenis.scrollTo(target, { immediate, offset: typeof target === 'number' ? 0 : -72 });
    else if (typeof target === 'number') window.scrollTo(0, target);
    else target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
  };
}
