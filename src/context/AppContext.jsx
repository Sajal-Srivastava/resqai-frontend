import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loadStorage, saveStorage } from '../utils/storage';

const AppContext = createContext(null);

const initial = {
  screen: 'home',
  theme: loadStorage('theme', 'dark'),
  language: loadStorage('language', 'en'),
  location: null,
  locationError: null,
  emergencyText: '',
  selectedCategory: null,
  result: null,
  isLoading: false,
  sos: { active: false, countdown: 5, triggered: false },
  profile: loadStorage('profile', { name: '', bloodGroup: '', allergies: '', medications: '', conditions: '', emergencyNote: '' }),
  contacts: loadStorage('contacts', []),
  toasts: [],
  isOnline: navigator.onLine,
  nearbyServices: [],
  notificationsEnabled: loadStorage('notificationsEnabled', false),
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN': return { ...state, screen: action.payload };
    case 'SET_THEME': return { ...state, theme: action.payload };
    case 'SET_LANGUAGE': return { ...state, language: action.payload };
    case 'SET_LOCATION': return { ...state, location: action.payload, locationError: null };
    case 'SET_LOCATION_ERROR': return { ...state, locationError: action.payload };
    case 'SET_TEXT': return { ...state, emergencyText: action.payload };
    case 'SET_CATEGORY': return { ...state, selectedCategory: action.payload };
    case 'SET_RESULT': return { ...state, result: action.payload };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SET_SOS': return { ...state, sos: { ...state.sos, ...action.payload } };
    case 'UPDATE_PROFILE': {
      const profile = { ...state.profile, ...action.payload };
      saveStorage('profile', profile);
      return { ...state, profile };
    }
    case 'ADD_CONTACT': {
      const contacts = [...state.contacts, { id: Date.now(), ...action.payload }];
      saveStorage('contacts', contacts);
      return { ...state, contacts };
    }
    case 'REMOVE_CONTACT': {
      const contacts = state.contacts.filter((c) => c.id !== action.payload);
      saveStorage('contacts', contacts);
      return { ...state, contacts };
    }
    case 'ADD_TOAST': return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    case 'SET_ONLINE': return { ...state, isOnline: action.payload };
    case 'SET_NEARBY': return { ...state, nearbyServices: action.payload };
    case 'SET_NOTIFICATIONS': return { ...state, notificationsEnabled: action.payload };
    default: return state;
  }
}

const AVATAR_COLORS = ['#EF4444','#F97316','#F59E0B','#16A34A','#1D4ED8','#7C3AED','#DB2777','#0D9488'];
export const getAvatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    saveStorage('theme', state.theme);
  }, [state.theme]);

  useEffect(() => { saveStorage('language', state.language); }, [state.language]);

  useEffect(() => {
    const up = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const down = () => dispatch({ type: 'SET_ONLINE', payload: false });
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  const navigate = (screen) => dispatch({ type: 'SET_SCREEN', payload: screen });

  const toast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), duration);
  };

  return (
    <AppContext.Provider value={{ state, dispatch, navigate, toast }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
