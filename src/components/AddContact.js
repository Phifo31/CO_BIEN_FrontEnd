// AddContact.js
import React, { useState } from 'react';
import axios from 'axios';

function AjouterContact({ onContactAdded }) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleAddContact = async () => {
    if (!contactName || !contactEmail) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const newContact = { name: contactName, email: contactEmail };

    try {
      // ✅ Essaye d’envoyer au backend (sur port 5000 ou celui de ton serveur Node)
      const response = await axios.post('http://localhost:5000/add-contact', newContact);
      console.log('Réponse backend :', response.data);

      alert('Contact ajouté avec succès sur le serveur !');
    } catch (error) {
      console.warn("Serveur injoignable, sauvegarde locale du contact :", error.message);

      // ✅ Sauvegarde locale si le backend est indisponible
      const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
      storedContacts.push(newContact);
      localStorage.setItem('contacts', JSON.stringify(storedContacts));

      alert('Contact ajouté localement (serveur injoignable).');
    }

    // ✅ Réinitialiser les champs
    setContactName('');
    setContactEmail('');

    // ✅ Notifier le parent
    if (onContactAdded) onContactAdded();
  };

  return (
    <div className='contact-form'>
      <h4>Ajouter un nouveau contact</h4>

      <label>
        Nom :
        <input
          type="text"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className='input-field'
          placeholder="Entrez le nom du contact"
        />
      </label>

      <label>
        Email :
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className='input-field'
          placeholder="Entrez l'adresse email"
        />
      </label>

      <div className='button-group'>
        <button onClick={handleAddContact}>Ajouter</button>
      </div>
    </div>
  );
}

export default AjouterContact;
