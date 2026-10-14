import { PRESS } from '../data/sessa';
import { Rise, Words } from '../components/Reveal';

export function Press() {
  const [lead, ...rest] = PRESS;
  return (
    <section className="press" aria-label="What people have written">
      <div className="wrap">
        <blockquote className="lead">
          <p>
            <Words text={`“${lead.text}”`} />
          </p>
          <footer className="sc">{lead.where}</footer>
        </blockquote>
        <div className="rest">
          {rest.map((q, i) => (
            <Rise key={q.text} delay={i * 0.12}>
              <blockquote>
                <p>“{q.text}”</p>
                <footer className="sc">{q.where}</footer>
              </blockquote>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
