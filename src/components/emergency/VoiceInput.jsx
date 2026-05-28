import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useVoice } from '../../hooks/useVoice';
import { useT } from '../../i18n/translations';
import { tapVibrate } from '../../utils/haptics';

export default function VoiceInput({ onSubmit }) {
  const { state, dispatch } = useApp();
  const t = useT(state.language);
  const { isListening, startListening, stopListening, supported } = useVoice(state.language);
  const textareaRef = useRef(null);

  const handleMic = () => {
    tapVibrate();
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        dispatch({ type: 'SET_TEXT', payload: transcript });
      });
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [state.emergencyText]);

  return (
    <div className={`voice-input-bar ${isListening ? 'listening' : ''}`}>
      <textarea
        ref={textareaRef}
        className="voice-input-textarea"
        placeholder={isListening ? t.voiceListening : t.whatsHappening}
        value={state.emergencyText}
        onChange={(e) => dispatch({ type: 'SET_TEXT', payload: e.target.value })}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); } }}
      />
      {supported && (
        <button className={`mic-btn ${isListening ? 'active' : ''}`} onClick={handleMic} type="button">
          {isListening ? '⏹️' : '🎙️'}
        </button>
      )}
    </div>
  );
}
