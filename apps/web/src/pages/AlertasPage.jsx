import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { BellRing, Calendar } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts.js';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';

const alertGroups = [
  {
    title: 'Vehiculos',
    description: 'Alertas documentales asociadas a la flota.',
    groups: [
      { key: 'SOAT', title: 'SOAT', emptyMessage: 'No hay alertas de SOAT.' },
      { key: 'RTM', title: 'RTM', emptyMessage: 'No hay alertas de RTM.' },
    ],
  },
  {
    title: 'Conductores',
    description: 'Alertas por vigencia de licencias de conduccion.',
    groups: [
      { key: 'Licencias', title: 'Licencias', emptyMessage: 'No hay alertas de licencias.' },
    ],
  },
];

// Centro de alertas: deja ver el estado consolidado del sistema para una fecha dada.
export default function AlertasPage() {
  const { alerts } = useAlerts();
  const { simulatedDate, setSimulatedDate, resetDate } = useSimulatedDate();

  const alertCount = alerts.length;

  const groupedAlerts = useMemo(() => {
    return alerts.reduce((acc, alert) => {
      const category = alert.categoria || 'general';
      const group = alert.grupo || alert.tipo || 'General';
      const key = `${category}:${group}`;

      acc[key] = acc[key] || [];
      acc[key].push(alert);

      return acc;
    }, {});
  }, [alerts]);

  const getGroupAlerts = (sectionTitle, groupKey) => {
    const category = sectionTitle === 'Conductores' ? 'conductores' : 'vehiculos';
    return groupedAlerts[`${category}:${groupKey}`] || [];
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Alertas | SYNTIX Drive Control</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-syntix-navy">Centro de Alertas</h1>
          <p className="text-gray-500 text-sm mt-1">Notificaciones automaticas basadas en la Regla de Oro</p>
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
          <button onClick={resetDate} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-medium transition-colors">
            Hoy
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-syntix-navy" /> Alertas Activas ({alertCount})
          </h2>
        </div>

        {alertCount === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-6">
            No hay alertas activas para la fecha seleccionada.
          </div>
        )}

        <div className="space-y-8">
          {alertGroups.map((section) => (
            <section key={section.title} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-syntix-navy">{section.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{section.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {section.groups.map((group) => (
                  <AlertGroup
                    key={`${section.title}-${group.key}`}
                    title={group.title}
                    alerts={getGroupAlerts(section.title, group.key)}
                    emptyMessage={group.emptyMessage}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertGroup({ title, alerts, emptyMessage }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h4 className="font-bold text-gray-900">{title}</h4>
        <span className="text-xs font-bold px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-600">
          {alerts.length}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="text-sm text-gray-500 bg-white rounded-lg border border-dashed border-gray-200 p-4">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}

function AlertItem({ alert }) {
  const isCritical = alert.prioridad === 'rojo';

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-4 shadow-sm ${
        isCritical ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'
      }`}
    >
      <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-100 text-syntix-red' : 'bg-yellow-100 text-yellow-600'}`}>
        <BellRing className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <h5 className={`font-bold ${isCritical ? 'text-red-900' : 'text-yellow-900'}`}>
            {alert.mensaje}
          </h5>
          <span className={`text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ${isCritical ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
            {alert.diasRestantes} dias
          </span>
        </div>
        <p className={`text-sm mt-1 ${isCritical ? 'text-red-700' : 'text-yellow-700'}`}>
          <span className="font-semibold">{alert.tipo}:</span> {alert.entidad}
        </p>
      </div>
    </div>
  );
}
