import { useState, useCallback, useRef } from 'react';

const SUPPORTED = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useVoice = (language = 'en') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const startListening = useCallback((onResult) => { // eslint-disable-line react-hooks/exhaustive-deps
    if (!SUPPORTED) return;
    const recognition = new SpeechRecognition();
    const langMap = { en: 'en-IN', hi: 'hi-IN', es: 'es-ES' };
    recognition.lang = langMap[language] || 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map((r) => r[0].transcript).join('');
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal && onResult) onResult(t);
    };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.onerror = () => { setIsListening(false); recognitionRef.current = null; };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, supported: SUPPORTED };
};
