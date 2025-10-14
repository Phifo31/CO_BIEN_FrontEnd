// CalendarPage.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarCustom.css';
import { useNavigate } from 'react-router-dom';

function CalendarPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Exemple d'événements (exemple statique)
  const events = {
    '2025-10-09': [
      { time: '09:00', title: 'Réunion équipe projet' },
      { time: '14:30', title: 'Appel client KoNnectik' },
    ],
    '2025-10-10': [{ time: '10:00', title: 'Présentation du prototype' }],
  };

  // Conversion date -> clé "YYYY-MM-DD"
  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const selectedKey = formatDateKey(selectedDate);
  const dayEvents = events[selectedKey] || [];

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        backgroundColor: '#e0e0e0', // gris clair
        color: 'black',
      }}
    >
      {/* === Bouton retour === */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          borderRadius: '8px',
          backgroundColor: '#d0d0d0',
          color: 'black',
          border: '1px solid #888',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
          transition: 'background-color 0.3s ease',
          zIndex: 10,
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0c0c0')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#d0d0d0')}
      >
        ⬅ Retour
      </button>

      {/* === Partie gauche : calendrier === */}
      <div
        style={{
          flex: 2, // ⬅️ 2/3 de l’écran
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'grey',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            transform: 'scale(1.25)', // ⬅️ agrandit le calendrier sans le déformer
            transformOrigin: 'center',
          }}
        >
          <Calendar
            locale="fr-FR"
            onChange={setSelectedDate}
            value={selectedDate}
          />
        </div>
      </div>

      {/* === Partie droite : événements du jour === */}
      <div
        style={{
          flex: 1, // ⬅️ 1/3 de l’écran
          backgroundColor: '#f5f5f5',
          borderLeft: '1px solid #ccc',
          padding: '40px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>
          Événements du {selectedDate.toLocaleDateString('fr-FR')}
        </h2>

        {dayEvents.length > 0 ? (
          dayEvents.map((event, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                padding: '15px',
                marginBottom: '15px',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {event.time}
              </p>
              <p>{event.title}</p>
            </div>
          ))
        ) : (
          <p>Aucun événement prévu ce jour.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
