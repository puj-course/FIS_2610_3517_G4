import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Database, XCircle } from 'lucide-react';
import ValidacionResultadoCard from '@/components/ValidacionResultadoCard.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useRUNTSimulator } from '@/hooks/useRUNTSimulator.js';
import { useValidationHistory } from '@/hooks/useValidationHistory.js';
import { useVehicles } from '@/hooks/useVehicles.js';

// ValidacionRUNTPage orquesta la búsqueda externa simulada y la guarda como evidencia interna.
export default function ValidacionRUNTPage() {
  const { isDarkMode } = useTheme();
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('placa'); // 'placa' o 'vin'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const { user } = useAuth();
  const { searchByPlaca, searchByVIN } = useRUNTSimulator();
  const { addValidation } = useValidationHistory();
  const { vehiculos } = useVehicles();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setResult(null);

    // El delay mantiene la sensación de consulta externa y hace visible el estado de carga.
    setTimeout(() => {
      let searchResult;
      if (searchType === 'placa') {
        searchResult = searchByPlaca(searchInput.toUpperCase());
      } else {
        searchResult = searchByVIN(searchInput.toUpperCase());
      }

      setResult(searchResult);

      // El historial corto de búsquedas acelera la reconsulta de placas usadas con frecuencia.
      if (searchResult.encontrado) {
        setRecentSearches(prev => {
          const filtered = prev.filter(s => s !== searchResult.data.placa);
          return [searchResult.data.placa, ...filtered].slice(0, 5);
        });
      }

      setLoading(false);
    }, 600);
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveValidation = async () => {
    if (!result?.encontrado) return;
    setSaving(true);
    setSaveError('');
    try {
      await addValidation(
        result.data.placa,
        result,
        user?.email || 'Admin User',
      );
      setSearchInput('');
      setResult(null);
    } catch (err) {
      console.error('Error guardando validacion RUNT:', err);
      setSaveError('Error al guardar la validación. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Validación RUNT | SYNTIX Drive Control</title>
      </Helmet>

      <div data-onboarding="runt-header" className="text-center mb-8">
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
          isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-syntix-navy/5 text-syntix-navy'
        }`}>
          <Database className="w-8 h-8" />
        </div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>Validación RUNT</h1>
        <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Consulta el Registro Único Nacional de Tránsito</p>
      </div>

      {/* Formulario de Búsqueda */}
      <div data-onboarding="runt-search" className={`space-y-4 rounded-2xl border p-8 shadow-lg ${
        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
      }`}>
        {/* El usuario puede alternar entre placa y VIN sin cambiar de vista;
            el formulario adapta placeholder y longitud máxima sobre la marcha. */}
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Selector de Tipo de Búsqueda */}
          <div data-onboarding="runt-search-type" className="flex gap-4">
            <label htmlFor="runt-search-type-placa" className={`flex cursor-pointer items-center gap-2 ${isDarkMode ? 'text-slate-200' : ''}`}>
              <input
                id="runt-search-type-placa"
                type="radio"
                value="placa" 
                checked={searchType === 'placa'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-4 h-4"
              />
              <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Buscar por Placa</span>
            </label>
            <label htmlFor="runt-search-type-vin" className={`flex cursor-pointer items-center gap-2 ${isDarkMode ? 'text-slate-200' : ''}`}>
              <input
                id="runt-search-type-vin"
                type="radio"
                value="vin" 
                checked={searchType === 'vin'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-4 h-4"
              />
              <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Buscar por VIN</span>
            </label>
          </div>

          {/* Input de Búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div data-onboarding="runt-search-input" className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
              <input 
                type="text" 
                placeholder={searchType === 'placa' ? 'Ej. ABC-123' : 'Ej. WVWZZZ3CZ9E123456'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                className={`w-full rounded-xl border-2 py-4 pl-12 pr-4 text-lg font-bold uppercase tracking-wider transition-colors focus:border-syntix-green focus:ring-0 ${
                  isDarkMode
                    ? 'border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500'
                    : 'border-gray-200 text-gray-900'
                }`}
                maxLength={searchType === 'placa' ? 7 : 17}
              />
            </div>
            <button 
              data-onboarding="runt-search-button"
              type="submit" 
              disabled={loading || !searchInput.trim()}
              className="bg-syntix-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-syntix-navy/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>

          {/* Búsquedas Recientes */}
          {recentSearches.length > 0 && (
            <div data-onboarding="runt-recent-searches" className={`rounded-lg p-3 ${
              isDarkMode ? 'bg-slate-950/70' : 'bg-gray-50'
            }`}>
              <p className={`mb-2 text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Búsquedas recientes:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(placa => (
                  <button
                    key={placa}
                    type="button"
                    onClick={() => {
                      setSearchInput(placa);
                      setSearchType('placa');
                    }}
                    className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                        : 'border-gray-300 bg-white hover:bg-gray-100'
                    }`}
                  >
                    {placa}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Error al guardar */}
      {saveError && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {saveError}
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {result.error && (
            <div className={`rounded-2xl border-2 p-8 text-center ${
              isDarkMode ? 'border-red-900 bg-red-950/40' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex justify-center mb-4">
                <XCircle className="w-12 h-12 text-syntix-red" />
              </div>
              <h3 className="text-xl font-bold text-syntix-red mb-2">Búsqueda sin resultados</h3>
              <p className={isDarkMode ? 'text-red-300' : 'text-red-700'}>{result.error}</p>
            </div>
          )}

          {result.encontrado && (
            <ValidacionResultadoCard
              datosRUNT={result}
              vehiculoSistema={vehiculos.find(v => v.placa === result.data.placa)}
              conductorAsignado={vehiculos.find(v => v.placa === result.data.placa)?.conductor}
              onGuardar={handleSaveValidation}
              loading={loading || saving}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      )}

      {/* Link a Historial */}
      <div data-onboarding="runt-history-link" className={`rounded-xl p-6 text-center ${
        isDarkMode ? 'bg-slate-900' : 'bg-syntix-navy/5'
      }`}>
        <p className={`mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>¿Quieres ver todas tus validaciones?</p>
        <a 
          href="/historial-validaciones"
          className={`font-bold hover:underline ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}
        >
          Ver Historial Completo →
        </a>
      </div>
    </div>
  );
}
