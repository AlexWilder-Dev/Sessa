import { PEOPLE, VENUE } from '../data/sessa';
import { media } from '../lib/media';
import { Reveal } from '../components/Reveal';

export function Room() {
  const [molly, edd, liv] = PEOPLE;
  return (
    <section className="section room" id="room" aria-labelledby="room-title">
      <div className="wrap">
        <div className="room-top">
          <div className="room-intro">
            <p className="label eyebrow">The room</p>
            <h2 id="room-title" className="h-xl rough-lg">
              “The little <br />
              yellow bar”
            </h2>
            <p className="room-said">That’s what customers call it.</p>
          </div>
          <ul className="room-facts">
            <li>
              <b>Butter-yellow walls.</b>
            </li>
            <li>
              <b>A brushed-steel-and-wood bar,</b> made for the room.
            </li>
            <li>
              <b>Vintage furniture,</b> and bar chairs from the sisters’ grandparents’ house.
            </li>
            <li>
              <b>The food on a handwritten chalkboard.</b> Candles at night.
            </li>
            <li>
              <b>Open since {VENUE.opened}.</b>
            </li>
          </ul>
        </div>

        <div className="room-photos">
          <Reveal className="room-photo room-photo-a">
            <figure className="photo">
              <img
                src={media('photo-8.jpg')}
                width={860}
                height={600}
                loading="lazy"
                alt="An evening in the room: candles on dark wooden tables, a long bench, the kitchen pass behind"
              />
            </figure>
          </Reveal>
          <Reveal className="room-photo room-photo-b" delay={0.1}>
            <figure className="photo">
              <img
                src={media('photo-7.jpg')}
                width={860}
                height={600}
                loading="lazy"
                alt="A wooden shelf on the yellow wall, lined with small clay vases of white flowers"
              />
            </figure>
          </Reveal>
        </div>

        <div className="people">
          <Reveal className="people-photo">
            <figure className="photo">
              <img
                src={media('team.jpg')}
                width={860}
                height={600}
                loading="lazy"
                alt="Edd Clibbens, Molly Kyte and Liv Kyte at a table in Sessa, with a candle and drinks"
              />
              <figcaption>Edd Clibbens, Molly Kyte and Liv Kyte</figcaption>
            </figure>
          </Reveal>
          <div className="people-copy">
            <p className="label eyebrow">The people</p>
            <h2 className="people-lines rough">
              <span>
                <b>Molly</b> {molly.does}.
              </span>
              <span>
                <b>Edd</b> {edd.does}.
              </span>
              <span>
                <b>Liv</b> {liv.does}.
              </span>
            </h2>
            <p>
              Sisters {molly.name} and {liv.name}, with Molly’s partner {edd.name}: general manager, wine and
              cocktails, formerly of Forza Wine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
