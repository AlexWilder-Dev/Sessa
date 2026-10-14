import { Link } from 'react-router-dom';
import { DAYTIME_MENU, EVENING_MENU, KITCHEN_TEXT, type Dish, type MenuId } from '../data/sessa';
import { useClock } from '../lib/clock';
import { media } from '../lib/media';
import { Reveal } from '../components/Reveal';
import { Wordmark } from '../components/Wordmark';

const MENUS: Record<MenuId, { title: string; dishes: Dish[] }> = {
  daytime: { title: 'Daytime', dishes: DAYTIME_MENU.flat().filter((d) => d.board) },
  evening: { title: 'Evening', dishes: EVENING_MENU.flat().filter((d) => d.board) },
};

export function Food() {
  const { now } = useClock();
  return (
    <section className="section food" id="food" aria-labelledby="food-title">
      <div className="wrap food-grid">
        <Reveal className="food-photo">
          <figure className="photo">
            <img
              src={media('photo-3.jpg')}
              width={860}
              height={600}
              loading="lazy"
              alt="In the kitchen: Parmesan grated over a plate of green dumplings, baguettes on the board behind"
            />
          </figure>
        </Reveal>
        <div className="food-copy">
          <p className="label eyebrow">The food</p>
          <h2 id="food-title" className="h-l rough">
            Breakfast, lunch, <em>then small plates.</em>
          </h2>
          <p className="lede">
            Molly cooks a simple breakfast and lunch menu through the day, and seasonal small plates in the evening.
            The menus change often; these are on now.
          </p>
          <div className="menu-cards">
            {(Object.keys(MENUS) as MenuId[]).map((id) => (
              <Link
                key={id}
                to="/menus"
                state={{ tab: id }}
                className={`menu-card menu-card-${id} ${now.menu === id ? 'is-on' : ''}`}
                aria-label={`${MENUS[id].title} menu`}
              >
                <span className="menu-card-top">
                  <span className="menu-card-title">{MENUS[id].title} menu</span>
                  <Wordmark variant="clean" decorative className="menu-card-mark" />
                </span>
                <span className="menu-card-hours">{KITCHEN_TEXT[id]}</span>
                <span className="menu-card-list">
                  {MENUS[id].dishes.map((d) => (
                    <span key={d.name} className="menu-card-row">
                      <span>
                        {d.name}
                        {d.note && <small> ({d.note})</small>}
                      </span>
                      <span>{d.price}</span>
                    </span>
                  ))}
                </span>
                <span className="menu-card-more">
                  {now.menu === id ? <span className="chalk-tag">on now</span> : <span />}
                  <span>Full menu →</span>
                </span>
              </Link>
            ))}
          </div>
          <Link className="btn btn-line" to="/menus">
            All menus, and drinks <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
