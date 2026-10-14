import { PEOPLE, ROOM, VENUE } from '../data/sessa';
import { media } from '../lib/media';

export function Room() {
  const { molly, edd, liv } = PEOPLE;
  return (
    <section className="section room field" id="room" aria-labelledby="room-title">
      <div className="wrap">
        <div className="room-top">
          <div>
            <span className="eyebrow sc">The room</span>
            <h2 id="room-title" className="display">
              The little <em>yellow bar.</em>
            </h2>
          </div>
          <p className="lede">
            {ROOM.said} {ROOM.description} Open since {VENUE.opened}.
          </p>
        </div>
        <div className="room-photos">
          <figure className="photo a">
            <img src={media('room-evening-860.jpg')} loading="lazy" alt="An evening at Sessa: candles on dark wooden tables, the long banquette, the kitchen pass behind" />
          </figure>
          <figure className="photo b">
            <img src={media('kitchen-700.jpg')} loading="lazy" alt="Laughing in the open kitchen, pans hanging behind" />
          </figure>
        </div>

        <div className="people">
          <figure>
            <div className="photo">
              <img src={media('team-860.jpg')} loading="lazy" alt="Edd Clibbens, Molly Kyte and Liv Kyte at a table in Sessa" />
            </div>
            <figcaption className="caption">
              {edd.name}, {molly.name} and {liv.name}
            </figcaption>
          </figure>
          <div>
            <span className="eyebrow sc">The people</span>
            <h3>
              <span>Molly cooks.</span>
              <span>Edd runs the drinks.</span>
              <span>Liv runs the business.</span>
            </h3>
            <p>
              Sisters {molly.name} and {liv.name}, and Molly’s partner {edd.name}. The sisters also run Planted, the
              catering company they’ve had for ten years, cooking for fashion, TV and film.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
