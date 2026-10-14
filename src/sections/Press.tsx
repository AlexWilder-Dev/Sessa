import { QUOTES } from '../data/sessa';
import { media } from '../lib/media';
import { Reveal } from '../components/Reveal';

export function Press() {
  return (
    <section className="section press" aria-label="Press">
      <div className="wrap press-grid">
        <blockquote className="press-quote">
          <p className="rough">
            <span className="press-open">“…</span>
            {QUOTES.nudge.text}.”
          </p>
          <footer>
            <cite>{QUOTES.nudge.source}</cite>
          </footer>
        </blockquote>
        <Reveal className="painting-wrap">
          <figure className="painting">
            <svg className="painting-wire" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
              <path d="M100 4 L4 42 M100 4 L196 42" />
              <circle cx="100" cy="4" r="3.5" />
            </svg>
            <div className="painting-frame">
              <img src={media('quince-1100.jpg')} width={1100} height={1100} loading="lazy" alt="Oil painting of five yellow quinces on a red ground, signed Katia, 2023" />
            </div>
            <figcaption>
              <b>Painting by Katia, 2023</b>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
