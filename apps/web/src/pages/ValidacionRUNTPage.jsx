import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, CheckCircle, XCircle, Database } from 'lucide-react';

export default function ValidacionRUNTPage() {
  const [placa, setPlaca] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!placa) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      if (['ABC-123', 'XYZ-987', 'DEF-456'].includes(placa.toUpperCase())) {
        setResult({
          found: true,
          data: {
            placa: placa.toUpperCase(),
            marca: 'Toyota',
            linea: 'Hilux',
            modelo: '2022',
            color: 'Blanco',
            soatVigente: true,
            rtmVigente: true
          }
        });
      } else {
        setResult({ found: false });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Helmet>
        <title>Validación RUNT | SYNTIX Drive Control</title>
      </Helmet>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-syntix-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-syntix-navy" />
        </div>
        <h1 className="text-3xl font-bold text-syntix-navy">Validación RUNT</h1>
        <p className="text-gray-500 mt-2">Simulador de consulta al Registro Único Nacional de Tránsito</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Ingrese placa (ej. ABC-123)" 
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-bold uppercase tracking-wider focus:ring-0 focus:border-syntix-green text-gray-900 transition-colors"
              maxLength={7}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-syntix-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-syntix-navy/90 transition-colors disabled:opacity-70 shadow-md"
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </form>

        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {result.found ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 text-syntix-green mb-6">
                  <CheckCircle className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Vehículo Encontrado</h3>
                </div>
                <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Placa</p>
                    <p className="text-xl font-black text-gray-900">{result.data.placa}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Marca / Línea</p>
                    <p className="text-lg font-bold text-gray-900">{result.data.marca} {result.data.linea}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Modelo</p>
                    <p className="text-lg font-bold text-gray-900">{result.data.modelo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Color</p>
                    <p className="text-lg font-bold text-gray-900">{result.data.color}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-syntix-red bg-red-50 p-6 rounded-xl border border-red-200">
                <XCircle className="w-8 h-8" />
                <div>
                  <h3 className="text-lg font-bold">Vehículo no encontrado</h3>
                  <p className="text-red-700 mt-1">La placa ingresada no existe en la base de datos simulada.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}