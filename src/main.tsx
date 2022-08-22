/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import 'uno.css';
import '@/lib/css/index.less';

import { loadTheme } from './lib/css/theme';

loadTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');
