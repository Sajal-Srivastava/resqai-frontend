import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useT } from '../i18n/translations';

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

export default function MedicalProfileScreen() {
  const { state, dispatch, toast, navigate } = useApp();
  const t = useT(state.language);
  const [form, setForm] = useState({ ...state.profile });

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: form });
    toast('Medical profile saved ✅', 'success');
  };

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
        <div style={{ width: 48, height: 48, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🆔</div>
        <div>
          <p className="page-title">{t.medicalProfile}</p>
          <p className="page-subtitle">Shared with responders during SOS</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-field full">
          <label className="field-label">👤 Full Name</label>
          <input className="field-input" placeholder="Your name" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>

        <div className="profile-field full">
          <label className="field-label">🩸 {t.bloodGroup}</label>
          <div className="blood-group-grid">
            {BLOOD_GROUPS.map((bg) => (
              <button key={bg} className={`blood-option ${form.bloodGroup === bg ? 'selected' : ''}`} onClick={() => update('bloodGroup', bg)}>{bg}</button>
            ))}
          </div>
        </div>

        <div className="profile-field full">
          <label className="field-label">⚠️ {t.allergies}</label>
          <textarea className="field-input" placeholder="e.g. Penicillin, Peanuts, Latex..." value={form.allergies} onChange={(e) => update('allergies', e.target.value)} />
        </div>

        <div className="profile-field full">
          <label className="field-label">💊 {t.medications}</label>
          <textarea className="field-input" placeholder="Current medications and dosages..." value={form.medications} onChange={(e) => update('medications', e.target.value)} />
        </div>

        <div className="profile-field full">
          <label className="field-label">🏥 {t.conditions}</label>
          <textarea className="field-input" placeholder="Diabetes, Hypertension, Heart disease..." value={form.conditions} onChange={(e) => update('conditions', e.target.value)} />
        </div>

        <div className="profile-field full">
          <label className="field-label">📝 Emergency Note</label>
          <textarea className="field-input" placeholder="Any other critical information for responders..." value={form.emergencyNote} onChange={(e) => update('emergencyNote', e.target.value)} />
        </div>
      </div>

      <div style={{ marginTop: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        <button className="btn btn-primary" onClick={handleSave}>
          💾 {t.save} Profile
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('contacts')}>
          👥 Manage Emergency Contacts →
        </button>
      </div>

      <div className="card mt-5" style={{ border: '1px solid rgba(79,70,229,0.3)', background: 'rgba(79,70,229,0.05)' }}>
        <p style={{ fontSize: 12, color: 'var(--t-muted)', lineHeight: 1.6 }}>
          🔒 Your medical profile is stored locally on your device and is never uploaded to any server. It is only shared with emergency services when you activate SOS.
        </p>
      </div>
    </div>
  );
}
