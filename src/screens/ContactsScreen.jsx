import React, { useState } from 'react';
import { useApp, getAvatarColor } from '../context/AppContext';
import { useT } from '../i18n/translations';
import Modal from '../components/common/Modal';

const RELATIONS = ['Family', 'Spouse', 'Parent', 'Sibling', 'Friend', 'Doctor', 'Neighbor', 'Other'];

export default function ContactsScreen() {
  const { state, dispatch, toast } = useApp();
  const t = useT(state.language);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', relation: 'Family' });

  const handleAdd = () => {
    if (!form.name.trim() || !form.phone.trim()) { toast('Name and phone are required', 'warning'); return; }
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) { toast('Please enter a valid phone number', 'warning'); return; }
    dispatch({ type: 'ADD_CONTACT', payload: form });
    setForm({ name: '', phone: '', relation: 'Family' });
    setShowModal(false);
    toast('Contact added ✅', 'success');
  };

  const handleDelete = (id) => {
    dispatch({ type: 'REMOVE_CONTACT', payload: id });
    toast('Contact removed', 'info');
  };

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-5)' }}>
        <div>
          <p className="page-title">👥 {t.emergencyContacts}</p>
          <p className="page-subtitle">Notified automatically on SOS</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto', padding: '0 var(--sp-4)' }} onClick={() => setShowModal(true)}>
          + Add
        </button>
      </div>

      {state.contacts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <p className="empty-title">No contacts yet</p>
          <p className="empty-desc">Add emergency contacts who will be notified when you activate SOS</p>
          <button className="btn btn-primary mt-4" style={{ width: 'auto', padding: '0 var(--sp-6)' }} onClick={() => setShowModal(true)}>
            + {t.addContact}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {state.contacts.map((c) => (
            <div key={c.id} className="contact-card">
              <div className="contact-avatar" style={{ background: getAvatarColor(c.name), fontSize: 20 }}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="contact-info">
                <p className="contact-name">{c.name}</p>
                <p className="contact-phone">{c.phone}</p>
                <p className="contact-relation">{c.relation}</p>
              </div>
              <div className="contact-actions">
                <a href={`tel:${c.phone}`} className="service-call-btn" title="Call">📞</a>
                <button className="service-call-btn" style={{ color: 'var(--c-red)' }} onClick={() => handleDelete(c.id)} title="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card mt-5" style={{ border: '1px solid rgba(79,70,229,0.3)', background: 'rgba(79,70,229,0.05)' }}>
        <p style={{ fontSize: 12, color: 'var(--t-muted)', lineHeight: 1.6 }}>
          ℹ️ Contacts are stored locally on your device. During SOS, ResQ.AI will display their numbers for quick calling. Automatic SMS requires device permissions.
        </p>
      </div>

      {showModal && (
        <Modal title={`+ ${t.addContact}`} onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="profile-field">
              <label className="field-label">{t.name} *</label>
              <input className="field-input" placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="profile-field">
              <label className="field-label">{t.phone} *</label>
              <input className="field-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="profile-field">
              <label className="field-label">{t.relation}</label>
              <select className="field-select" value={form.relation} onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}>
                {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>{t.cancel}</button>
              <button className="btn btn-primary" onClick={handleAdd}>{t.save}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
