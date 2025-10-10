// HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'relative', // Nécessaire pour placer le bouton à l'intérieur
        height: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1>Bienvenue</h1>
      <button
        onClick={() => navigate('/app')}
        style={{
          position: 'absolute',   // Positionnement absolu dans le conteneur
          top: '20px',            // Distance depuis le haut
          right: '20px',          // Distance depuis la droite
          padding: '10px 20px',
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
    </div>
  );
}

export default HomePage;
