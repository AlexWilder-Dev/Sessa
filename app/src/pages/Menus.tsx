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
  SPIRITS,
  type Dish,
  type Drink,
} from '../data/sessa';
import { useClock } from '../lib/clock';
import { defaultMenu } from '../lib/time';
import { useTitle } from '../lib/title';
import { Words } from '../components/Reveal';
import { Wordmark } from '../components/Wordmark';

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

function Group({ title, note, items }: { title: string; note?: string; items: Drink[] }) {
  return (
    <section>
      <h3>
        {title}
        {note && <small>{note}</small>}
      </h3>
      <ul>
        {items.map((d) => (
          <Item key={d.name} d={d} />
        ))}
      </ul>
    </section>
  );
}

function CardHead({ title, sub }: { title: string; sub: string }) {
  return (
    <header>
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      <span className="card-mark">
        <Wordmark small />
      </span>
    </header>
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
    <div className="page menus-page">
      <header className="page-head wrap">
        <span className="eyebrow sc">Food & drink</span>
        <h1 className="poster">
          <Words text="The menus." italicFrom={1} />
        </h1>
        <p className="lede">The printed menus, made readable. They change often; this is the current one.</p>
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
                aria-controls="menu-card"
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

      <div className="wrap menu-stage">
        <AnimatePresence mode="wait" initial={false}>
          <m.article
            key={tab}
            id="menu-card"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className={`menu-card ${tab === 'drinks' ? 'wide' : ''}`}
            initial={{ rotateY: -82, opacity: 0.4 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 82, opacity: 0.4 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          >
            {tab === 'daytime' && (
              <>
                <CardHead title="Daytime Menu" sub="Tues – Sat 9am – 3pm // Sunday 9am – 2pm" />
                {DAYTIME_MENU.map((g, i) => (
                  <ul key={i} className="menu-group">
                    {g.map((d) => (
                      <Item key={d.name} d={d} />
                    ))}
                  </ul>
                ))}
              </>
            )}
            {tab === 'evening' && (
              <>
                <CardHead title="Evening Menu" sub="Tues – Sat 6pm – 9:30pm" />
                {EVENING_MENU.map((g, i) => (
                  <ul key={i} className="menu-group">
                    {g.map((d) => (
                      <Item key={d.name} d={d} />
                    ))}
                  </ul>
                ))}
              </>
            )}
            {tab === 'drinks' && (
              <>
                <CardHead title="Drinks" sub={`And ${BOTTLES.length} bottles on the wine list.`} />
                <div className="drinks-grid">
                  <Group title="Wine by the glass" note={GLASS_SIZE} items={BY_THE_GLASS} />
                  <Group title="Cocktails" items={COCKTAILS} />
                  <Group title="Beers" note={BEER_NOTE} items={BEER} />
                  <Group title="Alcohol free" items={ALCOHOL_FREE} />
                  <Group title="Spirits etc" items={SPIRITS} />
                  <section>
                    <h3>Hot drinks</h3>
                    <ul>
                      <li className="dish">
                        <span>
                          <span className="dish-name">{HOT_DRINKS.makers}</span>
                          <span className="dish-note">{HOT_DRINKS.note.toLowerCase()}</span>
                        </span>
                      </li>
                    </ul>
                    <p style={{ marginTop: 24 }}>
                      <Link className="link" to="/wine">
                        Find a bottle →
                      </Link>
                    </p>
                  </section>
                </div>
              </>
            )}
          </m.article>
        </AnimatePresence>
        <p className="allergy">{ALLERGY_LINE}</p>
      </div>
    </div>
  );
}
