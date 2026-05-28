import React from 'react';
import { useApp } from '../../context/AppContext';
import { useT } from '../../i18n/translations';

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', labelKey: 'home' },
  { id: 'sos', icon: '🆘', labelKey: 'sos' },
  { id: 'map', icon: '🗺️', labelKey: 'map' },
  { id: 'profile', icon: '👤', labelKey: 'profile' },
  { id: 'settings', icon: '⚙️', labelKey: 'settings' },
];

export default function NavBar() {
  const { state, navigate } = useApp();
  const t = useT(state.language);

  return (
    <nav className="app-navbar">
      <div className="nav-items">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${state.screen === item.id || (item.id === 'profile' && (state.screen === 'profile' || state.screen === 'contacts')) ? 'active' : ''} ${item.id === 'sos' ? 'nav-sos' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{t[item.labelKey]}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
