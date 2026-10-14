import { JOB, VENUE } from '../data/sessa';
import { useTitle } from '../lib/title';
import { Rise, Words } from '../components/Reveal';

export function Jobs() {
  useTitle('Jobs');
  return (
    <div className="page">
      <header className="page-head wrap">
        <span className="eyebrow sc">Jobs</span>
        <h1 className="poster">
          <Words text="Come and cook with us." italicFrom={3} />
        </h1>
      </header>
      <article className="wrap split job">
        <Rise>
          <h2 className="title">{JOB.title}</h2>
          <p className="pay">{JOB.pay}</p>
          <p className="job-intro">{JOB.intro}</p>
          <h3 className="sc">Requirements and expectations</h3>
          <ul>
            {JOB.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <div className="actions">
            <a className="pill pill-solid" href={`mailto:${VENUE.email}?subject=${encodeURIComponent(JOB.title)}`}>
              Apply by email
            </a>
          </div>
          <p className="note">{JOB.apply}</p>
        </Rise>
        <Rise delay={0.15} className="job-side">
          <h3 className="sc">What we offer</h3>
          <ul>
            {JOB.offer.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <h3 className="sc">Opening hours</h3>
          <ul>
            <li>Tuesday – Thursday: 9am – 10:30pm</li>
            <li>Friday: 9am – 11pm</li>
            <li>Saturday: 9am – 11pm</li>
            <li>Sunday: 9am – 3pm</li>
          </ul>
        </Rise>
      </article>
    </div>
  );
}
