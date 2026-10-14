import { useEffect } from 'react';
import { HOURS_TEXT, JOBS, JOBS_OFFER, VENUE } from '../data/sessa';

export function Jobs() {
  useEffect(() => {
    document.title = 'Jobs · Sessa, Herne Hill';
    return () => {
      document.title = 'Sessa · All-day bar & café, Herne Hill';
    };
  }, []);

  return (
    <div className="jobs-page">
      <header className="page-head wrap">
        <p className="label eyebrow">Jobs</p>
        <h1 className="h-xl rough-lg">Come and work here.</h1>
        <p className="lede">A small, family run and fully independent bar and café in Herne Hill.</p>
      </header>

      <div className="wrap">
        {JOBS.map((job) => (
          <article key={job.title} className="job">
            <header className="job-head">
              <h2 className="h-l">{job.title}</h2>
              <p className="job-pay price">{job.pay}</p>
            </header>
            <div className="job-grid">
              <div className="job-main">
                <p className="job-intro">{job.intro}</p>
                <h3 className="label">Requirements / expectations</h3>
                <ul className="job-list">
                  {job.requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <a
                  className="btn btn-book"
                  href={`mailto:${VENUE.email}?subject=${encodeURIComponent(job.title)}`}
                >
                  Apply by email <span className="arrow">→</span>
                </a>
                <p className="job-apply">{job.apply}</p>
              </div>
              <aside className="job-side">
                <div>
                  <h3 className="label">What we offer</h3>
                  <ul className="job-list">
                    {JOBS_OFFER.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="label">Opening hours</h3>
                  <ul className="job-hours">
                    {HOURS_TEXT.map((h) => (
                      <li key={h.days}>
                        <span>{h.days}</span>
                        <span>{h.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
