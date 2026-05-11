import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BellRing, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts.js';
import { useSimulatedDate } from '@/hooks/useSimulatedDate.js';
import { getExpirationAlertText } from '@/utils/dateUtils.js';

const alertSections = [
  {
    id: 'vehiculos',
    title: 'Vehiculos',
    description: 'Alertas documentales asociadas a la flota.',
    groups: [
      { key: 'SOAT', title: 'SOAT' },
      { key: 'RTM', title: 'RTM' },
    ],
  },
  {
    id: 'conductores',
    title: 'Conductores',
    description: 'Alertas por vigencia de licencias de conduccion.',
    groups: [
      { key: 'Licencias', title: 'Licencias' },
    ],
  },
];

const toggleMapValue = (setter, key) => {
  setter((prev) => ({ ...prev, [key]: !prev[key] }));
};

// Centro de alertas: deja ver el estado consolidado del sistema para una fecha dada.
export default function AlertasPage() {
  const { alerts } = useAlerts();
  const { simulatedDate, setSimulatedDate, resetDate } = useSimulatedDate();
  const [openSections, setOpenSections] = useState({ vehiculos: true, conductores: true });
  const [openGroups, setOpenGroups] = useState({ SOAT: true, RTM: true, Licencias: true });

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

  const getGroupAlerts = (category, groupKey) => groupedAlerts[`${category}:${groupKey}`] || [];
  const getSectionCount = (section) =>
    section.groups.reduce((total, group) => total + getGroupAlerts(section.id, group.key).length, 0);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Alertas | SYNTIX Drive Control</title>
      </Helmet>

      <div data-onboarding="alerts-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-syntix-navy">Centro de Alertas</h1>
          <p className="text-gray-500 text-sm mt-1">Notificaciones automaticas basadas en la Regla de Oro</p>
        </div>

        <div data-onboarding="alerts-date-filter" className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
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
            data-onboarding="alerts-reset-date"
            onClick={resetDate}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-medium transition-colors"
          >
            Hoy
          </button>
        </div>
      </div>

      <div data-onboarding="alerts-list" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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

        <div className="space-y-4">
          {alertSections.map((section) => (
            <AlertSection
              key={section.id}
              section={section}
              count={getSectionCount(section)}
              isOpen={Boolean(openSections[section.id])}
              onToggle={() => toggleMapValue(setOpenSections, section.id)}
              openGroups={openGroups}
              onGroupToggle={(groupKey) => toggleMapValue(setOpenGroups, groupKey)}
              getGroupAlerts={getGroupAlerts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertSection({
  section,
  count,
  isOpen,
  onToggle,
  openGroups,
  onGroupToggle,
  getGroupAlerts,
}) {
  const Icon = isOpen ? ChevronDown : ChevronRight;

  return (
    <section className="border border-gray-100 rounded-xl bg-gray-50/60 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-3 min-w-0">
          <Icon className="w-5 h-5 text-syntix-navy shrink-0" />
          <span>
            <span className="block font-bold text-syntix-navy">
              {section.title} ({count})
            </span>
            <span className="block text-sm text-gray-500 mt-1">{section.description}</span>
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {section.groups.map((group) => {
            const groupAlerts = getGroupAlerts(section.id, group.key);

            return (
              <AlertGroup
                key={`${section.id}-${group.key}`}
                title={group.title}
                alerts={groupAlerts}
                isOpen={Boolean(openGroups[group.key])}
                onToggle={() => onGroupToggle(group.key)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

function AlertGroup({ title, alerts, isOpen, onToggle }) {
  const Icon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2 font-bold text-gray-900">
          <Icon className="w-4 h-4 text-gray-500 shrink-0" />
          {title} ({alerts.length})
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {alerts.length === 0 ? (
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 p-4">
              No hay alertas activas en este grupo.
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AlertItem({ alert }) {
  const isCritical = alert.prioridad === 'rojo';
  const expirationText = getExpirationAlertText(alert.diasRestantes, alert.fechaVencimiento);

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
            {alert.prioridad === 'rojo' ? 'Critica' : 'Proxima'}
          </span>
        </div>
        <p className={`text-sm mt-1 ${isCritical ? 'text-red-700' : 'text-yellow-700'}`}>
          <span className="font-semibold">{alert.tipo}:</span> {alert.entidad}
        </p>
        <p className={`text-xs mt-2 font-semibold ${isCritical ? 'text-red-800' : 'text-yellow-800'}`}>
          {expirationText.fullText}
        </p>
      </div>
    </div>
  );
}
