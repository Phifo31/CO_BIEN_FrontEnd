// MainRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CalendarPage from './components/CalendarPage';
import App from './App';
import VideoCallPage from './components/VideoCallPage';
import ManageContacts from './components/ManageContacts';
import WeatherPage from './components/WeatherPage';
import PhotosPage from './components/PhotosPage';
import ButtonListener from './components/ButtonListener';

function MainRouter() {
  return (
    <Router>
       {/*Ecoute du bouton capacitif*/}
         <ButtonListener />  {/* toujours actif */}
      <Routes>
        {/* Page d'accueil vide */}
        <Route path="/" element={<HomePage />} />
        {/*Page calendrier*/}
        <Route path="/calendar" element={<CalendarPage />} />
        {/* Page principale existante */}
        <Route path="/app" element={<App />} />
        {/*Page d'appels vidéo*/}
         <Route path="/calls" element={<VideoCallPage currentUserEmail="capucine.gibel@2026.icam.fr" />} />
        {/*Page de gestion des contacts*/}
         <Route path="/manage-contacts" element={<ManageContacts />} />
        {/*Page de météo*/}
         <Route path="/weather" element={<WeatherPage />} />
        {/*Page de photos*/}
         <Route path="/photos" element={<PhotosPage />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
