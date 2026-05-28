export const saveStorage = (key, value) => {
  try { localStorage.setItem(`resqai_${key}`, JSON.stringify(value)); } catch {}
};
export const loadStorage = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(`resqai_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch { return defaultVal; }
};
export const removeStorage = (key) => {
  try { localStorage.removeItem(`resqai_${key}`); } catch {}
};
