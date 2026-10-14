import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/soft-italic.css';
import '@fontsource-variable/instrument-sans/wght.css';
import '@fontsource/gochi-hand/400.css';
import './styles/base.css';
import './styles/home.css';
import './styles/pages.css';
import { App } from './App';
import { initialMoment } from './lib/clock';
import { stateAt } from './lib/time';
import { applyPalette, paletteFor } from './lib/palette';

// "#me" marks this browser as the site owner's (see the ping in index.html);
// tidy it back to the home route once it has been read.
if (window.location.hash === '#me') {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/`);
}

// Light the page for the right hour before the first paint.
applyPalette(paletteFor(stateAt(initialMoment())));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
