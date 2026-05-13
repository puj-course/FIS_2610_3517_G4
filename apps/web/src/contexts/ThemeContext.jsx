import React, { createContext, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';

const ThemeContext = createContext(null);

// ThemeProvider persiste la preferencia visual del usuario y la refleja como
// clase global para que Tailwind active variantes dark sin acoplar cada vista
// a una implementación distinta del tema.
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('syntix_dark_mode', false);

  useEffect(() => {
    // La clase "dark" es el interruptor que entiende Tailwind; el data-theme
    // deja abierta la puerta a futuros estilos o tests más explícitos.
    document.documentElement.classList.toggle('dark', Boolean(isDarkMode));
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  const value = useMemo(
    () => ({
      isDarkMode: Boolean(isDarkMode),
      setIsDarkMode: (value) => setIsDarkMode(Boolean(value)),
      toggleDarkMode: () => setIsDarkMode((current) => !current),
    }),
    [isDarkMode, setIsDarkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  // Este guard evita que un componente lea el tema fuera del provider y falle
  // de forma silenciosa, algo importante ahora que el tema se usa en todo el dashboard.
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }

  return context;
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
