import React from 'react';
import { useApp } from '../../context/AppContext';
import { useT } from '../../i18n/translations';
import { sosVibrate } from '../../utils/haptics';

export default function SOSButton() {
  const { state, dispatch, navigate } = useApp();
  const t = useT(state.language);

  const handleSOS = () => {
    sosVibrate();
    dispatch({ type: 'SET_SOS', payload: { active: true, countdown: 5, triggered: false } });
    navigate('sos');
  };

  return (
    <div className="sos-container">
      <p className="sos-label">Emergency SOS</p>
      <div className="sos-btn-outer">
        <div className="sos-ring" />
        <div className="sos-ring" />
        <div className="sos-ring" />
        <button className="sos-btn" onClick={handleSOS}>
          <span className="sos-btn-text">{t.sosActivate}</span>
          <span className="sos-btn-subtext">{t.sosTap}</span>
        </button>
      </div>
      <p className="sos-hint">Sends your location to emergency services</p>
    </div>
  );
}
