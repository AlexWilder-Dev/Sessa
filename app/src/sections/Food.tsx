import { Link } from 'react-router-dom';
import { DAYTIME_MENU, EVENING_MENU, QUOTES, type Dish, type MenuId } from '../data/sessa';
import { useClock } from '../lib/clock';
import { media } from '../lib/media';

const PICKS: { id: MenuId; title: string; hours: string; dishes: Dish[] }[] = [
  { id: 'daytime', title: 'Daytime', hours: '9am – 3pm, Sundays till 2', dishes: DAYTIME_MENU.flat().filter((d) => d.feature) },
  { id: 'evening', title: 'Evening', hours: '6pm – 9:30pm, Tuesday to Saturday', dishes: EVENING_MENU.flat().filter((d) => d.feature) },
];

export function Food() {
  const { now } = useClock();
  return (
    <section className="section food field" id="food" aria-labelledby="food-title">
      <div className="wrap">
        <div className="food-photos">
          <figure className="photo big">
            <img src={media('saucisson-1200.jpg')} srcSet={`${media('saucisson-700.jpg')} 700w, ${media('saucisson-1200.jpg')} 1200w`} sizes="(min-width: 1000px) 45vw, 100vw" loading="lazy" alt="Saucisson and cornichons on a yellow plate, red wine, the red-splattered table" />
          </figure>
          <figure className="photo small">
            <img src={media('grating-700.jpg')} loading="lazy" alt="Cheese grated over a dish, tattooed hands, a navy work shirt" />
          </figure>
        </div>
        <div>
          <span className="eyebrow sc">The food</span>
          <blockquote>
            <p id="food-title" className="title">
              “{QUOTES.mollyFood.text}”
            </p>
            <footer className="sc">Molly Kyte, on her cooking</footer>
          </blockquote>
          <p className="lede">
            A simple breakfast and lunch through the day, seasonal small plates in the evening, and Toklas pastries in
            the morning. The menus change often; this is what’s on now.
          </p>
          <div className="menus-pair">
            {PICKS.map((p) => (
              <div key={p.id} className="menu-col">
                <h3>
                  {p.title}
                  {now.menu === p.id && <em className="red">on now</em>}
                </h3>
                <p>{p.hours}</p>
                <ul className="priced">
                  {p.dishes.map((d) => (
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
            ))}
          </div>
          <Link className="pill" to="/menus">
            The full menus
          </Link>
        </div>
      </div>
    </section>
  );
}
