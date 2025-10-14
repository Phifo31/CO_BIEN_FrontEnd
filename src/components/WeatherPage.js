import React from 'react';

function WeatherPage() {
  return (
    <div style={styles.container}>
      <h1>Météo</h1>
      <p>Prévisions météorologiques locales.</p>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dff9fb',
    color: '#333',
  },
};

export default WeatherPage;
