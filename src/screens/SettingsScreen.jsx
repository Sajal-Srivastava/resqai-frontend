import React from 'react';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n/translations';
import { saveStorage } from '../utils/storage';

const LANGS = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'hi', label: '🇮🇳 हिंदी' },
  { code: 'es', label: '🇪🇸 Español' },
];

export default function SettingsScreen() {
  const { state, dispatch, toast } = useApp();
  const t = useT(state.language);

  const toggleTheme = () => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' });

  const handleNotifications = async () => {
    if (!('Notification' in window)) { toast('Notifications not supported', 'warning'); return; }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      dispatch({ type: 'SET_NOTIFICATIONS', payload: true });
      saveStorage('notificationsEnabled', true);
      toast('Notifications enabled ✅', 'success');
      new Notification('ResQ.AI', { body: 'Emergency notifications are now enabled!', icon: '/logo192.png' });
    } else {
      toast('Notification permission denied', 'warning');
    }
  };

  const clearData = () => {
    if (window.confirm('Clear all saved data? This will delete your profile and contacts.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="screen">
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <p className="page-title">⚙️ {t.settings}</p>
        <p className="page-subtitle">Customize your ResQ.AI experience</p>
      </div>

      {/* Appearance */}
      <div className="settings-section">
        <p className="settings-section-title">Appearance</p>
        <div className="settings-item" onClick={toggleTheme}>
          <div className="settings-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>{state.theme === 'dark' ? '🌙' : '☀️'}</div>
          <div className="settings-text">
            <p className="settings-label">{t.themeToggle}</p>
            <p className="settings-desc">Currently: {state.theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={state.theme === 'light'} onChange={toggleTheme} onClick={(e) => e.stopPropagation()} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Language */}
      <div className="settings-section">
        <p className="settings-section-title">{t.language}</p>
        <div className="settings-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', width: '100%' }}>
            <div className="settings-icon" style={{ background: 'rgba(20,184,166,0.15)' }}>🌐</div>
            <div className="settings-text"><p className="settings-label">App Language</p></div>
          </div>
          <div className="lang-chips mt-3">
            {LANGS.map((l) => (
              <button key={l.code} className={`lang-chip ${state.language === l.code ? 'active' : ''}`} onClick={() => { dispatch({ type: 'SET_LANGUAGE', payload: l.code }); toast(`Language changed to ${l.label}`, 'success'); }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <p className="settings-section-title">Notifications</p>
        <div className="settings-item" onClick={handleNotifications}>
          <div className="settings-icon" style={{ background: 'rgba(217,119,6,0.15)' }}>🔔</div>
          <div className="settings-text">
            <p className="settings-label">Push Notifications</p>
            <p className="settings-desc">{state.notificationsEnabled ? 'Enabled' : 'Tap to enable emergency alerts'}</p>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={state.notificationsEnabled} onChange={handleNotifications} onClick={(e) => e.stopPropagation()} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="settings-section">
        <p className="settings-section-title">Quick Dial</p>
        {[
          { label: 'National Emergency', num: '112', color: '#EF4444' },
          { label: 'Ambulance', num: '108', color: '#16A34A' },
          { label: 'Police', num: '100', color: '#1D4ED8' },
          { label: 'Fire Brigade', num: '101', color: '#F97316' },
          { label: 'Women Helpline', num: '1091', color: '#DB2777' },
          { label: 'Disaster Mgmt (NDRF)', num: '011-24363260', color: '#4F46E5' },
        ].map((item) => (
          <a key={item.num} href={`tel:${item.num}`} style={{ textDecoration: 'none' }}>
            <div className="settings-item">
              <div className="settings-icon" style={{ background: `${item.color}20`, fontSize: 16 }}>📞</div>
              <div className="settings-text">
                <p className="settings-label">{item.label}</p>
                <p className="settings-desc" style={{ color: item.color, fontWeight: 700 }}>{item.num}</p>
              </div>
              <span style={{ fontSize: 16, color: 'var(--t-muted)' }}>›</span>
            </div>
          </a>
        ))}
      </div>

      {/* About */}
      <div className="settings-section">
        <p className="settings-section-title">About</p>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
            <span style={{ fontSize: 36 }}>🚨</span>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--t-primary)' }}>ResQ.AI</p>
              <p style={{ fontSize: 13, color: 'var(--t-muted)' }}>{t.version} · AI Emergency Assistant</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--t-muted)', lineHeight: 1.6 }}>
            ResQ.AI uses HuggingFace Transformers for emergency classification and Google Gemini 1.5 Pro for AI-powered first-aid guidance. Built for accessibility, reliability, and speed in emergency situations.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section">
        <p className="settings-section-title">Data</p>
        <div className="settings-item" onClick={clearData} style={{ cursor: 'pointer' }}>
          <div className="settings-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>🗑️</div>
          <div className="settings-text">
            <p className="settings-label" style={{ color: 'var(--c-red)' }}>Clear All Data</p>
            <p className="settings-desc">Delete profile, contacts, and settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
