import { PRESS } from '../data/sessa';

export function Press() {
  const [lead, ...rest] = PRESS;
  return (
    <section className="section press" aria-label="What people have written">
      <div className="wrap">
        <blockquote className="lead">
          <p>“{lead.text}”</p>
          <footer className="sc">{lead.where}</footer>
        </blockquote>
        <div className="rest">
          {rest.map((q) => (
            <blockquote key={q.text}>
              <p>“{q.text}”</p>
              <footer className="sc">{q.where}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
