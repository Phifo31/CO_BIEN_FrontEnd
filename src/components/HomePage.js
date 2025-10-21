// HomePage.js
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaVideo, 
  FaCloudSun, 
  FaImages 
} from 'react-icons/fa'; // 🔹 Ajout des icônes météo et photos
import 'react-calendar/dist/Calendar.css';


function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // ⚠️ change ici selon l'utilisateur (pour tester entre 2 navigateurs)
    localStorage.setItem("userEmail", "capucine.gibel@gmail.com");
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Bouton gestion contacts */}
      <button
        onClick={() => navigate('/manage-contacts')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '300px',
          padding: '10px 20px',
          borderRadius: '8px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#218838')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#28a745')}
      >
        Contacts
      </button>

      {/* Bouton interface de paramétrage */}
      <button
        onClick={() => navigate('/app')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 10px',
          borderRadius: '8px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
      >
        Aller à l'interface de paramétrage
      </button>

      {/* Zone calendrier */}
      <div
        onClick={() => navigate('/calendar')}
        style={zoneStyle('top', 'right')}
      >
        <FaCalendarAlt size="60%" color="#007bff" />
      </div>

      {/* Zone appel vidéo */}
      <div
        onClick={() => navigate('/calls')}
        style={zoneStyle('bottom', 'right')}
      >
        <FaVideo size="60%" color="#007bff" />
      </div>

      {/* Zone météo */}
      <div
        onClick={() => navigate('/weather')}
        style={zoneStyle('top', 'left')}
      >
        <FaCloudSun size="60%" color="#007bff" />
      </div>

      {/* Zone photos */}
      <div
        onClick={() => navigate('/photos')}
        style={zoneStyle('bottom', 'left')}
      >
        <FaImages size="60%" color="#007bff" />
      </div>
    </div>
  );
}

/* 🔹 Fonction utilitaire pour éviter la répétition du style */
function zoneStyle(vertical, horizontal) {
  return {
    position: 'absolute',
    [vertical]: vertical === 'top' ? 80 : 0,
    [horizontal]: 0,
    width: '49vw',
    height: '45vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'white',
    borderRadius:
      horizontal === 'right'
        ? '20px 0 0 20px'
        : '0 20px 20px 0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    overflow: 'hidden',
  };
}

export default HomePage;
