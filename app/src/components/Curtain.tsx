import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { Wordmark } from './Wordmark';

const EASE = [0.76, 0, 0.24, 1] as const;
let first = true;

/*
 * Every page arrives behind an oxblood shutter that lifts. On the first
 * visit the wordmark is written across it before it goes up.
 */
export function Page({ children }: { children: ReactNode }) {
  const intro = first;
  first = false;
  return (
    <>
      <m.div
        className="curtain"
        aria-hidden="true"
        initial={{ y: '0%' }}
        animate={{ y: '-101%', transition: { duration: intro ? 0.9 : 0.6, ease: EASE, delay: intro ? 1.15 : 0.05 } }}
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
