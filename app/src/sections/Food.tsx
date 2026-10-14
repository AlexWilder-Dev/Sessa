import { Link } from 'react-router-dom';
import { DAYTIME_MENU, EVENING_MENU, QUOTES, type Dish, type MenuId } from '../data/sessa';
import { useClock } from '../lib/clock';
import { media } from '../lib/media';
import { Picture, Rise, Words } from '../components/Reveal';
import { Wordmark } from '../components/Wordmark';

const CARDS: { id: MenuId; title: string; hours: string; dishes: Dish[] }[] = [
  { id: 'daytime', title: 'Daytime Menu', hours: 'Tues – Sat 9am – 3pm // Sunday 9am – 2pm', dishes: DAYTIME_MENU.flat().filter((d) => d.feature) },
  { id: 'evening', title: 'Evening Menu', hours: 'Tues – Sat 6pm – 9:30pm', dishes: EVENING_MENU.flat().filter((d) => d.feature) },
];

export function Food() {
  const { now } = useClock();
  return (
    <section className="food" id="food" aria-labelledby="food-title">
      <div className="wrap">
        <span className="eyebrow sc">The food</span>
        <div className="food-head">
          <h2 id="food-title" className="display">
            <Words text={`“${QUOTES.mollyFood.text}”`} italicFrom={0} />
          </h2>
          <Rise className="lede">
            <p>
              Molly’s cooking. A simple breakfast and lunch through the day, Toklas pastries in the morning, and
              seasonal small plates in the evening. It changes often, and it’s written up on the chalkboard.
            </p>
          </Rise>
        </div>

        <div className="collage">
          <Picture
            className="a"
            src={media('saucisson-1200.jpg')}
            srcSet={`${media('saucisson-700.jpg')} 700w, ${media('saucisson-1200.jpg')} 1200w`}
            sizes="(min-width: 800px) 58vw, 100vw"
            alt="Saucisson and cornichons on a yellow plate, red wine, the red-splattered table"
          />
          <Picture className="b" src={media('salad-700.jpg')} alt="A salad piled with shaved cheese, carried out of the kitchen" delay={0.15} position="50% 60%" />
          <Picture className="c" src={media('grating-700.jpg')} alt="Cheese grated over a plate, tattooed hands" delay={0.3} />
        </div>

        <div className="cards">
          {CARDS.map((c) => (
            <Link key={c.id} to="/menus" state={{ tab: c.id }} className="card" aria-label={`${c.title}, see the full menu`}>
              {now.menu === c.id && <span className="stamp">on now</span>}
              <div className="card-top">
                <div>
                  <h3>{c.title}</h3>
                  <p className="hours">{c.hours}</p>
                </div>
                <span className="card-mark">
                  <Wordmark small />
                </span>
              </div>
              <ul>
                {c.dishes.map((d) => (
                  <li key={d.name}>
                    <span>
                      {d.name}
                      {d.note && <small> ({d.note})</small>}
                    </span>
                    <span>{d.price}</span>
                  </li>
                ))}
              </ul>
              <div className="card-foot">
                <span className="sc">A few from the menu</span>
                <span>Full menu →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
