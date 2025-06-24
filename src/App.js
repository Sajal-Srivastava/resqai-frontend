// ==========================
// 📁 REFACTORED APP STRUCTURE
// ==========================
import React, { useState } from 'react';
import EmergencyTips from './components/EmergencyTips';
import EmergencyForm from './components/EmergencyForm';
import CommonEmergencies from './components/CommonEmergencies';
import EmergencyResult from './components/EmergencyResult';
import EmergencyMap from './components/EmergencyMap';
import './App.css';
import './Animations.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    let userLocation = location;
    if (!userLocation) {
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        userLocation = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setLocation(userLocation);
      } catch (err) {
        console.error('Geolocation error:', err);
        userLocation = null;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('https://resqai-backend.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, location: userLocation }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
    };

    recognition.start();
  };

  const handleSOS = () => {
  const msg = `🚨 SOS Triggered! Need help at my location. (DEMO)`;
  alert(msg);
};



  const commonEmergency = (type) => {
    setText(type);
    handleAnalyze();
  };

  return (
    <div className="app">
      <h1>🚨 ResQ.AI</h1>

      

      <EmergencyForm
        text={text}
        setText={setText}
        onAnalyze={handleAnalyze}
        onVoice={handleVoice}
        onSOS={handleSOS}
        loading={loading}
      />



       {/* {result && <EmergencyResult result={result} />} */}
       {result?.locationReceived && location && (
          <>
            <EmergencyMap location={location} />
            <EmergencyResult result={result} />
          </>
        )}



      <CommonEmergencies onSelect={commonEmergency} />

      <div className="note-box">
        <strong>⚠️ For immediate life-threatening emergencies, call 112 directly.</strong>
        <p>This tool provides guidance but doesn't replace emergency services.</p>
      </div>

     
      <EmergencyTips />
    </div>
  );
}

export default App;
