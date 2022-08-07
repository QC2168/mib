/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import 'antd/dist/antd.less';
import 'styles/index.css';
import 'uno.css';
import { loadTheme } from './lib/css/theme';

await loadTheme();

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
