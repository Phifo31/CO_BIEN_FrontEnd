import React, { useState, useEffect } from 'react';
import { subscribe, unsubscribe, publish } from '../mqttClient'; // ← utilisation du client centralisé

function SensorControl() {
  const initialSensors = [
    { id: 1, PIC: 1, type: 'Touch', threshold: 100, scaling: 1, deviation: 0 },
    { id: 2, PIC: 1, type: 'Proximity', threshold: 100, scaling: 1, deviation: 0 },
    { id: 3, PIC: 2, type: 'Touch', threshold: 100, scaling: 1, deviation: 0 },
    { id: 4, PIC: 2, type: 'Proximity', threshold: 100, scaling: 1, deviation: 0 },
  ];

  const [sensors, setSensors] = useState(initialSensors);

  // === Abonnement au topic des capteurs ===
  useEffect(() => {
    const handleSensorMessage = (msg) => {
      try {
        const data = JSON.parse(msg);
        updateSensorData(data);
      } catch (err) {
        console.error('❌ Invalid sensor data:', msg);
      }
    };

    // 🔹 S'abonner au topic
    subscribe('sensor/current-configuration', handleSensorMessage);

    // 🔹 Se désabonner à la destruction du composant
    return () => {
      unsubscribe('sensor/current-configuration', handleSensorMessage);
    };
  }, []);

  // === Met à jour les données reçues ===
  const updateSensorData = (data) => {
    setSensors((prevSensors) =>
      prevSensors.map((sensor) => {
        const updatedSensor = { ...sensor };

        if (sensor.id === 1 && data.PIC1?.touchDeviation !== undefined) {
          updatedSensor.deviation = data.PIC1.touchDeviation;
        }
        if (sensor.id === 2 && data.PIC1?.proximityDeviation !== undefined) {
          updatedSensor.deviation = data.PIC1.proximityDeviation;
        }
        if (sensor.id === 3 && data.PIC2?.touchDeviation !== undefined) {
          updatedSensor.deviation = data.PIC2.touchDeviation;
        }
        if (sensor.id === 4 && data.PIC2?.proximityDeviation !== undefined) {
          updatedSensor.deviation = data.PIC2.proximityDeviation;
        }

        return updatedSensor;
      })
    );
  };

  // === Gestion des champs ===
  const handleInputChange = (PIC, type, field, value) => {
    setSensors((prevSensors) =>
      prevSensors.map((sensor) =>
        sensor.PIC === PIC && sensor.type === type
          ? { ...sensor, [field]: value }
          : sensor
      )
    );
  };

  // === Publication de la nouvelle config ===
  const updateConfiguration = (PIC) => {
    const touchSensor = sensors.find((sensor) => sensor.PIC === PIC && sensor.type === 'Touch');
    const proximitySensor = sensors.find((sensor) => sensor.PIC === PIC && sensor.type === 'Proximity');

    const payload = {
      PIC,
      touchThreshold: touchSensor.threshold,
      proximityThreshold: proximitySensor.threshold,
      touchScaling: touchSensor.scaling,
      proximityScaling: proximitySensor.scaling,
    };

    publish('sensors/update', payload);
    alert(`✅ Configuration updated for PIC ${PIC}`);
  };

  // === Rendu de l'interface ===
  return (
    <div className="sensor-control">
      <div className="sensor-grid">
        {Array.from(new Set(sensors.map((sensor) => sensor.PIC))).map((PIC) => {
          const touchSensor = sensors.find((s) => s.PIC === PIC && s.type === 'Touch');
          const proximitySensor = sensors.find((s) => s.PIC === PIC && s.type === 'Proximity');

          return (
            <div key={PIC} className="sensor-config">
              <h3>Configuration for PIC {PIC}</h3>

              {/* Touch Deviation */}
              <div className="horizontal-bar">
                <label>Touch Deviation:</label>
                <div className="bar-container">
                  <div
                    className="deviation-bar"
                    style={{
                      width: `${touchSensor.deviation / 1.27}%`,
                      backgroundColor:
                        touchSensor.deviation >= touchSensor.threshold ? 'red' : 'green',
                    }}
                  ></div>
                  <div
                    className="threshold-line"
                    style={{ left: `${touchSensor.threshold / 1.27}%` }}
                  ></div>
                </div>
                <p>Current Deviation: {touchSensor.deviation}</p>
              </div>

              {/* Proximity Deviation */}
              <div className="horizontal-bar">
                <label>Proximity Deviation:</label>
                <div className="bar-container">
                  <div
                    className="deviation-bar"
                    style={{
                      width: `${proximitySensor.deviation / 1.27}%`,
                      backgroundColor:
                        proximitySensor.deviation >= proximitySensor.threshold ? 'red' : 'green',
                    }}
                  ></div>
                  <div
                    className="threshold-line"
                    style={{ left: `${proximitySensor.threshold / 1.27}%` }}
                  ></div>
                </div>
                <p>Current Deviation: {proximitySensor.deviation}</p>
              </div>

              {/* Config Touch */}
              <div>
                <label>Touch Threshold (0–127):</label>
                <input
                  type="number"
                  min="0"
                  max="127"
                  value={touchSensor.threshold}
                  onChange={(e) =>
                    handleInputChange(PIC, 'Touch', 'threshold', parseInt(e.target.value))
                  }
                />
              </div>

              <div>
                <label>Proximity Threshold (0–127):</label>
                <input
                  type="number"
                  min="0"
                  max="127"
                  value={proximitySensor.threshold}
                  onChange={(e) =>
                    handleInputChange(PIC, 'Proximity', 'threshold', parseInt(e.target.value))
                  }
                />
              </div>

              <div>
                <label>Touch Scaling (0–4):</label>
                <select
                  value={touchSensor.scaling}
                  onChange={(e) =>
                    handleInputChange(PIC, 'Touch', 'scaling', parseInt(e.target.value))
                  }
                >
                  {[0, 1, 2, 3, 4].map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Proximity Scaling (0–4):</label>
                <select
                  value={proximitySensor.scaling}
                  onChange={(e) =>
                    handleInputChange(PIC, 'Proximity', 'scaling', parseInt(e.target.value))
                  }
                >
                  {[0, 1, 2, 3, 4].map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>

              <button onClick={() => updateConfiguration(PIC)}>
                Update Configuration
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SensorControl;
