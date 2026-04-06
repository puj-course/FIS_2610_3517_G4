import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles.js';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import StatusBadge from '@/components/StatusBadge.jsx';
import DataPanel from '@/components/DataPanel.jsx';
import AddVehicleModal from '@/components/AddVehicleModal.jsx';
import AddConductorModal from '@/components/AddConductorModal.jsx';

export default function DashboardPage() {
  const { vehiculos } = useVehicles();
  const { simulatedDate } = useSimulatedDate();
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isConductorModalOpen, setIsConductorModalOpen] = useState(false);

  const stats = {
    verde: vehiculos.filter(v => v.estadoGeneral === 'verde').length,
    amarillo: vehiculos.filter(v => v.estadoGeneral === 'amarillo').length,
    rojo: vehiculos.filter(v => v.estadoGeneral === 'rojo').length,
    total: vehiculos.length
  };

  const proximosVencer = vehiculos.filter(v => v.estadoGeneral === 'amarillo');
  const vencidos = vehiculos.filter(v => v.estadoGeneral === 'rojo');

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard | SYNTIX Drive Control</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-syntix-navy">Dashboard General</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fecha del sistema: <span className="font-semibold text-gray-700">{simulatedDate}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsVehicleModalOpen(true)} className="bg-syntix-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-syntix-navy/90 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Vehículo
          </button>
          <button onClick={() => setIsConductorModalOpen(true)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Conductor
          </button>
        </div>
      </div>
      <DataPanel />

      <DataPanel />

      {/* Semáforo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl text-syntix-green">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Al Día (Verde)</h3>
                <p className="text-xs text-gray-500">&gt; 15 días restantes</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-syntix-green">{stats.verde}</span>
              <span className="text-sm text-gray-500 mb-1">/ {stats.total} veh.</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Por Vencer (Amarillo)</h3>
                <p className="text-xs text-gray-500">0 - 15 días restantes</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-yellow-500">{stats.amarillo}</span>
              <span className="text-sm text-gray-500 mb-1">/ {stats.total} veh.</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl text-syntix-red">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Crítico (Rojo)</h3>
                <p className="text-xs text-gray-500">Vencidos o Faltantes</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-syntix-red">{stats.rojo}</span>
              <span className="text-sm text-gray-500 mb-1">/ {stats.total} veh.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vencidos List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-red-50/50 flex justify-between items-center">
            <h2 className="font-bold text-syntix-navy flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-syntix-red" /> Atención Inmediata
            </h2>
            <span className="bg-syntix-red text-white text-xs font-bold px-2.5 py-1 rounded-full">{vencidos.length}</span>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-96">
            {vencidos.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No hay vehículos en estado crítico.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {vencidos.map(v => (
                  <li key={v.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{v.placa}</p>
                      <p className="text-sm text-gray-500">{v.conductor ? v.conductor.nombre : 'Sin conductor'}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status="rojo" label="VENCIDO/FALTANTE" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Próximos a Vencer List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-yellow-50/50 flex justify-between items-center">
            <h2 className="font-bold text-syntix-navy flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" /> Próximos a Vencer
            </h2>
            <span className="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{proximosVencer.length}</span>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-96">
            {proximosVencer.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No hay documentos próximos a vencer.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {proximosVencer.map(v => (
                  <li key={v.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{v.placa}</p>
                      <p className="text-sm text-gray-500">{v.conductor?.nombre}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status="amarillo" label="POR VENCER" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <AddVehicleModal isOpen={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} />
      <AddConductorModal isOpen={isConductorModalOpen} onClose={() => setIsConductorModalOpen(false)} />
    </div>
  );
}