import React, { useState } from 'react';
import { useVehicles } from '@/hooks/useVehicles.js';
import { useAlerts } from '@/hooks/useAlerts.js';
import { AlertTriangle, ChevronDown, ChevronUp, Activity } from 'lucide-react';

export default function DataPanel() {
  const { vehiculos } = useVehicles();
  const { alerts } = useAlerts();
  const [isExpanded, setIsExpanded] = useState(false);

  const totalVehicles = vehiculos.length;
  const alDiaVehicles = vehiculos.filter(v => v.estadoGeneral === 'verde').length;
  const cumplimiento = totalVehicles > 0 ? Math.round((alDiaVehicles / totalVehicles) * 100) : 0;

  let cumplimientoColor = 'text-syntix-red';
  if (cumplimiento >= 80) cumplimientoColor = 'text-syntix-green';
  else if (cumplimiento >= 50) cumplimientoColor = 'text-yellow-500';

  const yellowAlerts = alerts.filter(a => a.prioridad === 'amarillo');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-gray-400" />
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Cumplimiento Total</h3>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-5xl font-black ${cumplimientoColor}`}>{cumplimiento}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Vehículos al día vs Total de la flota</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">Próximos a Vencer</h3>
          </div>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">
            {yellowAlerts.length}
          </span>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-black text-yellow-500">{yellowAlerts.length}</span>
          <span className="text-sm text-gray-500 mb-1">alertas</span>
        </div>

        {yellowAlerts.length > 0 && (
          <div className="mt-auto">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-xs font-bold text-gray-500 hover:text-syntix-navy transition-colors"
            >
              {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2 max-h-32 overflow-y-auto pr-2">
                {yellowAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="flex justify-between items-center text-xs p-2 bg-yellow-50 rounded-lg border border-yellow-100"
                  >
                    <span className="font-medium text-yellow-900 truncate mr-2">
                      {alert.tipo}: {alert.entidad}
                    </span>
                    <span className="font-bold text-yellow-700 whitespace-nowrap">{alert.diasRestantes} d</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}