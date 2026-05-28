import React from 'react';
import { useApp } from '../../context/AppContext';
import { useT } from '../../i18n/translations';
import { tapVibrate } from '../../utils/haptics';

export const EMERGENCIES = [
  { id: 'medical',   label: 'Medical',         icon: '🏥', color: '#EF4444', text: 'I need urgent medical help, someone is injured or sick' },
  { id: 'fire',      label: 'Fire',            icon: '🔥', color: '#F97316', text: 'There is a fire, we need fire brigade immediately' },
  { id: 'crime',     label: 'Crime',           icon: '🚨', color: '#7C3AED', text: 'A crime is happening, we need police immediately' },
  { id: 'accident',  label: 'Accident',        icon: '🚗', color: '#F59E0B', text: 'There has been a vehicle accident with injuries' },
  { id: 'disaster',  label: 'Disaster',        icon: '🌪️', color: '#4F46E5', text: 'Natural disaster emergency, need immediate evacuation help' },
  { id: 'women',     label: 'Women Safety',    icon: '🛡️', color: '#DB2777', text: 'Women safety emergency, someone is in danger' },
  { id: 'child',     label: 'Child Emergency', icon: '👶', color: '#0D9488', text: 'Child emergency, a child is in danger or missing', full: true },
];

export default function EmergencyGrid({ onSelect }) {
  const { state, dispatch } = useApp();
  const t = useT(state.language);

  const handleSelect = (emergency) => {
    tapVibrate();
    dispatch({ type: 'SET_CATEGORY', payload: emergency.id });
    dispatch({ type: 'SET_TEXT', payload: emergency.text });
    onSelect(emergency);
  };

  const regular = EMERGENCIES.filter((e) => !e.full);
  const wide = EMERGENCIES.filter((e) => e.full);

  return (
    <>
      <p className="section-label">Select Emergency Type</p>
      <div className="emergency-grid">
        {regular.map((em) => (
          <button
            key={em.id}
            className={`emergency-btn ${state.selectedCategory === em.id ? 'selected' : ''}`}
            style={{ color: em.color, borderColor: state.selectedCategory === em.id ? em.color : 'transparent' }}
            onClick={() => handleSelect(em)}
          >
            <span className="emergency-btn-icon">{em.icon}</span>
            <span className="emergency-btn-label">{t.emergencyTypes[em.label] || em.label}</span>
          </button>
        ))}
        {wide.map((em) => (
          <button
            key={em.id}
            className={`emergency-btn emergency-btn-child ${state.selectedCategory === em.id ? 'selected' : ''}`}
            style={{ color: em.color, borderColor: state.selectedCategory === em.id ? em.color : 'transparent' }}
            onClick={() => handleSelect(em)}
          >
            <span className="emergency-btn-icon">{em.icon}</span>
            <span className="emergency-btn-label">{t.emergencyTypes[em.label] || em.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
