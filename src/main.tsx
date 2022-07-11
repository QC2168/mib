import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './samples/node-api'
// import 'normalize.css'
import 'styles/index.css'
import 'antd/dist/antd.css';
import 'uno.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

postMessage({ payload: 'removeLoading' }, '*')
