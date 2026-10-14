import type { CSSProperties } from 'react';
import { media } from '../lib/media';

const MARKS = {
  /* The rougher cut, for large sizes. */
  rough: { file: 'wordmark.png', ratio: 1437 / 240 },
  /* The cleaner cut, for small sizes. */
  clean: { file: 'wordmark-clean.png', ratio: 780 / 132 },
};

type Props = {
  variant?: keyof typeof MARKS;
  className?: string;
  label?: string;
  decorative?: boolean;
};

export function Wordmark({ variant = 'rough', className = '', label = 'Sessa', decorative }: Props) {
  const mark = MARKS[variant];
  const url = `url(${media(mark.file)})`;
  const style: CSSProperties = {
    WebkitMaskImage: url,
    maskImage: url,
    aspectRatio: String(mark.ratio),
  };
  return (
    <span
      className={`wordmark ${className}`}
      style={style}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label })}
    />
  );
}
