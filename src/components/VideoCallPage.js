// VideoCallPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, onValue, remove } from "firebase/database";
import { db } from "./firebase";

function VideoCallPage({ currentUserEmail }) {
  const [contacts, setContacts] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);

  // Charger contacts
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    // Filtrer les contacts sans email pour éviter les erreurs
    setContacts(storedContacts.filter(contact => contact.email));
  }, []);

  // Écouter les appels entrants
  useEffect(() => {
    if (!currentUserEmail) return;
    const safeEmail = currentUserEmail.replace(/[^a-zA-Z0-9]/g, '');
    const callRef = ref(db, `calls/${safeEmail}`);

    onValue(callRef, (snapshot) => {
      const callData = snapshot.val();
      if (callData && callData.active) {
        setIncomingCall(callData);
      } else {
        setIncomingCall(null);
      }
    });
  }, [currentUserEmail]);

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

  const answerCall = () => {
    if (!incomingCall) return;
    launchJitsi(incomingCall.roomName);
  };

  const hangUp = () => {
    if (incomingCall && incomingCall.from) {
      const safeFromEmail = incomingCall.from.replace(/[^a-zA-Z0-9]/g, '');
      remove(ref(db, `calls/${safeFromEmail}`));
    }
    if (jitsiContainerRef.current) jitsiContainerRef.current.innerHTML = '';
    setIncomingCall(null);
  };

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

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
        ⬅ Retour
      </button>

      <h1>Appels Vidéo</h1>

      {/* Liste contacts */}
      <div style={{ marginTop: '20px' }}>
        {contacts.length === 0 && <p>Aucun contact enregistré.</p>}
        {contacts.map(contact => (
          <div key={contact.email} style={{ marginBottom: '10px' }}>
            <span>{contact.name} ({contact.email})</span>
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => startCall(contact)}
            >
              Appeler 📹
            </button>
          </div>
        ))}
      </div>

      {/* Appel entrant */}
      {incomingCall && (
        <div style={{ marginTop: '20px', background: '#fff3cd', padding: '10px', borderRadius: '8px' }}>
          <p>📞 Appel entrant de {incomingCall.from}</p>
          <button onClick={answerCall} style={{ marginRight: '10px' }}>Répondre</button>
          <button onClick={hangUp}>Refuser</button>
        </div>
      )}

      {/* Container Jitsi */}
      <div ref={jitsiContainerRef} style={{ marginTop: '30px' }} />
    </div>
  );
}

export default VideoCallPage;
