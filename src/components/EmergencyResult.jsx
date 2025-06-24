import React from 'react';

const getEmergencyTips = (type) => {
  switch (type) {
    case 'Medical':
      return [
        'Check for responsiveness and breathing.',
        'Call emergency medical services (112).',
        'Apply basic first aid until help arrives.',
      ];
    case 'Fire':
      return [
        'Evacuate the area immediately.',
        'Stay low and avoid smoke.',
        'Call fire brigade or 112.',
      ];
    case 'Accident':
      return [
        'Ensure your safety before assisting.',
        'Do not move the injured unless necessary.',
        'Call 112 and report the location.',
      ];
    case 'Crime':
      return [
        'Move to a safe place.',
        'Do not confront the criminal.',
        'Call police immediately and stay on call.',
      ];
    default:
      return ['Stay calm.', 'Help is being dispatched.', 'Call 112 if needed.'];
  }
};

const getNearbyHelpMock = () => [
  { name: 'City Hospital', type: 'Hospital', distance: '1.2 km' },
  { name: 'Police Station Sector 8', type: 'Police', distance: '1.8 km' },
  { name: 'Fire Department HQ', type: 'Fire', distance: '2.5 km' },
];

const EmergencyResult = ({ result }) => (
  <div className="result">
    {/* 💬 Gemini AI Assistant Guidance */}
    {result.guidance && (
      <div className="guidance-box">
        <h3>🧠 AI Emergency Guidance</h3>
        <p>{result.guidance}</p>
      </div>
    )}

    <h2>🔍 Emergency Type: {result.emergencyType}</h2>
    <p>Confidence: {result.confidence}%</p>
    <p>
      ✅ Next Step:{' '}
      {result.emergencyType === 'Medical'
        ? 'Call ambulance or apply first aid.'
        : 'Stay safe and inform local authorities.'}
    </p>

    <div className="tips">
      <h3>📌 What to do now:</h3>
      <ul>
        {getEmergencyTips(result.emergencyType).map((tip, index) => (
          <li key={index}>✅ {tip}</li>
        ))}
      </ul>
    </div>

    <div className="nearby">
      <h3>📍 Nearby Help</h3>
      <ul>
        {getNearbyHelpMock().map((place, index) => (
          <li key={index}>
            🏥 {place.name} - {place.type} ({place.distance})
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default EmergencyResult;
