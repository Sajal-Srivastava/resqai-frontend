import React from 'react';
import EmergencyContactButton from './EmergencyContactButton';

const EmergencyForm = ({ text, setText, onAnalyze, onVoice, onSOS, loading }) => (
  <>
    <textarea
      placeholder="Tell us what's happening..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    <div className="controls spaced-controls centered-controls">
      <button onClick={onAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Get Help Now'}
      </button>
      <button onClick={onVoice}>🎙️ Voice Input</button>
      <button onClick={onSOS} className="sos-button blinking">🆘 SOS</button>
      <EmergencyContactButton />
    </div>
  </>
);

export default EmergencyForm;
