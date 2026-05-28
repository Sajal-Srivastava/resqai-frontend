import React from 'react';
import { useApp } from '../../context/AppContext';
import { useT } from '../../i18n/translations';

export default function Header() {
  const { state, dispatch } = useApp();
  const t = useT(state.language);

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="header-logo-dot" />
        <span className="header-title">{t.appName}</span>
        <span className={`status-badge ${state.isOnline ? 'online' : 'offline'}`}>
          <span className={`status-dot ${state.isOnline ? 'pulse' : ''}`} />
          {state.isOnline ? t.online : t.offline}
        </span>
      </div>
      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
