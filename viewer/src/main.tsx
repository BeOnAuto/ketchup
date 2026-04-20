import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('root element not found');
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
