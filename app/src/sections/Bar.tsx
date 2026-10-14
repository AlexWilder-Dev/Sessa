import { Link } from 'react-router-dom';
import { BOTTLES, BY_THE_GLASS, COCKTAILS, GLASS_SIZE, PEOPLE, STYLES } from '../data/sessa';
import { media } from '../lib/media';

export function Bar() {
  const cellar = STYLES.find((s) => s.id === 'cellar')!;
  return (
    <section className="section bar" id="bar" aria-labelledby="bar-title">
      <div className="wrap">
        <div className="bar-top">
          <div>
            <span className="eyebrow sc">The bar</span>
            <h2 id="bar-title" className="display">
              £6.50 a glass. <em>£7 for the house martini.</em>
            </h2>
            <p className="lede">
              {PEOPLE.edd.name}, once of {PEOPLE.edd.before}, runs the drinks: low-intervention but “non-funky” wine, and
              cocktails that are spirit-forward and stirred down.
            </p>
          </div>
          <figure className="photo">
            <img src={media('martini-bar-860.jpg')} loading="lazy" alt="A martini with a lemon twist on the brushed-steel bar, a plate of croquetas, a basket of lemons" />
          </figure>
        </div>

        <div className="bar-lists">
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

        <div className="bottles-index">
          <div>
            <span className="eyebrow sc">By the bottle</span>
            <h3 className="title">Find a bottle</h3>
            <blockquote>
              <p>“{cellar.note!.split('. ').slice(-1)[0]}”</p>
              <footer className="sc">The cellar list</footer>
            </blockquote>
          </div>
          <nav className="index" aria-label="The wine list by style">
            {STYLES.map((s) => {
              const list = BOTTLES.filter((b) => b.style === s.id);
              return (
                <Link key={s.id} to={`/wine?style=${s.id}`}>
                  <span className="name">{s.title}</span>
                  <span className="leader" aria-hidden="true" />
                  <span className="count">
                    {list.length} · from £{Math.min(...list.map((b) => b.price))}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
