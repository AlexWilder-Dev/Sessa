import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { m, useReducedMotion } from 'framer-motion';

/*
 * The round sign that hangs in the door (it's in the window photo).
 * It swings when it changes and turns over between Open and Closed.
 */
export function OpenSign({ open, size = 104, className = '' }: { open: boolean; size?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [swing, setSwing] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSwing((s) => s + 1);
  }, [open]);

  const dir = swing % 2 === 0 ? 1 : -1;

  return (
    <div
      className={`sign ${className}`}
      style={{ '--sign-size': `${size}px` } as CSSProperties}
      role="img"
      aria-label={open ? 'Open' : 'Closed'}
    >
      <svg className="sign-cord" viewBox="0 0 100 34" aria-hidden="true">
        <path d="M50 4 L18 33 M50 4 L82 33" />
        <circle cx="50" cy="4" r="3.2" />
      </svg>
      <m.div
        className="sign-swing"
        initial={reduce ? false : { rotate: 7 }}
        animate={reduce ? { rotate: 0 } : { rotate: [dir * 7, dir * -5, dir * 3, dir * -1.5, 0] }}
        transition={{ duration: 2.4, ease: 'easeOut' }}
        key={swing}
      >
        <m.div
          className="sign-disc"
          initial={false}
          animate={{ rotateY: open ? 0 : 180 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: [0.55, 0, 0.2, 1] }}
        >
          <span className="sign-face sign-front">Open</span>
          <span className="sign-face sign-back">Closed</span>
        </m.div>
      </m.div>
    </div>
  );
}
