import React from 'react';

function PhotosPage() {
  return (
    <div style={styles.container}>
      <h1>Galerie Photos</h1>
      <p>Affichage des photos et albums de l’utilisateur.</p>
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
    backgroundColor: '#fffaf0',
    color: '#333',
  },
};

export default PhotosPage;
