import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Settings, Save, Database, AlertTriangle, Upload, Download, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import ThemeToggle from '@/components/ThemeToggle.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';

// Configuración concentra ajustes de simulación y operaciones de respaldo local del MVP.
export default function ConfiguracionPage() {
  const [threshold, setThreshold] = useLocalStorage('syntix_threshold', 15);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const { isDarkMode } = useTheme();

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleExportBackup = () => {
    try {
      // Solo se exportan claves del espacio syntix_ para no contaminar el respaldo con datos ajenos.
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
        
        // La validación mínima evita cargar archivos que no pertenezcan al formato del proyecto.
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

      <div data-onboarding="settings-header">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>Configuración del Sistema</h1>
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Ajustes generales y gestión de datos</p>
      </div>

      {message.text && (
        <div className={`flex items-center gap-3 rounded-lg border p-4 ${
          message.type === 'success'
            ? isDarkMode
              ? 'border-emerald-900 bg-emerald-950/70 text-emerald-300'
              : 'border-green-200 bg-green-50 text-green-800'
            : isDarkMode
              ? 'border-red-950 bg-red-950/70 text-red-300'
              : 'border-red-200 bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className={`overflow-hidden rounded-2xl border shadow-sm ${
        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
      }`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
          <h2 className={`mb-4 flex items-center gap-2 text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            <Settings className={`w-5 h-5 ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`} /> Parámetros de Alertas
          </h2>
          <div className="mb-6">
            <ThemeToggle label="Modo oscuro" />
          </div>
          <div data-onboarding="settings-threshold" className="max-w-md">
            <label className={`mb-2 block text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
              Umbral de Alerta Amarilla (Días)
            </label>
            <div className="flex gap-4">
              <input 
                type="number" 
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-syntix-green ${
                  isDarkMode
                    ? 'border-slate-700 bg-slate-950 text-slate-100'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                min="1"
                max="60"
              />
              <button data-onboarding="settings-save-button" onClick={() => showMessage('success', 'Umbral guardado correctamente.')} className="bg-syntix-navy text-white px-4 py-2 rounded-lg font-medium hover:bg-syntix-navy/90 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Guardar
              </button>
            </div>
            <p className={`mt-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Los documentos se marcarán en amarillo cuando falten {threshold} días o menos para su vencimiento.
            </p>
          </div>
        </div>

        <div data-onboarding="settings-data-management" className={`p-6 ${isDarkMode ? 'bg-slate-950/60' : 'bg-gray-50'}`}>
          <h2 className={`mb-4 flex items-center gap-2 text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            <Database className={`w-5 h-5 ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`} /> Gestión de Datos
          </h2>
          <div className="flex flex-wrap gap-4">
            <button data-onboarding="settings-export" onClick={handleExportBackup} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
            }`}>
              <Download className="w-4 h-4" /> Exportar Respaldo
            </button>
            
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImportBackup}
            />
            <button data-onboarding="settings-import" onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
            }`}>
              <Upload className="w-4 h-4" /> Importar Respaldo
            </button>
            
            <button data-onboarding="settings-reset" onClick={() => setShowResetConfirm(true)} className={`ml-auto flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold shadow-sm transition-colors ${
              isDarkMode
                ? 'border-red-950 bg-red-950/50 text-red-300 hover:bg-red-950/70'
                : 'border-red-200 bg-red-50 text-syntix-red hover:bg-red-100'
            }`}>
              <AlertTriangle className="w-4 h-4" /> Restablecer Datos
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl ${
            isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white'
          }`}>
            <div className="mb-4 flex items-center gap-3 text-syntix-red">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-xl font-bold">¿Restablecer todos los datos?</h2>
            </div>
            <p className={`mb-6 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Esta acción eliminará permanentemente todos los vehículos, conductores, documentos y configuraciones. La aplicación se reiniciará y volverá a la página de inicio. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowResetConfirm(false)} className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
              }`}>
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
