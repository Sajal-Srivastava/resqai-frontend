import React from 'react';

export default function MedicalCard({ profile }) {
  if (!profile) return null;
  const fields = [
    { label: 'Blood Group', value: profile.bloodGroup, icon: '🩸' },
    { label: 'Allergies', value: profile.allergies, icon: '⚠️' },
    { label: 'Medications', value: profile.medications, icon: '💊' },
    { label: 'Conditions', value: profile.conditions, icon: '🏥' },
  ].filter((f) => f.value);

  if (fields.length === 0) return null;

  return (
    <div className="card" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
        <span style={{ fontSize: 20 }}>🆔</span>
        <strong style={{ fontSize: 15, color: 'var(--t-primary)' }}>{profile.name || 'Medical Profile'}</strong>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)' }}>
        {fields.map((f) => (
          <div key={f.label} style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-md)', padding: 'var(--sp-3)' }}>
            <p style={{ fontSize: 10, color: 'var(--t-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.icon} {f.label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t-primary)', marginTop: 2 }}>{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
