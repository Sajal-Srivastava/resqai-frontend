import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { useLocation } from '../hooks/useLocation';
import { sosVibrate, emergencyVibrate } from '../utils/haptics';
import MedicalCard from '../components/profile/MedicalCard';

const CIRCUMFERENCE = 2 * Math.PI * 88; // radius 88

export default function SOSScreen() {
  const { state, dispatch, navigate, toast } = useApp();
  const t = useT(state.language);
  const { requestLocation } = useLocation();
  const timerRef = useRef(null);
  const [countdown, setCountdown] = useState(5);
  const [triggered, setTriggered] = useState(false);
  const [coords, setCoords] = useState(state.location);

  // Start countdown on mount — intentionally run once only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!state.sos.active) navigate('home');
    setCountdown(5);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          activateSOS();
          return 0;
        }
        emergencyVibrate();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const activateSOS = async () => {
    sosVibrate();
    setTriggered(true);
    // Get fresh location
    try {
      const loc = await requestLocation();
      setCoords(loc);
      dispatch({ type: 'SET_LOCATION', payload: loc });
    } catch {}
    toast('🆘 SOS Activated! Emergency services alerted.', 'error', 6000);
  };

  const cancelSOS = () => {
    clearInterval(timerRef.current);
    dispatch({ type: 'SET_SOS', payload: { active: false, triggered: false, countdown: 5 } });
    navigate('home');
    toast('SOS cancelled', 'info');
  };

  const dashOffset = triggered ? CIRCUMFERENCE : CIRCUMFERENCE - (CIRCUMFERENCE * (5 - countdown)) / 5;

  if (triggered) {
    return (
      <div className="sos-screen">
        <div className="sos-active-screen">
          <div className="sos-pulse-icon">🆘</div>
          <h1 className="sos-triggered-title">{t.sosSent}</h1>
          <p style={{ color: 'var(--t-secondary)', textAlign: 'center', fontSize: 14 }}>{t.sosSentDesc}</p>

          {/* SOS Info Grid */}
          <div className="sos-info-grid w-full">
            <div className="sos-info-card">
              <div className="sos-info-icon">📍</div>
              <p className="sos-info-label">Location</p>
              <p className="sos-info-value">
                {coords ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : 'Getting location...'}
              </p>
            </div>
            <div className="sos-info-card">
              <div className="sos-info-icon">🕐</div>
              <p className="sos-info-label">Time</p>
              <p className="sos-info-value">{new Date().toLocaleTimeString()}</p>
            </div>
            <div className="sos-info-card">
              <div className="sos-info-icon">👥</div>
              <p className="sos-info-label">Contacts</p>
              <p className="sos-info-value">{state.contacts.length} notified</p>
            </div>
            <div className="sos-info-card">
              <div className="sos-info-icon">🩸</div>
              <p className="sos-info-label">Blood Group</p>
              <p className="sos-info-value">{state.profile.bloodGroup || 'Not set'}</p>
            </div>
          </div>

          <a href="tel:112" className="call-112-btn">{t.call112}</a>
          <a href="tel:108" className="call-112-btn" style={{ background: '#16A34A', animation: 'none' }}>
            🚑 Call Ambulance (108)
          </a>

          {/* Emergency Contacts */}
          {state.contacts.length > 0 && (
            <div className="w-full">
              <p className="section-label mb-3">Emergency Contacts</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {state.contacts.map((c) => (
                  <a key={c.id} href={`tel:${c.phone}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', textDecoration: 'none' }}>
                    <span style={{ fontSize: 24 }}>📞</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: 'var(--t-primary)', fontSize: 14 }}>{c.name}</p>
                      <p style={{ color: 'var(--t-muted)', fontSize: 12 }}>{c.phone} · {c.relation}</p>
                    </div>
                    <span style={{ color: 'var(--c-green)', fontWeight: 700, fontSize: 12 }}>Call</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Medical Profile */}
          <MedicalCard profile={state.profile} />

          <button className="btn btn-secondary" onClick={() => { dispatch({ type: 'SET_SOS', payload: { active: false, triggered: false } }); navigate('home'); }}>
            ✅ I'm Safe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sos-screen">
      <h1 className="sos-screen-title">🚨 {t.sosCountingDown}...</h1>
      <p style={{ color: 'var(--t-secondary)', fontSize: 14, textAlign: 'center' }}>
        SOS will be sent automatically. Tap Cancel to stop.
      </p>

      {/* Countdown Ring */}
      <div className="sos-countdown-container">
        <svg className="sos-countdown-svg" viewBox="0 0 200 200">
          <circle className="sos-countdown-bg" cx="100" cy="100" r="88" />
          <circle
            className="sos-countdown-progress"
            cx="100" cy="100" r="88"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="sos-countdown-center">
          <span className="sos-countdown-number">{countdown}</span>
          <span className="sos-countdown-label">seconds</span>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--t-muted)', textAlign: 'center', lineHeight: 1.6 }}>
        Your location, medical profile, and emergency contacts will be shared with emergency services.
      </p>

      <button
        style={{ width: '100%', height: 56, borderRadius: 'var(--r-full)', border: '2px solid var(--c-red)', background: 'transparent', color: 'var(--c-red)', fontSize: 17, fontWeight: 700, cursor: 'pointer' }}
        onClick={cancelSOS}
      >
        ✕ {t.sosCancel}
      </button>

      <a href="tel:112" style={{ color: 'var(--t-muted)', fontSize: 14, textDecoration: 'underline' }}>
        Or call 112 directly now
      </a>
    </div>
  );
}
