import React from 'react';
import { Helmet } from 'react-helmet';
import { BellRing, Calendar } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts.js';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';

export default function AlertasPage() {
  const { alerts } = useAlerts();
  const { simulatedDate, setSimulatedDate, resetDate } = useSimulatedDate();

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Alertas | SYNTIX Drive Control</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-syntix-navy">Centro de Alertas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Notificaciones automáticas basadas en la Regla de Oro
          </p>
        </div>

        <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-400 ml-2" />
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase">Simular Fecha</label>
            <input
              type="date"
              value={simulatedDate}
              onChange={(e) => setSimulatedDate(e.target.value)}
              className="text-sm font-medium text-syntix-navy outline-none bg-transparent"
            />
          </div>
          <button
            onClick={resetDate}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-medium transition-colors"
          >
            Hoy
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-syntix-navy" /> Alertas Activas ({alerts.length})
          </h2>
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No hay alertas activas para la fecha seleccionada.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-gray-200 flex items-start gap-4 shadow-sm"
              >
                <div className="p-2 rounded-lg bg-gray-100 text-syntix-navy">
                  <BellRing className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900">{alert.mensaje}</h4>
                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                      {alert.diasRestantes} días
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-600">
                    <span className="font-semibold">{alert.tipo}:</span> {alert.entidad}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}