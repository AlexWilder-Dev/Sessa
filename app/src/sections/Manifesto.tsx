import { QUOTES, SUPPLIERS, VENUE } from '../data/sessa';
import { ScrollWords } from '../components/Reveal';

export function Manifesto() {
  return (
    <section className="manifesto" aria-label="What Sessa is">
      <div className="wrap">
        <span className="eyebrow sc">{VENUE.line}</span>
        <blockquote>
          <ScrollWords text={`“${QUOTES.molly.text}”`} />
          <footer className="sc">
            <span>
              {QUOTES.molly.who}, chef · in {QUOTES.molly.where}
            </span>
            <span>
              {SUPPLIERS[0].who} coffee · {SUPPLIERS[3].who} pastries · low-intervention wine
            </span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
