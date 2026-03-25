import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Settings, Save, Database, AlertTriangle, Upload, Download, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';

export default function ConfiguracionPage() {
  const [threshold, setThreshold] = useLocalStorage('syntix_threshold', 15);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleExportBackup = () => {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('syntix_')) {
          data[key] = localStorage.getItem(key);
        }
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const dateStr = new Date().toISOString().split('T')[0];
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Drive_Control_Backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showMessage('success', 'Respaldo exportado correctamente.');
    } catch (error) {
      showMessage('error', 'Error al exportar el respaldo.');
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validate basic structure
        if (typeof data !== 'object' || data === null) throw new Error('Formato inválido');
        
        if (window.confirm('¿Está seguro de importar este respaldo? Se sobrescribirán los datos actuales.')) {
          Object.keys(data).forEach(key => {
            if (key.startsWith('syntix_')) {
              localStorage.setItem(key, data[key]);
            }
          });
          showMessage('success', 'Respaldo importado. Recargando aplicación...');
          setTimeout(() => window.location.reload(), 1500);
        }
      } catch (error) {
        showMessage('error', 'El archivo no es un respaldo válido de Drive Control.');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Helmet>
        <title>Configuración | SYNTIX Drive Control</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-syntix-navy">Configuración del Sistema</h1>
        <p className="text-gray-500 text-sm mt-1">Ajustes generales y gestión de datos</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-syntix-navy" /> Parámetros de Alertas
          </h2>
          <div className="max-w-md">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Umbral de Alerta Amarilla (Días)
            </label>
            <div className="flex gap-4">
              <input 
                type="number" 
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none"
                min="1"
                max="60"
              />
              <button onClick={() => showMessage('success', 'Umbral guardado correctamente.')} className="bg-syntix-navy text-white px-4 py-2 rounded-lg font-medium hover:bg-syntix-navy/90 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Guardar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Los documentos se marcarán en amarillo cuando falten {threshold} días o menos para su vencimiento.
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-syntix-navy" /> Gestión de Datos
          </h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={handleExportBackup} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportar Respaldo
            </button>
            
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImportBackup}
            />
            <button onClick={() => fileInputRef.current?.click()} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-2">
              <Upload className="w-4 h-4" /> Importar Respaldo
            </button>
            
            <button onClick={() => setShowResetConfirm(true)} className="bg-red-50 border border-red-200 text-syntix-red px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2 ml-auto">
              <AlertTriangle className="w-4 h-4" /> Restablecer Datos
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6">
            <div className="flex items-center gap-3 text-syntix-red mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-xl font-bold">¿Restablecer todos los datos?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Esta acción eliminará permanentemente todos los vehículos, conductores, documentos y configuraciones. La aplicación se reiniciará y volverá a la página de inicio. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={handleResetData} className="bg-syntix-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                Sí, eliminar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}