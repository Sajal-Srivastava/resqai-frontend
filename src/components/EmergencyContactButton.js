// components/EmergencyContactButton.js
import React from 'react';

const EmergencyContactButton = () => {
  const handleContactSOS = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        const contacts = await navigator.contacts.select(props, opts);

        if (contacts.length > 0 && contacts[0].tel.length > 0) {
          const number = contacts[0].tel[0];
          const name = contacts[0].name[0];
          const message = `🚨 Emergency! This is an auto-alert from ResQ.AI. ${name} needs help. Location: (auto-location not included in SMS).`;

          // Trigger SMS
          const smsLink = `sms:${number}?body=${encodeURIComponent(message)}`;
          window.open(smsLink);
        }
      } catch (err) {
        alert('❌ Contact selection failed or was denied.');
        console.error(err);
      }
    } else {
      alert('❌ Contact access not supported on this browser.');
    }
  };

  return (
    <button className="sos-btn" onClick={handleContactSOS}>
      📞 Emergency Contact
    </button>
  );
};

export default EmergencyContactButton;
