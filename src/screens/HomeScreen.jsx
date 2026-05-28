import React from 'react';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { useLocation } from '../hooks/useLocation';
import EmergencyGrid from '../components/emergency/EmergencyGrid';
import SOSButton from '../components/emergency/SOSButton';
import VoiceInput from '../components/emergency/VoiceInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { classifyEmergency } from '../utils/api';
import { tapVibrate } from '../utils/haptics';

export default function HomeScreen() {
  const { state, dispatch, navigate, toast } = useApp();
  const t = useT(state.language);
  const { requestLocation } = useLocation();

  const handleAnalyze = async () => {
    if (!state.emergencyText.trim()) {
      toast('Please describe your emergency or select a category', 'warning');
      return;
    }
    tapVibrate();
    let loc = state.location;
    if (!loc) {
      try { loc = await requestLocation(); dispatch({ type: 'SET_LOCATION', payload: loc }); } catch {}
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await classifyEmergency(state.emergencyText, loc);
      dispatch({ type: 'SET_RESULT', payload: result });
      navigate('result');
      if (result.offline) toast('Offline mode: Using cached guidance', 'warning');
      else toast('Emergency analyzed successfully', 'success');
    } catch (err) {
      toast('Analysis failed. Please call 112 directly.', 'error');
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const handleCategorySelect = (emergency) => {
    dispatch({ type: 'SET_TEXT', payload: emergency.text });
  };

  const profileComplete = state.profile.bloodGroup || state.profile.name;
  const contactCount = state.contacts.length;

  return (
    <div className="screen">
      {/* Welcome */}
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <p className="welcome-greeting">
          {state.profile.name ? `Hello, ${state.profile.name.split(' ')[0]} 👋` : 'Emergency Help 🚨'}
        </p>
        <p className="welcome-sub">ResQ.AI — Fast. Reliable. Life-saving.</p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
        <div className="quick-stat">
          <span className="quick-stat-value">112</span>
          <span className="quick-stat-label">Emergency</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-value" style={{ color: contactCount > 0 ? 'var(--c-green)' : 'var(--c-red)' }}>{contactCount}</span>
          <span className="quick-stat-label">Contacts</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-value">{state.location ? '📍' : '❌'}</span>
          <span className="quick-stat-label">Location</span>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-value">{state.isOnline ? '🟢' : '🔴'}</span>
          <span className="quick-stat-label">Network</span>
        </div>
      </div>

      {/* Offline Banner */}
      {!state.isOnline && (
        <div className="alert-banner offline mb-4">
          <span>📵</span>
          <span>Offline — AI guidance uses cached data. Call 112 directly.</span>
        </div>
      )}

      {/* Profile Setup Banner */}
      {!profileComplete && (
        <div className="alert-banner warning mb-4" style={{ cursor: 'pointer' }} onClick={() => navigate('profile')}>
          <span>⚠️</span>
          <span>Set up your medical profile for faster emergency response →</span>
        </div>
      )}

      {/* Voice / Text Input */}
      <p className="section-label mb-3" style={{ marginBottom: 8 }}>Describe Your Emergency</p>
      <VoiceInput onSubmit={handleAnalyze} />
      <div className="mt-3">
        <button className="btn btn-primary" onClick={handleAnalyze} disabled={state.isLoading}>
          {state.isLoading ? '🔄 ' + t.analyzing : '🆘 ' + t.getHelp}
        </button>
      </div>

      {state.isLoading && <LoadingSpinner />}

      <div className="divider mt-5 mb-4" />

      {/* Emergency Category Grid */}
      <EmergencyGrid onSelect={handleCategorySelect} />

      <div className="divider mt-2 mb-4" />

      {/* SOS Button */}
      <SOSButton />

      {/* Emergency Numbers */}
      <div className="card mt-4">
        <p className="section-label mb-3">Emergency Numbers</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)' }}>
          {[
            { label: 'Emergency', num: '112', color: '#EF4444' },
            { label: 'Ambulance', num: '108', color: '#16A34A' },
            { label: 'Police', num: '100', color: '#1D4ED8' },
            { label: 'Fire', num: '101', color: '#F97316' },
            { label: 'Women Helpline', num: '1091', color: '#DB2777' },
            { label: 'Childline', num: '1098', color: '#0D9488' },
          ].map((item) => (
            <a
              key={item.num}
              href={`tel:${item.num}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'var(--sp-3)', background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)', textDecoration: 'none' }}
            >
              <span style={{ fontSize: 18 }}>📞</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.num}</p>
                <p style={{ fontSize: 11, color: 'var(--t-muted)' }}>{item.label}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <p className="text-center text-muted text-sm mt-6" style={{ lineHeight: 1.6 }}>
        ⚠️ For life-threatening emergencies, always call <strong>112</strong> directly.<br/>
        ResQ.AI provides guidance but does not replace emergency services.
      </p>
    </div>
  );
}
