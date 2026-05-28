import React from 'react';

const parseGuidanceSteps = (text) => {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.replace(/^[\s•\-*\d.)]+/, '').trim())
    .filter(Boolean);
};

export default function AIGuidanceCard({ guidance, title = 'AI First-Aid Guidance' }) {
  const steps = parseGuidanceSteps(guidance);

  if (!guidance) return null;

  return (
    <div className="ai-guidance-card">
      <div className="ai-guidance-header">
        <span className="ai-badge">✨ Gemini AI</span>
        <span className="ai-guidance-title">{title}</span>
      </div>
      <div className="ai-guidance-steps">
        {steps.map((step, i) => (
          <div key={i} className="guidance-step">
            <div className="step-number">{i + 1}</div>
            <p className="step-text">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
