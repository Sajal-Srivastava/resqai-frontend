import React from 'react';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n/translations';
import AIGuidanceCard from '../components/emergency/AIGuidanceCard';
import ConfidenceBar from '../components/emergency/ConfidenceBar';
import LiveMap from '../components/emergency/LiveMap';
import { EMERGENCIES } from '../components/emergency/EmergencyGrid';

const SEVERITY_COLORS = { Critical: '#EF4444', High: '#F97316', Medium: '#F59E0B', Low: '#16A34A' };
const EM_CONFIG = Object.fromEntries(EMERGENCIES.map((e) => [e.label, { icon: e.icon, color: e.color }]));

export default function ResultScreen() {
  const { state, dispatch, navigate, toast } = useApp();
  const t = useT(state.language);
  const result = state.result;

  if (!result) {
    navigate('home');
    return null;
  }

  const cfg = EM_CONFIG[result.emergencyType] || { icon: '🆘', color: '#EF4444' };
  const severityColor = SEVERITY_COLORS[result.severity] || '#F59E0B';

  const handleNewEmergency = () => {
    dispatch({ type: 'SET_RESULT', payload: null });
    dispatch({ type: 'SET_TEXT', payload: '' });
    dispatch({ type: 'SET_CATEGORY', payload: null });
    navigate('home');
  };

  const handleShareLocation = () => {
    if (state.location) {
      const url = `https://maps.google.com/?q=${state.location.lat},${state.location.lon}`;
      if (navigator.share) {
        navigator.share({ title: '🚨 ResQ.AI Emergency Location', text: 'I need help at this location!', url }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(url);
        toast('Location URL copied to clipboard', 'success');
      }
    } else {
      toast('Location not available', 'warning');
    }
  };

  return (
    <div className="screen">
      {/* Result Header */}
      <div className="result-header">
        <span style={{ fontSize: 48 }}>{cfg.icon}</span>
        <div className="emergency-type-badge" style={{ color: cfg.color, borderColor: `${cfg.color}50`, background: `${cfg.color}15` }}>
          {result.emergencyType}
        </div>
        {result.severity && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--t-muted)', fontWeight: 600 }}>SEVERITY:</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: severityColor, padding: '3px 10px', background: `${severityColor}20`, borderRadius: 'var(--r-full)', border: `1px solid ${severityColor}40` }}>
              {result.severity}
            </span>
          </div>
        )}
      </div>

      {/* Confidence Bar */}
      <div className="card mb-4">
        <ConfidenceBar value={result.confidence} label={t.confidence} />
        {result.offline && (
          <p className="text-muted text-sm mt-3" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            📵 Offline mode — guidance uses cached data
          </p>
        )}
      </div>

      {/* AI Guidance */}
      <AIGuidanceCard guidance={result.guidance} title={t.aiGuidance} />

      {/* Location Map */}
      {state.location && (
        <div className="mt-4">
          <p className="section-label mb-3">📍 Your Location</p>
          <LiveMap location={state.location} height={220} />
          <p className="text-muted text-sm mt-2 text-center">
            {state.location.lat.toFixed(5)}, {state.location.lon.toFixed(5)}
          </p>
        </div>
      )}

      {/* Emergency Contacts */}
      {state.contacts.length > 0 && (
        <div className="mt-4">
          <p className="section-label mb-3">Emergency Contacts</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {state.contacts.map((c) => (
              <a key={c.id} href={`tel:${c.phone}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', textDecoration: 'none' }}>
                <span style={{ fontSize: 22 }}>📞</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: 'var(--t-primary)', fontSize: 14 }}>{c.name}</p>
                  <p style={{ color: 'var(--t-muted)', fontSize: 12 }}>{c.phone}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginTop: 'var(--sp-5)' }}>
        <a href="tel:112" className="call-112-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 56, borderRadius: 'var(--r-full)', background: '#EF4444', color: 'white', fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 20px rgba(239,68,68,0.4)' }}>
          📞 Call 112 — Emergency
        </a>
        <button className="btn btn-secondary" onClick={handleShareLocation}>
          🌍 Share My Location
        </button>
        <button className="btn btn-ghost" onClick={handleNewEmergency}>
          ← New Emergency
        </button>
      </div>

      <p className="text-center text-muted text-sm mt-5" style={{ lineHeight: 1.6 }}>
        ⚠️ This AI guidance is for informational purposes only.<br />
        Always follow instructions from emergency professionals.
      </p>
    </div>
  );
}
