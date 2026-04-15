import React from 'react';
import { Shield } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments.js';
import { useVehicles } from '@/hooks/useVehicles.js';

function getBadgeClasses(estado) {
  if (estado === 'ROJO') {
    return 'bg-red-50 text-red-500 border border-red-200';
  }
  if (estado === 'AMARILLO') {
    return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
  }
  return 'bg-green-50 text-green-600 border border-green-200';
}

export default function DocumentosPage() {
  const { soats } = useDocuments();
  const { vehiculos } = useVehicles();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-syntix-navy mb-2">
          Gestión de Documentos
        </h1>
        <p className="text-gray-500 text-lg">Control de SOAT y pólizas</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <Shield className="w-6 h-6 text-syntix-navy" />
          <h2 className="text-2xl font-bold text-syntix-navy">Pólizas SOAT</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-syntix-navy font-bold">Vehículo</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">N° Póliza</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Vencimiento</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Días Restantes</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Estado</th>
              </tr>
            </thead>

            <tbody>
              {soats.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No hay documentos registrados.
                  </td>
                </tr>
              ) : (
                soats.map((s) => {
                  const vehiculo = vehiculos.find(
                    (v) => String(v.id) === String(s.vehiculoId)
                  );

                  return (
                    <tr key={s.id} className="border-t border-gray-100">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {vehiculo ? vehiculo.placa : 'Vehículo no encontrado'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{s.numeroPoliza}</td>
                      <td className="px-6 py-4 text-gray-700">{s.fechaVencimiento}</td>
                      <td className="px-6 py-4 text-gray-700">{s.diasRestantes} días</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClasses(s.estado)}`}
                        >
                          {s.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}