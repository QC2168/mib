/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import {
  RecoilRoot,
} from 'recoil';
import App from './App';
import 'uno.css';
import '@/lib/css/index.less';

ReactDOM.createRoot(document.getElementById('root')!)
  .render(
    <React.StrictMode>
      <RecoilRoot>
        <HashRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </HashRouter>
      </RecoilRoot>
    </React.StrictMode>,
  );
postMessage({ payload: 'removeLoading' }, '*');
