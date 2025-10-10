// MainRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import App from './App';

function MainRouter() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil vide */}
        <Route path="/" element={<HomePage />} />
        {/* Page principale existante */}
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
