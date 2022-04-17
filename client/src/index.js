import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './App';
import { Helmet, HelmetProvider } from 'react-helmet-async';


ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
    <App />
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
