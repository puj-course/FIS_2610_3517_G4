import React from 'react';
import { Helmet } from 'react-helmet';
import { BarChart3, Download } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles.js';

export default function ReportesPage() {
  const { vehiculos } = useVehicles();

  const stats = {
    verde: vehiculos.filter(v => v.estadoGeneral === 'verde').length,
    amarillo: vehiculos.filter(v => v.estadoGeneral === 'amarillo').length,
    rojo: vehiculos.filter(v => v.estadoGeneral === 'rojo').length,
    total: vehiculos.length
  };

  const cumplimiento = stats.total > 0 ? Math.round((stats.verde / stats.total) * 100) : 0;

  const handleExportCSV = () => {
    const headers = ['Placa', 'Marca/Modelo', 'Tipo', 'Conductor', 'Estado SOAT', 'Estado Licencia', 'Estado General', 'Días Restantes SOAT', 'Días Restantes Licencia'];
    
    const rows = vehiculos.map(v => {
      const conductorName = v.conductor ? v.conductor.nombre : 'Sin asignar';
      const soatDays = v.soat ? v.soat.diasRestantes : 'N/A';
      const licDays = v.conductor ? v.conductor.diasRestantes : 'N/A';
      
      return [
        v.placa,
        `${v.marca} ${v.modelo}`,
        v.tipo,
        conductorName,
        v.estadoSoat.toUpperCase(),
        v.estadoLicencia.toUpperCase(),
        v.estadoGeneral.toUpperCase(),
        soatDays,
        licDays
      ].map(field => `"${field}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Drive_Control_Reporte_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Reportes | SYNTIX Drive Control</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-syntix-navy">Reportes y Analítica</h1>
          <p className="text-gray-500 text-sm mt-1">Métricas de cumplimiento de la flota</p>
        </div>
        <button onClick={handleExportCSV} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Descargar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-syntix-navy rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-syntix-green rounded-full opacity-20 blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Cumplimiento Total</h3>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black text-syntix-green">{cumplimiento}%</span>
            </div>
            <p className="mt-4 text-gray-400">Vehículos al día según la Regla de Oro</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribución de Estados</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-syntix-green">Al Día (Verde)</span>
                <span>{stats.verde}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-syntix-green h-2.5 rounded-full" style={{ width: `${(stats.verde/stats.total)*100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-yellow-500">Por Vencer (Amarillo)</span>
                <span>{stats.amarillo}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(stats.amarillo/stats.total)*100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-syntix-red">Crítico (Rojo)</span>
                <span>{stats.rojo}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-syntix-red h-2.5 rounded-full" style={{ width: `${(stats.rojo/stats.total)*100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}