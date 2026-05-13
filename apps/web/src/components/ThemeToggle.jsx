import React from 'react';
import PropTypes from 'prop-types';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';

// ThemeToggle muestra un switch compacto reutilizable para activar/desactivar
// el modo oscuro sin propagar lógica de tema por toda la UI.
export default function ThemeToggle({ label = 'Modo oscuro', compact = false }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const switchTrackClassName = (() => {
    if (isDarkMode) return 'bg-syntix-green';
    if (compact) return 'bg-white/25';
    return 'bg-gray-300 dark:bg-slate-700';
  })();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      onClick={toggleDarkMode}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
        compact
          ? 'border-white/15 bg-white/10 text-white hover:bg-white/15'
          : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {/* El icono cambia entre sol y luna para comunicar el estado actual
          sin obligar al usuario a leer el texto del switch. */}
      <div className={`rounded-full p-2 ${compact ? 'bg-white/10' : 'bg-amber-50 dark:bg-slate-800'}`}>
        {isDarkMode ? (
          <Moon className="h-4 w-4 text-syntix-green" />
        ) : (
          <Sun className={`h-4 w-4 ${compact ? 'text-amber-300' : 'text-amber-500'}`} />
        )}
      </div>

      <div className="text-left">
        <p className="text-sm font-semibold">{label}</p>
        {!compact && (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {isDarkMode ? 'Activo' : 'Desactivado'}
          </p>
        )}
      </div>

      <span
        className={`relative ml-auto inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          switchTrackClassName
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </button>
  );
}

ThemeToggle.propTypes = {
  label: PropTypes.string,
  compact: PropTypes.bool,
};
