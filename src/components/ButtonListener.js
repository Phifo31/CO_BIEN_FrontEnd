import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../mqttClient';

function ButtonListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (topic, message) => {
      if (topic === 'button/config') {
        try {
          const data = JSON.parse(message.toString());
          if (data.touched === true) {
            console.log('🟢 Bouton touché — retour à la HomePage');
            navigate('/'); // <-- adapte selon ta route exacte
          }
        } catch (err) {
          console.error('Erreur parsing MQTT message:', err);
        }
      }
    };

    client.on('message', handleMessage);

    return () => {
      client.off('message', handleMessage);
    };
  }, [navigate]);

  return null; // pas d’affichage, juste un listener
}

export default ButtonListener;
