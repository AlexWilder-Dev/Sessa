import { Fragment, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const EASE = [0.2, 0.75, 0.15, 1] as const;

/* A heading whose words rise out of a mask, one after another. */
const wordVariants = {
  hidden: { y: '110%' },
  shown: (i: number) => ({ y: '0%', transition: { duration: 0.9, ease: EASE, delay: i } }),
};

export function Words({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  italicFrom,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /* Words from this index on are set in italic. */
  italicFrom?: number;
}) {
  const words = text.split(' ');
  const still = useReducedMotion();
  if (still)
    return (
      <Tag className={className}>
        {italicFrom === undefined ? (
          text
        ) : (
          <>
            {words.slice(0, italicFrom).join(' ')}
            {italicFrom > 0 && ' '}
            <span className="it">{words.slice(italicFrom).join(' ')}</span>
          </>
        )}
      </Tag>
    );
  // The observer watches the whole line: a word hidden inside its mask never counts as "in view".
  return (
    <Tag className={className} aria-label={text}>
      <m.span
        className="words"
        aria-hidden="true"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="mask">
              <m.span
                className={`mask-in ${italicFrom !== undefined && i >= italicFrom ? 'it' : ''}`}
                variants={wordVariants}
                custom={delay + i * 0.045}
              >
                {w}
              </m.span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </m.span>
    </Tag>
  );
}

/* Fade and rise, for smaller blocks. */
export function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  if (useReducedMotion()) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </m.div>
  );
}

/* A photograph uncovered from below, settling as it opens. */
export function Picture({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  style,
  position,
  delay = 0,
}: {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  position?: string;
  delay?: number;
}) {
  if (useReducedMotion())
    return (
      <figure className={`picture ${className}`} style={style}>
        <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading="lazy" style={{ objectPosition: position }} />
      </figure>
    );
  return (
    <m.figure
      className={`picture ${className}`}
      style={style}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    >
      <m.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        style={{ objectPosition: position }}
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE, delay }}
      />
    </m.figure>
  );
}

function ScrollWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <m.span className="fade-var" style={{ ['--o' as string]: opacity } as unknown as CSSProperties}>
      {word}{' '}
    </m.span>
  );
}

/* Words that light up one by one as you scroll past them. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  if (useReducedMotion())
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <ScrollWord
            key={i}
            word={w}
            progress={scrollYProgress}
            range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]}
          />
        ))}
      </span>
    </p>
  );
}
