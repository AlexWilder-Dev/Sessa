import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { Wordmark } from './Wordmark';

const EASE = [0.76, 0, 0.24, 1] as const;
let first = true;
let arrived = 1.8;
let wrote = true;

/* Seconds until the shutter starts to lift on the page being shown. */
export const arrival = () => arrived;
/* Whether the wordmark was written across the shutter (the first visit). */
export const wroteMark = () => wrote;
/* When the shutter starts to lift, on the first visit. */
export const LIFT = 1.15;

/*
 * Every page arrives behind an oxblood shutter that lifts. On the first
 * visit the wordmark is written across it before it goes up.
 */
export function Page({ children }: { children: ReactNode }) {
  const intro = first;
  first = false;
  arrived = intro ? LIFT : 0.05;
  wrote = intro;
  return (
    <>
      <m.div
        className="curtain"
        aria-hidden="true"
        initial={{ y: '0%' }}
        animate={{ y: '-101%', transition: { duration: intro ? 0.9 : 0.6, ease: EASE, delay: intro ? LIFT : 0.05 } }}
        exit={{ y: '0%', transition: { duration: 0.55, ease: EASE } }}
        style={{ originY: 0 }}
      >
        <m.span
          className="curtain-mark"
          initial={intro ? { clipPath: 'inset(0 100% 0 0)' } : false}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, ease: [0.6, 0, 0.2, 1], delay: 0.15 }}
        >
          <Wordmark />
        </m.span>
      </m.div>
      {children}
    </>
  );
}
