import React from 'react';

const CommonEmergencies = ({ onSelect }) => (
  <div className="common-emergencies">
    <p>Or select a common emergency:</p>
    <div className="emergency-buttons">
      <button onClick={() => onSelect("Medical emergency - someone is hurt")}>❤️ Medical</button>
      <button onClick={() => onSelect("Fire - building is burning")}>🧯 Fire</button>
      <button onClick={() => onSelect("Car accident with injuries")}>🚗 Accident</button>
      <button onClick={() => onSelect("Crime - someone is threatening me")}>🛡️ Crime</button>
    </div>
  </div>
);

export default CommonEmergencies;
