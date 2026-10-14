import { Link } from 'react-router-dom';
import { useTitle } from '../lib/title';

export function NotFound() {
  useTitle('Not found');
  return (
    <div className="page">
      <div className="page-head wrap notfound">
        <h1 className="display">Wrong door.</h1>
        <p className="lede">
          Nothing here. <Link className="link" to="/">Back to the bar</Link>.
        </p>
      </div>
    </div>
  );
}
