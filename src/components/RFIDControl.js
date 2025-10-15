// RFIDControl.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RFIDControl({ client }) {
  const [cardID, setCardID] = useState('');
  const [configuring, setConfiguring] = useState(false);
  const [action, setAction] = useState('');
  const navigate = useNavigate();

  // 🔹 Écoute les messages MQTT pour détecter les cartes RFID
  useEffect(() => {
    if (client) {
      client.on('message', (topic, message) => {
        if (topic === 'rfid/card') {
          const detectedCardID = message.toString();
          setCardID(detectedCardID);

          if (!configuring) {
            // Vérifie si la carte est déjà liée à une action
            const storedLinks = JSON.parse(localStorage.getItem('rfidLinks')) || {};
            const linkedAction = storedLinks[detectedCardID];

            if (linkedAction) {
              switch (linkedAction) {
                case 'Agenda':
                  navigate('/calendar');
                  break;

                case 'Visio': {
                  // 🔹 Trouver le contact Joseph
                  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
                  const joseph = contacts.find(c =>
                    c.name.toLowerCase().includes('joseph')
                  );

                  if (joseph) {
                    // 🔹 Sauvegarder une "intention d'appel"
                    localStorage.setItem('pendingCall', JSON.stringify({
                      target: joseph.email,
                      timestamp: Date.now()
                    }));

                    // 🔹 Aller sur la page d'appels
                    navigate('/calls');
                  } else {
                    alert('Aucun contact nommé Joseph trouvé dans vos contacts.');
                  }
                  break;
                }

                case 'Question':
                  navigate('/question');
                  break;

                default:
                  console.log(`Aucune action associée pour ${detectedCardID}`);
              }
            } else {
              alert(`Carte détectée (${detectedCardID}) mais aucune action n’est liée.`);
            }
          }
        }
      });

      client.subscribe('rfid/card');
    }

    return () => {
      if (client) {
        client.unsubscribe('rfid/card');
      }
    };
  }, [client, configuring, navigate]);

  // 🔹 Démarre le mode configuration
  const handleConfigurationClick = () => {
    if (client) {
      client.publish('rfid/init', 'Card_Configuration');
    }
    setConfiguring(true);
  };

  // 🔹 Confirmation de l’association carte → action
  const confirmConfiguration = () => {
    if (client && cardID && action) {
      // Publier vers le périphérique
      client.publish('rfid/config', JSON.stringify({ id: cardID, action }));

      // Sauvegarder localement
      const storedLinks = JSON.parse(localStorage.getItem('rfidLinks')) || {};
      storedLinks[cardID] = action;
      localStorage.setItem('rfidLinks', JSON.stringify(storedLinks));

      alert(`RFID Card ID ${cardID} liée à l’action : ${action}`);
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
