import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="page-head wrap notfound">
      <p className="label eyebrow">Not here</p>
      <h1 className="h-xl rough-lg">Wrong door.</h1>
      <p className="lede">
        That page doesn’t exist. <Link className="link" to="/">Back to the bar</Link>.
      </p>
    </div>
  );
}
