import { useState, useEffect } from 'react';

const LOCAL_STORAGE_EVENT = 'syntix-local-storage-update';
const getLocalStorage = () =>
  (typeof globalThis !== 'undefined' && globalThis.localStorage ? globalThis.localStorage : null);

// useLocalStorage sincroniza estado React, localStorage y eventos cruzados entre pestañas/componentes.
export function useLocalStorage(key, initialValue) {
  const readValue = () => {
    try {
      const item = getLocalStorage()?.getItem(key);
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
      getLocalStorage()?.setItem(key, JSON.stringify(storedValue));
      globalThis.dispatchEvent?.(
        new globalThis.CustomEvent(LOCAL_STORAGE_EVENT, {
          detail: { key, value: storedValue }
        })
      );
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    if (typeof globalThis === 'undefined' || !globalThis.addEventListener) return undefined;

    // Se escuchan tanto eventos nativos como el evento custom para cubrir todos los caminos de actualización.
    const handleStorageChange = (event) => {
      if (event.key && event.key !== key) return;
      setStoredValue(readValue());
    };

    const handleCustomStorageChange = (event) => {
      if (event.detail?.key !== key) return;
      setStoredValue(event.detail.value);
    };

    globalThis.addEventListener('storage', handleStorageChange);
    globalThis.addEventListener(LOCAL_STORAGE_EVENT, handleCustomStorageChange);

    return () => {
      globalThis.removeEventListener('storage', handleStorageChange);
      globalThis.removeEventListener(LOCAL_STORAGE_EVENT, handleCustomStorageChange);
    };
  }, [key]);

  return [storedValue, setStoredValue];
}
