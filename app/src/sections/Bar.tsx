import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { BOTTLES, BY_THE_GLASS, COCKTAILS, GLASS_SIZE, PEOPLE, STYLES, type Drink } from '../data/sessa';
import { media } from '../lib/media';
import { Picture, Rise, Words } from '../components/Reveal';

export const SWATCH: Record<string, string> = {
  fizz: '#f6efcf',
  'fresh-white': '#f1e6a6',
  'rich-white': '#e3c25f',
  orange: '#dc8d3e',
  pink: '#e8a79e',
  'light-red': '#a8423a',
  'big-red': '#5e1a1f',
  cellar: '#2a2724',
};

function Marquee({ items, reverse }: { items: Drink[]; reverse?: boolean }) {
  const run = (hidden: boolean) => (
    <div className="marquee-track" aria-hidden={hidden || undefined}>
      {items.map((d) => (
        <Fragment key={d.name}>
          <span>
            {d.name} <em>{d.price}</em>
          </span>
          <span className="sep">·</span>
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${reverse ? 'reverse' : ''}`}>
      {run(false)}
      {run(true)}
    </div>
  );
}

export function Bar() {
  return (
    <section className="bar on-dark" id="bar" aria-labelledby="bar-title">
      <div className="wrap">
        <span className="eyebrow sc">The bar</span>
        <h2 id="bar-title">
          <Words as="span" className="line" text="£6.50 a glass." />
          <Words as="span" className="line" text="£7 house martini." italicFrom={0} delay={0.15} />
        </h2>
        <div className="bar-intro">
          <Rise>
            <p className="lede">
              {PEOPLE.edd.name}, once of {PEOPLE.edd.before}, runs the drinks: low-intervention wine that’s
              “non-funky”, and cocktails that are spirit-forward and stirred down. Affordability matters to him, hence the £6.50 glass.
            </p>
          </Rise>
          <Picture
            src={media('martini-bar-860.jpg')}
            alt="A martini with a lemon twist on the brushed-steel bar, a plate of croquetas, a basket of lemons"
          />
        </div>
      </div>

      <div className="marquees" aria-label="Cocktails and wines by the glass">
        <Marquee items={COCKTAILS} />
        <Marquee items={BY_THE_GLASS} reverse />
      </div>

      <div className="wrap bar-lists">
        <div>
          <h3>
            By the glass <small className="sc">{GLASS_SIZE}</small>
          </h3>
          <ul className="priced">
            {BY_THE_GLASS.map((d) => (
              <li key={d.name}>
                <span>{d.name}</span>
                <span>{d.price}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Cocktails</h3>
          <ul className="priced">
            {COCKTAILS.map((d) => (
              <li key={d.name}>
                <span>
                  {d.name}
                  {d.note && <small> {d.note}</small>}
                </span>
                <span>{d.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Cellar() {
  const note = STYLES.find((s) => s.id === 'cellar')!.note!;
  return (
    <section className="cellar" aria-labelledby="cellar-title">
      <div className="wrap">
        <div className="cellar-head">
          <div>
            <span className="eyebrow sc">By the bottle</span>
            <h2 id="cellar-title" className="display">
              <Words text={`Find a bottle.`} />
            </h2>
          </div>
          <Rise>
            <blockquote>
              <p>“{note.split('. ').slice(-1)[0]}”</p>
              <footer className="sc">The cellar list</footer>
            </blockquote>
          </Rise>
        </div>
        <nav className="index" aria-label="The wine list by style">
          {STYLES.map((s) => {
            const list = BOTTLES.filter((b) => b.style === s.id);
            return (
              <Link key={s.id} to={`/wine?style=${s.id}`}>
                <span className="swatch" style={{ background: SWATCH[s.id] }} aria-hidden="true" />
                <span className="name">{s.title}</span>
                <span className="count">
                  {list.length} bottles · from £{Math.min(...list.map((b) => b.price))}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
