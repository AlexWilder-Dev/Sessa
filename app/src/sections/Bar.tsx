import { Fragment, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { BOTTLES, BY_THE_GLASS, COCKTAILS, GLASS_SIZE, HEADLINE_PRICES, WINE_STYLES } from '../data/sessa';
import { media } from '../lib/media';
import { Reveal } from '../components/Reveal';

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const inWords = (n: number) => WORDS[n] ?? String(n);

/* The glass list, grouped by price: what does £9 get you? */
const LADDER = [...new Set(BY_THE_GLASS.map((d) => d.price))]
  .sort((a, b) => parseFloat(a.slice(1)) - parseFloat(b.slice(1)))
  .map((price) => ({ price, names: BY_THE_GLASS.filter((d) => d.price === price).map((d) => d.name) }));

const maxCount = Math.max(...WINE_STYLES.map((s) => BOTTLES.filter((b) => b.style === s.id).length));

export function Bar() {
  const cellar = WINE_STYLES.find((s) => s.id === 'cellar')!;
  return (
    <section className="section bar" id="bar" aria-labelledby="bar-title">
      <div className="wrap">
        <p className="label eyebrow">The bar</p>
        <h2 id="bar-title" className="visually-hidden">
          The bar
        </h2>

        <div className="bar-top">
          <div className="bar-prices">
            <p className="big-price">
              <span className="price rough-lg">{HEADLINE_PRICES.glass.price}</span>
              <span className="big-price-what">{HEADLINE_PRICES.glass.what}</span>
            </p>
            <p className="big-price">
              <span className="price rough-lg">{HEADLINE_PRICES.martini.price}</span>
              <span className="big-price-what">{HEADLINE_PRICES.martini.what}</span>
            </p>
            <p className="lede bar-lede">
              Edd Clibbens runs the drinks: {BOTTLES.length} low-intervention bottles sorted by style,{' '}
              {inWords(BY_THE_GLASS.length)} wines by the glass and a short list of cocktails, poured across a
              brushed-steel bar.
            </p>
          </div>
          <Reveal className="bar-photo">
            <figure className="photo">
              <img
                src={media('photo-5.jpg')}
                width={860}
                height={600}
                loading="lazy"
                alt="A martini with a lemon twist on the steel bar, next to a plate of croquetas and a basket of lemons"
              />
            </figure>
          </Reveal>
        </div>

        <div className="bar-lists">
          <div className="glass-ladder">
            <h3>
              By the glass <small>{GLASS_SIZE}</small>
            </h3>
            <ol className="ladder">
              {LADDER.map((step, i) => (
                <li key={step.price} className="ladder-step" style={{ '--step': i } as CSSProperties}>
                  <span className="price ladder-price">{step.price}</span>
                  <span className="ladder-tread" aria-hidden="true" />
                  <ul>
                    {step.names.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
          <div className="cocktail-card">
            <h3>Cocktails</h3>
            <p className="cocktail-prose">
              {COCKTAILS.map((c) => (
                <Fragment key={c.name}>
                  <span className="ck">
                    <span className="ck-name">{c.name}</span> <span className="price">{c.price}</span>
                    {c.note && <small className="ck-note"> {c.note}</small>}
                  </span>{' '}
                </Fragment>
              ))}
            </p>
          </div>
        </div>

        <div className="shelf-block">
          <div className="shelf-head">
            <div>
              <h3 className="h-m rough">Find a bottle</h3>
              <p>
                The whole list, sorted the way it is on paper, with a price range and a switch for bottles that come
                chilled.
              </p>
            </div>
            <blockquote className="shelf-quote">
              <p>“{cellar.note!.split('. ').slice(-1)[0]}”</p>
              <footer>From the cellar list</footer>
            </blockquote>
          </div>
          <div className="bottle-shelf" role="list">
            {WINE_STYLES.map((s) => {
              const bottles = BOTTLES.filter((b) => b.style === s.id);
              const from = Math.min(...bottles.map((b) => b.price));
              return (
                <Link
                  role="listitem"
                  key={s.id}
                  to={`/wine?style=${s.id}`}
                  className={`shelf-item shelf-${s.id}`}
                  style={{ '--fill': bottles.length / maxCount } as CSSProperties}
                >
                  <span className="shelf-bottle" aria-hidden="true">
                    <b>{bottles.length}</b>
                  </span>
                  <span className="shelf-name">{s.short}</span>
                  <span className="shelf-from">from £{from}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
