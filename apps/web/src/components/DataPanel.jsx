import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useVehicles } from '@/hooks/useVehicles.js';
import { useAlerts } from '@/hooks/useAlerts.js';
import { AlertTriangle, ChevronDown, ChevronUp, Activity } from 'lucide-react';

export default function DataPanel() {
  const { vehiculos } = useVehicles();
  const { alerts } = useAlerts();
  const [isExpanded, setIsExpanded] = useState(false);

  // Metric 1: % Cumplimiento Total
  const totalVehicles = vehiculos.length;
  const alDiaVehicles = vehiculos.filter(v => v.estadoGeneral === 'verde').length;
  const cumplimiento = totalVehicles > 0 ? Math.round((alDiaVehicles / totalVehicles) * 100) : 0;

  let cumplimientoColor = 'text-syntix-red';
  if (cumplimiento >= 80) cumplimientoColor = 'text-syntix-green';
  else if (cumplimiento >= 50) cumplimientoColor = 'text-yellow-500';

  // Metric 2: Documentos Próximos a Vencer (Amarillo)
  const yellowAlerts = alerts.filter(a => a.prioridad === 'amarillo');

  // Metric 3: Vehicle Distribution Chart
  const typeCounts = vehiculos.reduce((acc, v) => {
    acc[v.tipo] = (acc[v.tipo] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(typeCounts).map(tipo => ({
    name: tipo,
    cantidad: typeCounts[tipo],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Metric 1 */}
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

      {/* Metric 2 */}
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
              aria-expanded={isExpanded}
              aria-controls="yellow-alerts-details"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-xs font-bold text-gray-500 hover:text-syntix-navy transition-colors"
            >
              {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <div id="yellow-alerts-details" className="mt-3 space-y-2 max-h-32 overflow-y-auto pr-2">
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

      {/* Metric 3 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Distribución por Tipo</h3>
        <div className="flex-1 min-h-[150px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="cantidad" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#1B263B" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">Sin datos</div>
          )}
        </div>
      </div>
    </div>
  );
} //wi