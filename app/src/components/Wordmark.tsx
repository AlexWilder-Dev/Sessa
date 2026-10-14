import type { CSSProperties } from 'react';
import { mediaAbs } from '../lib/media';

/* Their logo, recoloured with CSS so it can sit in butter or oxblood. */
export function Wordmark({ small, label }: { small?: boolean; label?: string }) {
  const style = { '--mark': `url(${mediaAbs(small ? 'wordmark-small.png' : 'wordmark.png')})` } as CSSProperties;
  return label ? (
    <span className="wordmark" style={style} role="img" aria-label={label} />
  ) : (
    <span className="wordmark" style={style} aria-hidden="true" />
  );
}
