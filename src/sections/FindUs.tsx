import { DAYS, DAYS_SHORT, HOURS, KITCHEN, VENUE } from '../data/sessa';
import { useClock } from '../lib/clock';
import { clock } from '../lib/time';

const ORDER = [1, 2, 3, 4, 5, 6, 0];
const range = (s: { from: number; to: number } | null) => (s ? `${clock(s.from)}–${clock(s.to)}` : '–');

export function HoursTable() {
  const { now } = useClock();
  return (
    <table className="hours">
      <caption className="label">Hours</caption>
      <thead>
        <tr>
          <th scope="col">
            <span className="visually-hidden">Day</span>
          </th>
          <th scope="col">Open</th>
          <th scope="col">Daytime menu</th>
          <th scope="col">Evening menu</th>
        </tr>
      </thead>
      <tbody>
        {ORDER.map((d) => (
          <tr key={d} className={`${now.day === d ? 'is-today' : ''} ${HOURS[d] ? '' : 'is-closed'}`}>
            <th scope="row">
              <span className="day-long">{DAYS[d]}</span>
              <span className="day-short">{DAYS_SHORT[d]}</span>
              {now.day === d && <span className="chalk-tag">today</span>}
            </th>
            <td>{HOURS[d] ? range(HOURS[d]) : 'Closed'}</td>
            <td>{range(KITCHEN.daytime[d])}</td>
            <td>{range(KITCHEN.evening[d])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function FindUs() {
  return (
    <section className="section find" id="find-us" aria-labelledby="find-title">
      <div className="wrap">
        <div className="find-top">
          <div>
            <p className="label eyebrow">Find us</p>
            <h2 id="find-title" className="h-l rough">
              {VENUE.street}
            </h2>
            <p className="find-address">
              Herne Hill, {VENUE.city} {VENUE.postcode}
            </p>
          </div>
          <div className="find-actions">
            <a className="btn btn-book" href={VENUE.directionsHref} target="_blank" rel="noopener">
              Directions <span className="arrow">→</span>
            </a>
            <a className="btn btn-line" href={VENUE.bookHref} target="_blank" rel="noopener">
              Book a table
            </a>
          </div>
        </div>

        <ol className="whereabouts" aria-label={VENUE.whereabouts}>
          <li className="wb-stop">
            <span className="wb-dot" aria-hidden="true" />
            <b>Herne Hill station</b>
          </li>
          <li className="wb-link" aria-hidden="true">
            <span>opposite</span>
          </li>
          <li className="wb-stop wb-sessa">
            <span className="wb-dot" aria-hidden="true" />
            <b>Sessa</b>
            <small>{VENUE.street}</small>
          </li>
          <li className="wb-link" aria-hidden="true">
            <span>a short walk</span>
          </li>
          <li className="wb-stop">
            <span className="wb-dot" aria-hidden="true" />
            <b>Brockwell Park</b>
          </li>
        </ol>

        <div className="find-grid">
          <dl className="contact">
            <div>
              <dt className="label">Phone</dt>
              <dd>
                <a href={VENUE.phoneHref}>{VENUE.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="label">Email</dt>
              <dd>
                <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>
              </dd>
            </div>
            <div>
              <dt className="label">Instagram</dt>
              <dd>
                <a href={VENUE.instagramHref} target="_blank" rel="noopener">
                  @sessa.london
                </a>
              </dd>
            </div>
          </dl>
          <div className="find-hours">
            <HoursTable />
          </div>
        </div>
      </div>
    </section>
  );
}
