// ManageContacts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageContacts() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contacts, setContacts] = useState([]);

  // Charger les contacts depuis localStorage au démarrage
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    setContacts(storedContacts);
  }, []);

  // Ajouter un contact
  const handleAddContact = async () => {
    if (!contactName || !contactEmail) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const newContact = { name: contactName, email: contactEmail };

    try {
      // Optionnel : envoyer au backend
      await axios.post('http://localhost:5000/add-contact', newContact);
      console.log('Contact ajouté au serveur');

      // Sauvegarder dans localStorage
      const updatedContacts = [...contacts, newContact];
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      setContacts(updatedContacts);

      // Réinitialiser les champs
      setContactName('');
      setContactEmail('');

      alert('Contact ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du contact :', error);
      alert('Erreur lors de l\'ajout du contact.');
    }
  };

  // Supprimer un contact
  const handleDeleteContact = (emailToDelete) => {
    const updatedContacts = contacts.filter(
      (contact) => contact.email !== emailToDelete
    );
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '40px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          Ajouter un nouveau contact
        </h2>
        <label style={{ display: 'block', marginBottom: '10px', color: '#555' }}>
          Nom :
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginTop: '5px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '15px', color: '#555' }}>
          Email :
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginTop: '5px',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          />
        </label>
        <button
          onClick={handleAddContact}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Ajouter
        </button>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          Contacts enregistrés
        </h2>
        {contacts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>Aucun contact.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {contacts.map((contact) => (
              <li
                key={contact.email}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ color: '#333' }}>
                  {contact.name} ({contact.email})
                </span>
                <button
                  onClick={() => handleDeleteContact(contact.email)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#a71d2a')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc3545')}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ManageContacts;
