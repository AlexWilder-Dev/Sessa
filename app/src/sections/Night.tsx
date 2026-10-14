import { DAYS, DAYS_SHORT, HOURS, KITCHEN, VENUE, type Span } from '../data/sessa';
import { useClock } from '../lib/clock';
import { clock } from '../lib/time';
import { Rise, Words } from '../components/Reveal';

const ORDER = [2, 3, 4, 5, 6, 0, 1];
const span = (s: Span | null) => (s ? `${clock(s.from)}–${clock(s.to)}` : '–');

/* Find us, at closing time. */
export function Night() {
  const { now } = useClock();
  return (
    <section className="night on-dark" id="find-us" aria-labelledby="find-title">
      <div className="wrap">
        <div>
          <span className="eyebrow sc">Find us</span>
          <h2 id="find-title">
            <Words as="span" text="222 Railton" />
            <br />
            <Words as="span" text="Road." italicFrom={0} delay={0.1} />
          </h2>
          <p className="where">
            {VENUE.area}, {VENUE.city} {VENUE.postcode}. {VENUE.whereabouts}
          </p>
          <div className="actions">
            <a className="pill pill-solid" href={VENUE.directionsHref} target="_blank" rel="noopener">
              Directions
            </a>
            <a className="pill" href={VENUE.bookHref} target="_blank" rel="noopener">
              Book a table
            </a>
          </div>
          <dl className="contact">
            <div>
              <dt className="sc">Phone</dt>
              <dd>
                <a href={VENUE.phoneHref}>{VENUE.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="sc">Email</dt>
              <dd>
                <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>
              </dd>
            </div>
            <div>
              <dt className="sc">Instagram</dt>
              <dd>
                <a href={VENUE.instagramHref} target="_blank" rel="noopener">
                  {VENUE.instagram}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <Rise>
          <table className="hours">
            <caption className="sc">Hours</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="hidden">Day</span>
                </th>
                <th scope="col" className="sc">
                  Open
                </th>
                <th scope="col" className="sc">
                  Daytime menu
                </th>
                <th scope="col" className="sc">
                  Evening menu
                </th>
              </tr>
            </thead>
            <tbody>
              {ORDER.map((d) => (
                <tr key={d} className={`${d === now.day ? 'today' : ''} ${HOURS[d] ? '' : 'shut'}`}>
                  <th scope="row">
                    <span className="long">{DAYS[d]}</span>
                    <span className="short">{DAYS_SHORT[d]}</span>
                  </th>
                  <td>{HOURS[d] ? span(HOURS[d]) : 'Closed'}</td>
                  <td>{span(KITCHEN.daytime[d])}</td>
                  <td>{span(KITCHEN.evening[d])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Rise>
      </div>
    </section>
  );
}
