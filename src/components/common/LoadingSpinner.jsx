import React from 'react';
export default function LoadingSpinner({ text = 'Analyzing emergency...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner" />
      <p className="spinner-text">{text}</p>
    </div>
  );
}
