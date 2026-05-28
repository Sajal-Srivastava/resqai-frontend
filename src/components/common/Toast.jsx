import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

export default function ToastContainer() {
  const { state } = useApp();
  return (
    <div className="toast-container">
      {state.toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}

function Toast({ toast }) {
  const { dispatch } = useApp();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id }), 300);
    }, 2700);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <div className={`toast ${toast.type} ${exiting ? 'exiting' : ''}`} onClick={() => setExiting(true)}>
      <span>{ICONS[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  );
}
