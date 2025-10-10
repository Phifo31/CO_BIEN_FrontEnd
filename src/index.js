import React from 'react';
import ReactDOM from 'react-dom/client';
import MainRouter from './MainRouter';
//import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>
);
