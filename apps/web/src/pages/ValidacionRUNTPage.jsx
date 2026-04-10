import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Database, XCircle } from 'lucide-react';
import ValidacionResultadoCard from '@/components/ValidacionResultadoCard.jsx';
import { useRUNTSimulator } from '@/hooks/useRUNTSimulator.js';
import { useValidationHistory } from '@/hooks/useValidationHistory.js';
import { useVehicles } from '@/hooks/useVehicles.js';
import { useConductors } from '@/hooks/useConductors.js';

export default function ValidacionRUNTPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('placa'); // 'placa' o 'vin'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const { searchByPlaca, searchByVIN } = useRUNTSimulator();
  const { addValidation } = useValidationHistory();
  const { vehiculos } = useVehicles();
  const { conductores } = useConductors();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setResult(null);

    // Simular delay de consulta
    setTimeout(() => {
      let searchResult;
      if (searchType === 'placa') {
        searchResult = searchByPlaca(searchInput.toUpperCase());
      } else {
        searchResult = searchByVIN(searchInput.toUpperCase());
      }

      setResult(searchResult);

      // Agregar a búsquedas recientes
      if (searchResult.encontrado) {
        setRecentSearches(prev => {
          const filtered = prev.filter(s => s !== searchResult.data.placa);
          return [searchResult.data.placa, ...filtered].slice(0, 5);
        });
      }

      setLoading(false);
    }, 600);
  };

  const handleSaveValidation = () => {
    if (!result?.encontrado) return;

    const vehiculoEnSistema = vehiculos.find(v => v.placa === result.data.placa);
    const conductorAsignado = vehiculoEnSistema?.conductor;

    const newValidation = addValidation(
      result.data.placa,
      result,
      'usuario_actual'
    );

    // Mostrar confirmación
    alert('✅ Validación guardada correctamente en el historial');
    setSearchInput('');
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Validación RUNT | SYNTIX Drive Control</title>
      </Helmet>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-syntix-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-syntix-navy" />
        </div>
        <h1 className="text-3xl font-bold text-syntix-navy">Validación RUNT</h1>
        <p className="text-gray-500 mt-2">Consulta el Registro Único Nacional de Tránsito</p>
      </div>

      {/* Formulario de Búsqueda */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Selector de Tipo de Búsqueda */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                value="placa" 
                checked={searchType === 'placa'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-4 h-4"
              />
              <span className="font-medium text-gray-700">Buscar por Placa</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                value="vin" 
                checked={searchType === 'vin'}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-4 h-4"
              />
              <span className="font-medium text-gray-700">Buscar por VIN</span>
            </label>
          </div>

          {/* Input de Búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder={searchType === 'placa' ? 'Ej. ABC-123' : 'Ej. WVWZZZ3CZ9E123456'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-bold uppercase tracking-wider focus:ring-0 focus:border-syntix-green text-gray-900 transition-colors"
                maxLength={searchType === 'placa' ? 7 : 17}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !searchInput.trim()}
              className="bg-syntix-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-syntix-navy/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>

          {/* Búsquedas Recientes */}
          {recentSearches.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-bold text-gray-600 mb-2">Búsquedas recientes:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(placa => (
                  <button
                    key={placa}
                    type="button"
                    onClick={() => {
                      setSearchInput(placa);
                      setSearchType('placa');
                    }}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    {placa}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Resultado */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {result.error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="w-12 h-12 text-syntix-red" />
              </div>
              <h3 className="text-xl font-bold text-syntix-red mb-2">Búsqueda sin resultados</h3>
              <p className="text-red-700">{result.error}</p>
            </div>
          )}

          {result.encontrado && (
            <ValidacionResultadoCard
              datosRUNT={result}
              vehiculoSistema={vehiculos.find(v => v.placa === result.data.placa)}
              conductorAsignado={vehiculos.find(v => v.placa === result.data.placa)?.conductor}
              onGuardar={handleSaveValidation}
              loading={loading}
            />
          )}
        </div>
      )}

      {/* Link a Historial */}
      <div className="text-center p-6 bg-syntix-navy/5 rounded-xl">
        <p className="text-gray-600 mb-2">¿Quieres ver todas tus validaciones?</p>
        <a 
          href="/historial-validaciones"
          className="text-syntix-navy font-bold hover:underline"
        >
          Ver Historial Completo →
        </a>
      </div>
    </div>
  );
}