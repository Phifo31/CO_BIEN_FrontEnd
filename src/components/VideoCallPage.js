// VideoCallPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, onValue, remove } from "firebase/database";
import { db } from "./firebase";

function VideoCallPage() {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);

  // Définir l’email de l’utilisateur
  useEffect(() => {
    let email = localStorage.getItem("userEmail");
    if (!email) {
      email = prompt("Entrez votre email pour recevoir les appels :");
      if (email) localStorage.setItem("userEmail", email);
    }
    setCurrentUserEmail(email);
  }, []);

  // Charger les contacts depuis localStorage
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    setContacts(storedContacts.filter(c => c.email && c.email !== currentUserEmail));
  }, [currentUserEmail]);

  // Écouter les appels entrants
  useEffect(() => {
    if (!currentUserEmail) return;

    const safeEmail = currentUserEmail.replace(/[^a-zA-Z0-9]/g, '');
    const callRef = ref(db, `calls/${safeEmail}`);

    const unsubscribe = onValue(callRef, (snapshot) => {
      const callData = snapshot.val();
      setIncomingCall(callData && callData.active ? callData : null);
    });

    return () => unsubscribe();
  }, [currentUserEmail]);

  // Démarrer un appel vers un contact
  const startCall = (contact) => {
    if (!contact.email || !currentUserEmail) return;

    const safeContactEmail = contact.email.replace(/[^a-zA-Z0-9]/g, '');
    const roomName = `call_${Date.now()}_${safeContactEmail}`;

    // Notifier le contact via Firebase
    set(ref(db, `calls/${safeContactEmail}`), {
      roomName,
      from: currentUserEmail,
      active: true
    });

    // Lancer Jitsi pour soi
    launchJitsi(roomName);
  };

  // Répondre à un appel entrant
  const answerCall = () => {
    if (!incomingCall) return;
    launchJitsi(incomingCall.roomName);
  };

  // Raccrocher / refuser
  const hangUp = () => {
    if (incomingCall && incomingCall.from) {
      const safeFromEmail = incomingCall.from.replace(/[^a-zA-Z0-9]/g, '');
      remove(ref(db, `calls/${safeFromEmail}`));
    }
    if (jitsiContainerRef.current) jitsiContainerRef.current.innerHTML = '';
    setIncomingCall(null);
  };

  // Lancer Jitsi Meet
  const launchJitsi = (roomName) => {
    if (!roomName || !jitsiContainerRef.current) return;

    jitsiContainerRef.current.innerHTML = '';
    const domain = 'meet.jit.si';
    const options = {
      roomName,
      parentNode: jitsiContainerRef.current,
      width: '100%',
      height: 500,
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'camera', 'hangup', 'chat']
      }
    };

    // eslint-disable-next-line no-undef
    new window.JitsiMeetExternalAPI(domain, options);
  };

  if (!currentUserEmail) return <p>Chargement…</p>;

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#e0e0e0',
        color: 'black',
        padding: '40px',
      }}
    >
      {/* === Bouton retour (identique à CalendarPage) === */}
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

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Appels Vidéo</h1>

      {/* Liste contacts */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {contacts.length === 0 && <p>Aucun contact disponible.</p>}
        {contacts.map(contact => (
          <div key={contact.email} style={{ marginBottom: '10px' }}>
            <span>{contact.name} ({contact.email})</span>
            <button
              style={{
                marginLeft: '10px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #555',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={() => startCall(contact)}
            >
              Appeler 📹
            </button>
          </div>
        ))}
      </div>

      {/* Appel entrant */}
      {incomingCall && (
        <div
          style={{
            marginTop: '20px',
            background: '#fff3cd',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p>📞 Appel entrant de {incomingCall.from}</p>
          <button
            onClick={answerCall}
            style={{
              marginRight: '10px',
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Répondre
          </button>
          <button
            onClick={hangUp}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Refuser
          </button>
        </div>
      )}

      {/* Container Jitsi */}
      <div ref={jitsiContainerRef} style={{ marginTop: '30px' }} />
    </div>
  );
}

export default VideoCallPage;
