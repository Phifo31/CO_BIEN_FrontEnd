// RFIDControl.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribe, unsubscribe, publish } from '../mqttClient'; // ← Import centralisé

function RFIDControl() {
  const [cardID, setCardID] = useState('');
  const [configuring, setConfiguring] = useState(false);
  const [action, setAction] = useState('');
  const navigate = useNavigate();

  // === Écoute les messages MQTT du topic RFID ===
  useEffect(() => {
    const handleRFIDMessage = (msg, topic) => {
      if (topic === 'rfid/card') {
        const detectedCardID = msg.toString();
        setCardID(detectedCardID);

        // Si on n’est pas en mode configuration
        if (!configuring) {
          const storedLinks = JSON.parse(localStorage.getItem('rfidLinks')) || {};
          const linkedAction = storedLinks[detectedCardID];

          if (linkedAction) {
            switch (linkedAction) {
              case 'Agenda':
                navigate('/calendar');
                break;

              case 'Visio': {
                const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
                const joseph = contacts.find((c) =>
                  c.name.toLowerCase().includes('joseph')
                );

                if (joseph) {
                  // Sauvegarde de l’intention d’appel
                  localStorage.setItem(
                    'pendingCall',
                    JSON.stringify({
                      target: joseph.email,
                      timestamp: Date.now(),
                    })
                  );

                  navigate('/calls');
                } else {
                  alert('Aucun contact nommé Joseph trouvé.');
                }
                break;
              }

              case 'Question':
                navigate('/question');
                break;

              default:
                console.log(`Aucune action associée à la carte ${detectedCardID}`);
            }
          } else {
            alert(`Carte détectée (${detectedCardID}) mais aucune action n’est liée.`);
          }
        }
      }
    };

    // 🔹 S'abonner au topic
    subscribe('rfid/card', handleRFIDMessage);

    // 🔹 Nettoyage à la fermeture du composant
    return () => {
      unsubscribe('rfid/card', handleRFIDMessage);
    };
  }, [configuring, navigate]);

  // === Mode configuration ===
  const handleConfigurationClick = () => {
    publish('rfid/init', 'Card_Configuration');
    setConfiguring(true);
  };

  // === Confirmation de l’association carte → action ===
  const confirmConfiguration = () => {
    if (cardID && action) {
      // 🔹 Publier la config sur le broker
      publish('rfid/config', { id: cardID, action });

      // 🔹 Sauvegarder localement
      const storedLinks = JSON.parse(localStorage.getItem('rfidLinks')) || {};
      storedLinks[cardID] = action;
      localStorage.setItem('rfidLinks', JSON.stringify(storedLinks));

      alert(`✅ RFID Card ID ${cardID} liée à l’action : ${action}`);
    } else {
      alert('Veuillez détecter une carte RFID et choisir une action.');
    }

    setConfiguring(false);
    setAction('');
    setCardID('');
  };

  return (
    <div className="rfid-control">
      <button onClick={handleConfigurationClick}>Configuration</button>

      {configuring && (
        <div className="rfid-config">
          <label>Card ID: {cardID || 'En attente de carte...'}</label>

          <div>
            <label className="action-prompt">
              À quelle action voulez-vous attribuer cette carte ?
            </label>

            <div className="action-button-prompt">
              <button className="action-button" onClick={() => setAction('Visio')}>
                Visio
              </button>
              <button className="action-button" onClick={() => setAction('Agenda')}>
                Agenda
              </button>
              <button className="action-button" onClick={() => setAction('Question')}>
                Question
              </button>
            </div>
          </div>

          <button onClick={confirmConfiguration}>Confirmer</button>
        </div>
      )}
    </div>
  );
}

export default RFIDControl;
