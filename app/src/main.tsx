import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/eb-garamond/wght.css';
import '@fontsource-variable/eb-garamond/wght-italic.css';
import './styles/site.css';
import { App } from './App';
import { startMoment } from './lib/clock';
import { stateAt } from './lib/time';
import { applyLight } from './lib/light';

// "#me" marks this browser as the owner's (see the ping in index.html).
if (window.location.hash === '#me') {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#/`);
}

// Light the page for the hour before the first paint.
applyLight(stateAt(startMoment()));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
