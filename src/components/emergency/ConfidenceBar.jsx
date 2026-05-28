import React, { useEffect, useState } from 'react';

const getColor = (v) => v >= 80 ? '#16A34A' : v >= 60 ? '#F59E0B' : '#EF4444';

export default function ConfidenceBar({ value = 0, label = 'Confidence' }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 100); return () => clearTimeout(t); }, [value]);
  const color = getColor(value);
  return (
    <div className="confidence-bar-container">
      <div className="confidence-label">
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="confidence-track">
        <div className="confidence-fill" style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }} />
      </div>
    </div>
  );
}
