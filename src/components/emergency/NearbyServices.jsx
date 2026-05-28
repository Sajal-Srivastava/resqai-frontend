import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useT } from '../../i18n/translations';

const TYPE_CONFIG = {
  hospital: { icon: '🏥', bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Hospital' },
  clinic:   { icon: '🏨', bg: 'rgba(239,68,68,0.10)', color: '#EF4444', label: 'Clinic' },
  police:   { icon: '🚔', bg: 'rgba(29,78,216,0.12)', color: '#1D4ED8', label: 'Police' },
  fire_station: { icon: '🚒', bg: 'rgba(249,115,22,0.12)', color: '#F97316', label: 'Fire Dept' },
};

const FILTERS = ['all', 'hospital', 'police', 'fire_station'];

export default function NearbyServices({ services = [], loading }) {
  const { state } = useApp();
  const t = useT(state.language);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? services : services.filter((s) => s.type === filter || (filter === 'hospital' && s.type === 'clinic'));

  const filterLabels = { all: t.all, hospital: t.hospitals, police: t.police, fire_station: t.fireDept };

  return (
    <div>
      <div className="services-filter">
        {FILTERS.map((f) => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {TYPE_CONFIG[f]?.icon || '🔍'} {filterLabels[f]}
          </button>
        ))}
      </div>
      <div className="mt-3" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {loading && <p className="text-muted text-sm text-center mt-4">Searching nearby services...</p>}
        {!loading && filtered.length === 0 && (
          <div className="empty-state" style={{ padding: 'var(--sp-8)' }}>
            <span className="empty-icon">🔍</span>
            <p className="empty-title">No services found</p>
            <p className="empty-desc">Enable location to find nearby emergency services</p>
          </div>
        )}
        {filtered.map((s) => {
          const config = TYPE_CONFIG[s.type] || TYPE_CONFIG.hospital;
          return (
            <div key={s.id} className="service-item">
              <div className="service-icon-wrap" style={{ background: config.bg }}>
                {config.icon}
              </div>
              <div className="service-info">
                <p className="service-name">{s.name}</p>
                <p className="service-dist">
                  {config.label} · {s.distance < 1 ? `${Math.round(s.distance * 1000)}m` : `${s.distance.toFixed(1)}km`} away
                </p>
              </div>
              {s.phone && (
                <a href={`tel:${s.phone}`} className="service-call-btn" title="Call">📞</a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
