import React from 'react';
import { Helmet } from 'react-helmet';
import { Calendar } from 'lucide-react';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';

export default function AlertasPage() {
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
    </div>
  );
}