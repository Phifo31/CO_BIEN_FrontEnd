// LEDStripControl.js
import React, { useState } from 'react';
import { publish } from '../mqttClient'; // 🔹 On importe juste publish

function LEDStripControl() {
  const [ledStrips, setLedStrips] = useState({
    confirmation: { group: 1, intensity: 255, color: '#00ff00', mode: 'ON' },
    delete: { group: 2, intensity: 255, color: '#ff0000', mode: 'ON' },
    notification: { group: 3, intensity: 255, color: '#0000ff', mode: 'BLINK' },
    main: { group: 4, intensity: 255, color: '#ffffff', mode: 'ON' },
  });

  // 🔹 Met à jour la valeur locale
  const handleInputChange = (strip, field, value) => {
    setLedStrips((prevStrips) => ({
      ...prevStrips,
      [strip]: { ...prevStrips[strip], [field]: value },
    }));
  };

  // 🔹 Publie la configuration sur le topic MQTT
  const handleUpdateConfig = (strip) => {
    const payload = ledStrips[strip];
    publish('ledstrip/config', payload); // ✅ Appel centralisé au MQTT client
    alert(
      `${strip.charAt(0).toUpperCase() + strip.slice(1)} LED Strip configuration updated successfully!`
    );
  };

  return (
    <div className="led-strip-control">
      {Object.keys(ledStrips).map((strip) => (
        <div key={strip} className="led-strip-section">
          <h3>{strip.charAt(0).toUpperCase() + strip.slice(1)} LED Strip</h3>

          <div className="led-config">
            <label>Intensity (0-255):</label>
            <input
              type="range"
              min="0"
              max="255"
              value={ledStrips[strip].intensity}
              onChange={(e) =>
                handleInputChange(strip, 'intensity', parseInt(e.target.value))
              }
            />
            <p>Current Intensity: {ledStrips[strip].intensity}</p>
          </div>

          <div className="led-config">
            <label>Color:</label>
            <input
              type="color"
              value={ledStrips[strip].color}
              onChange={(e) =>
                handleInputChange(strip, 'color', e.target.value)
              }
            />
          </div>

          <div className="led-config">
            <label>Mode:</label>
            <select
              value={ledStrips[strip].mode}
              onChange={(e) =>
                handleInputChange(strip, 'mode', e.target.value)
              }
            >
              <option value="ON">ON</option>
              <option value="OFF">OFF</option>
              <option value="BLINK">BLINK</option>
              <option value="FADING_BLINK">FADING_BLINK</option>
            </select>
          </div>

          <button onClick={() => handleUpdateConfig(strip)}>
            Update Configuration
          </button>
        </div>
      ))}
    </div>
  );
}

export default LEDStripControl;
