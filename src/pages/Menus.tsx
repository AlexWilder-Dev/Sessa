import { useEffect, useRef, type KeyboardEvent } from 'react';
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

type Tab = 'daytime' | 'evening' | 'drinks';
const TABS: { id: Tab; label: string; note: string }[] = [
  { id: 'daytime', label: 'Daytime', note: '9am – 3pm' },
  { id: 'evening', label: 'Evening', note: '6pm – 9:30pm' },
  { id: 'drinks', label: 'Drinks', note: 'All day' },
];

function Dishes({ groups }: { groups: Dish[][] }) {
  return (
    <div className="menu-groups">
      {groups.map((g, i) => (
        <ul key={i} className="menu-list">
          {g.map((d) => (
            <li key={d.name}>
              <div className="menu-item">
                <span className="menu-name">{d.name}</span>
                {d.detail && <span className="menu-detail">{d.detail}</span>}
                {d.note && <span className="menu-note">{d.note}</span>}
              </div>
              <span className="price">{d.price}</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function Drinks({ title, note, items }: { title: string; note?: string; items: Drink[] }) {
  return (
    <section className="drinks-block">
      <h3>
        {title}
        {note && <small>{note}</small>}
      </h3>
      <ul className="menu-list">
        {items.map((d) => (
          <li key={d.name}>
            <div className="menu-item">
              <span className="menu-name">{d.name}</span>
              {d.detail && <span className="menu-detail">{d.detail}</span>}
              {d.note && <span className="menu-note">{d.note}</span>}
            </div>
            <span className="price">{d.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Menus() {
  const { now } = useClock();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const fromState = (location.state as { tab?: Tab } | null)?.tab;
  const param = params.get('tab') as Tab | null;
  const tab: Tab = param && TABS.some((t) => t.id === param) ? param : fromState ?? defaultMenu(now);
  const tabsRef = useRef<HTMLDivElement>(null);

  const choose = (id: Tab) => {
    setParams({ tab: id }, { replace: true, state: location.state });
    const top = tabsRef.current?.getBoundingClientRect().top ?? 0;
    const stuck = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60;
    if (top < stuck - 1) {
      const y = window.scrollY + top - stuck;
      window.scrollTo({ top: y });
    }
  };

  useEffect(() => {
    document.title = 'Menus · Sessa, Herne Hill';
    return () => {
      document.title = 'Sessa · All-day bar & café, Herne Hill';
    };
  }, []);

  const onKey = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
      choose(next.id);
      document.getElementById(`tab-${next.id}`)?.focus();
    }
  };

  return (
    <div className="menus-page">
      <header className="page-head wrap">
        <p className="label eyebrow">Food and drink</p>
        <h1 className="h-xl rough-lg">Menus</h1>
        <p className="lede">
          Breakfast and lunch through the day, seasonal small plates in the evening. The menus change often; this is
          the current one.
        </p>
      </header>

      <div className="menu-tabs" ref={tabsRef}>
        <div className="wrap">
          <div role="tablist" aria-label="Menus" onKeyDown={onKey}>
            {TABS.map((t) => {
              const live = t.id !== 'drinks' && now.menu === t.id;
              return (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  className={`menu-tab ${tab === t.id ? 'is-on' : ''}`}
                  onClick={() => choose(t.id)}
                >
                  <span className="menu-tab-label">{t.label}</span>
                  <span className="menu-tab-note">{live ? 'on now' : t.note}</span>
                  {tab === t.id && <m.span layoutId="menu-tab-line" className="menu-tab-line" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="wrap menu-body">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className="menu-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {tab === 'daytime' && (
              <>
                <div className="menu-panel-head">
                  <h2 className="h-l">Daytime</h2>
                  <p>{KITCHEN_TEXT.daytime}</p>
                  {now.menu === 'daytime' && <span className="chalk-tag">on now</span>}
                </div>
                <Dishes groups={DAYTIME_MENU} />
              </>
            )}
            {tab === 'evening' && (
              <>
                <div className="menu-panel-head">
                  <h2 className="h-l">Evening</h2>
                  <p>{KITCHEN_TEXT.evening}</p>
                  {now.menu === 'evening' && <span className="chalk-tag">on now</span>}
                </div>
                <Dishes groups={EVENING_MENU} />
              </>
            )}
            {tab === 'drinks' && (
              <>
                <div className="menu-panel-head">
                  <h2 className="h-l">Drinks</h2>
                  <p>Wine by the glass from £6.50. The house martini is £7.</p>
                </div>
                <div className="drinks-grid">
                  <Drinks title="Wine by the glass" note={GLASS_SIZE} items={BY_THE_GLASS} />
                  <Drinks title="Cocktails" items={COCKTAILS} />
                  <Drinks title="Beer" note={BEER_NOTE} items={BEER} />
                  <Drinks title="Alcohol free" items={ALCOHOL_FREE} />
                  <Drinks title="Spirits etc" items={SPIRITS} />
                  <section className="drinks-block">
                    <h3>Hot drinks</h3>
                    <p className="hot-board">
                      <span className="chalk-tag">{HOT_DRINKS.note.toLowerCase()}</span>
                    </p>
                    <p className="hot-makers">{HOT_DRINKS.makers.join(' · ')}</p>
                  </section>
                </div>
                <Link className="bottle-link" to="/wine">
                  <span className="label">By the bottle</span>
                  <span className="bottle-link-title">Find a bottle</span>
                  <span>
                    {BOTTLES.length} bottles by style, including the cellar list. <span className="arrow">→</span>
                  </span>
                </Link>
              </>
            )}
          </m.div>
        </AnimatePresence>

        <p className="allergy">{ALLERGY_LINE}</p>
      </div>
    </div>
  );
}
