import React from 'react';
import { Helmet } from 'react-helmet';
import { FileText, Shield } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import { useDocuments } from '@/hooks/useDocuments.js';
import { useVehicles } from '@/hooks/useVehicles.js';

export default function DocumentosPage() {
  const { soats } = useDocuments();
  const { vehiculos } = useVehicles();

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Documentos | SYNTIX Drive Control</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-syntix-navy">Gestión de Documentos</h1>
        <p className="text-gray-500 text-sm mt-1">Control de SOAT y pólizas</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <Shield className="w-5 h-5 text-syntix-navy" />
          <h2 className="font-bold text-gray-900">Pólizas SOAT</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Vehículo</th>
                <th className="px-6 py-4">N° Póliza</th>
                <th className="px-6 py-4">Vencimiento</th>
                <th className="px-6 py-4">Días Restantes</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {soats.map((s) => {
                const v = vehiculos.find(veh => veh.id === s.vehiculoId);
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{v ? v.placa : 'Desconocido'}</td>
                    <td className="px-6 py-4 font-mono text-xs">{s.numeroPoliza}</td>
                    <td className="px-6 py-4">{s.fechaVencimiento}</td>
                    <td className="px-6 py-4 font-medium">{s.diasRestantes} días</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.estado} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}