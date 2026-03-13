import React from 'react';
import { Activity } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles.js';

export default function DataPanel() {
  const { vehiculos } = useVehicles();

  const totalVehicles = vehiculos.length;
  const alDiaVehicles = vehiculos.filter(v => v.estadoGeneral === 'verde').length;
  const cumplimiento = totalVehicles > 0 ? Math.round((alDiaVehicles / totalVehicles) * 100) : 0;

  let cumplimientoColor = 'text-syntix-red';
  if (cumplimiento >= 80) cumplimientoColor = 'text-syntix-green';
  else if (cumplimiento >= 50) cumplimientoColor = 'text-yellow-500';

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
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
    </div>
  );
}