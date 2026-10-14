import { type KeyboardEvent } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import {
  ALCOHOL_FREE,
  ALLERGY_LINE,
  BEER,
  BEER_NOTE,
  BOTTLES,
  BY_THE_GLASS,
  COCKTAILS,
  DAYTIME_MENU,
  EVENING_MENU,
  GLASS_SIZE,
  HOT_DRINKS,
  KITCHEN_TEXT,
  SPIRITS,
  type Dish,
  type Drink,
} from '../data/sessa';
import { useClock } from '../lib/clock';
import { defaultMenu } from '../lib/time';
import { useTitle } from '../lib/title';

type Tab = 'daytime' | 'evening' | 'drinks';
const TABS: { id: Tab; label: string }[] = [
  { id: 'daytime', label: 'Daytime' },
  { id: 'evening', label: 'Evening' },
  { id: 'drinks', label: 'Drinks' },
];

function Item({ d }: { d: Dish | Drink }) {
  return (
    <li className="dish">
      <span>
        <span className="dish-name">{d.name}</span>
        {d.detail && <span className="dish-detail">{d.detail}</span>}
        {d.note && <span className="dish-note">{d.note}</span>}
      </span>
      <span className="dish-price">{d.price}</span>
    </li>
  );
}

function Dishes({ groups }: { groups: Dish[][] }) {
  return (
    <>
      {groups.map((g, i) => (
        <ul key={i} className="menu-group">
          {g.map((d) => (
            <Item key={d.name} d={d} />
          ))}
        </ul>
      ))}
    </>
  );
}

function DrinkList({ title, note, items }: { title: string; note?: string; items: Drink[] }) {
  return (
    <section>
      <h3>
        {title}
        {note && <small className="sc">{note}</small>}
      </h3>
      <ul>
        {items.map((d) => (
          <Item key={d.name} d={d} />
        ))}
      </ul>
    </section>
  );
}

export function Menus() {
  useTitle('Menus');
  const { now } = useClock();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const asked = (params.get('tab') ?? (location.state as { tab?: string } | null)?.tab) as Tab | undefined;
  const tab: Tab = TABS.some((t) => t.id === asked) ? asked! : defaultMenu(now);

  const choose = (id: Tab) => setParams({ tab: id }, { replace: true });
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === tab);
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3];
    choose(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <div className="page">
      <header className="page-head wrap">
        <span className="eyebrow sc">Food & drink</span>
        <h1 className="display">Menus</h1>
        <p className="lede">They change often, with the seasons and the chalkboard. This is the current one.</p>
      </header>

      <div className="tabs">
        <div className="wrap">
          <div role="tablist" aria-label="Menus" onKeyDown={onKey}>
            {TABS.map((t) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="menu-panel"
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => choose(t.id)}
              >
                {t.label}
                {t.id === now.menu && <em>on now</em>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap menu-body">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={tab}
            id="menu-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className={`menu-sheet ${tab === 'drinks' ? 'wide' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {tab === 'daytime' && (
              <>
                <header>
                  <h2>Daytime</h2>
                  <p>{KITCHEN_TEXT.daytime}</p>
                </header>
                <Dishes groups={DAYTIME_MENU} />
              </>
            )}
            {tab === 'evening' && (
              <>
                <header>
                  <h2>Evening</h2>
                  <p>{KITCHEN_TEXT.evening}</p>
                </header>
                <Dishes groups={EVENING_MENU} />
              </>
            )}
            {tab === 'drinks' && (
              <>
                <header>
                  <h2>Drinks</h2>
                  <p>
                    {BOTTLES.length} bottles on the{' '}
                    <Link className="link" to="/wine">
                      wine list
                    </Link>
                    , too.
                  </p>
                </header>
                <div className="drinks-grid">
                  <DrinkList title="Wine by the glass" note={GLASS_SIZE} items={BY_THE_GLASS} />
                  <DrinkList title="Cocktails" items={COCKTAILS} />
                  <DrinkList title="Beer" note={BEER_NOTE} items={BEER} />
                  <DrinkList title="Alcohol free" items={ALCOHOL_FREE} />
                  <DrinkList title="Spirits etc" items={SPIRITS} />
                  <section>
                    <h3>Hot drinks</h3>
                    <ul>
                      <li className="dish">
                        <span>
                          <span className="dish-name">{HOT_DRINKS.makers}</span>
                          <span className="dish-detail">{HOT_DRINKS.note}</span>
                        </span>
                      </li>
                    </ul>
                  </section>
                </div>
              </>
            )}
          </m.div>
        </AnimatePresence>
        <p className="allergy">{ALLERGY_LINE}</p>
      </div>
    </div>
  );
}
