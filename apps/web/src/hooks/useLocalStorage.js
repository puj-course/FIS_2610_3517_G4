import { useState, useEffect } from 'react';

const LOCAL_STORAGE_EVENT = 'syntix-local-storage-update';

// useLocalStorage sincroniza estado React, localStorage y eventos cruzados entre pestañas/componentes.
export function useLocalStorage(key, initialValue) {
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    // Cada escritura emite un evento propio para que otros hooks reaccionen incluso en la misma pestaña.
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      window.dispatchEvent(
        new CustomEvent(LOCAL_STORAGE_EVENT, {
          detail: { key, value: storedValue }
        })
      );
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    // Se escuchan tanto eventos nativos como el evento custom para cubrir todos los caminos de actualización.
    const handleStorageChange = (event) => {
      if (event.key && event.key !== key) return;
      setStoredValue(readValue());
    };

    const handleCustomStorageChange = (event) => {
      if (event.detail?.key !== key) return;
      setStoredValue(event.detail.value);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_EVENT, handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_EVENT, handleCustomStorageChange);
    };
  }, [key]);

  return [storedValue, setStoredValue];
}
