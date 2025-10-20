// mqttClient.js
import mqtt from 'mqtt';

// 🔹 Connexion unique au broker
const MQTT_BROKER_URL = 'ws://localhost:9001';
const client = mqtt.connect(MQTT_BROKER_URL);

// 🔹 Stocke les callbacks par topic
const listeners = {};

// === CONNECTION ===
client.on('connect', () => {
  console.log('✅ Connected to MQTT broker');
  client.subscribe('button/config'); // tu gardes ton abonnement global ici
});

// === MESSAGE RECEPTION ===
client.on('message', (topic, message) => {
  const msg = message.toString();

  // 🔸 Appelle les callbacks enregistrés pour ce topic
  if (listeners[topic]) {
    listeners[topic].forEach((callback) => callback(msg, topic));
  }

  // 🔸 Gestion du bouton capacitif global
  if (topic === 'button/config') {
    try {
      const data = JSON.parse(msg);
      if (data.touched === true) {
        // Envoie un événement global
        const event = new CustomEvent('capacitiveButtonTouched');
        window.dispatchEvent(event);
      }
    } catch (e) {
      console.error('Invalid JSON on button/config:', msg);
    }
  }
});

// === ABONNEMENT / DÉSABONNEMENT ===
export const subscribe = (topic, callback) => {
  if (!listeners[topic]) {
    listeners[topic] = [];
    client.subscribe(topic);
  }
  listeners[topic].push(callback);
};

export const unsubscribe = (topic, callback) => {
  if (listeners[topic]) {
    listeners[topic] = listeners[topic].filter((cb) => cb !== callback);
    if (listeners[topic].length === 0) {
      client.unsubscribe(topic);
      delete listeners[topic];
    }
  }
};

// === PUBLICATION ===
export const publish = (topic, payload) => {
  const message =
    typeof payload === 'string' ? payload : JSON.stringify(payload);
  client.publish(topic, message);
};

// === EXPORT PRINCIPAL ===
export default client;
