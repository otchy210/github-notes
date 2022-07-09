import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';

const appContainer = document.getElementById('app');
if (appContainer) {
  const root = createRoot(appContainer);
  root.render(<App />);
}
