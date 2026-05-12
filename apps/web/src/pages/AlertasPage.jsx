import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BellRing, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';
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
  const { isDarkMode } = useTheme();
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
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>Centro de Alertas</h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Notificaciones automaticas basadas en la Regla de Oro</p>
        </div>

        <div data-onboarding="alerts-date-filter" className={`flex items-center gap-3 rounded-lg border p-2 shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
        }`}>
          <Calendar className={`ml-2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
          <div className="flex flex-col">
            <label className={`text-xs font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Simular Fecha</label>
            <input
              type="date"
              value={simulatedDate}
              onChange={(e) => setSimulatedDate(e.target.value)}
              className={`bg-transparent text-sm font-medium outline-none ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}
              style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
            />
          </div>
          <button
            data-onboarding="alerts-reset-date"
            onClick={resetDate}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Hoy
          </button>
        </div>
      </div>

      <div data-onboarding="alerts-list" className={`rounded-2xl border p-6 shadow-sm ${
        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`flex items-center gap-2 text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            <BellRing className="w-5 h-5 text-syntix-navy" /> Alertas Activas ({alertCount})
          </h2>
        </div>

        {alertCount === 0 && (
          <div className={`mb-6 rounded-xl border border-dashed py-8 text-center ${
            isDarkMode ? 'border-slate-700 bg-slate-950/60 text-slate-400' : 'border-gray-200 bg-gray-50 text-gray-500'
          }`}>
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
              isDarkMode={isDarkMode}
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
  isDarkMode,
}) {
  const Icon = isOpen ? ChevronDown : ChevronRight;

  return (
    <section className={`overflow-hidden rounded-xl border ${
      isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-gray-100 bg-gray-50/60'
    }`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-4 px-4 py-4 text-left transition-colors ${
          isDarkMode ? 'hover:bg-slate-800/80' : 'hover:bg-gray-50'
        }`}
      >
        <span className="flex items-center gap-3 min-w-0">
          <Icon className={`w-5 h-5 shrink-0 ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`} />
          <span>
            <span className={`block font-bold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>
              {section.title} ({count})
            </span>
            <span className={`mt-1 block text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{section.description}</span>
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
                isDarkMode={isDarkMode}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

function AlertGroup({ title, alerts, isOpen, onToggle, isDarkMode }) {
  const Icon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div className={`overflow-hidden rounded-xl border ${
      isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
    }`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-3 p-4 text-left transition-colors ${
          isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
        }`}
      >
        <span className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
          <Icon className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
          {title} ({alerts.length})
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {alerts.length === 0 ? (
            <div className={`rounded-lg border border-dashed p-4 text-sm ${
              isDarkMode ? 'border-slate-700 bg-slate-950/60 text-slate-400' : 'border-gray-200 bg-gray-50 text-gray-500'
            }`}>
              No hay alertas activas en este grupo.
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} isDarkMode={isDarkMode} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AlertItem({ alert, isDarkMode }) {
  const isCritical = alert.prioridad === 'rojo';
  const expirationText = getExpirationAlertText(alert.diasRestantes, alert.fechaVencimiento);

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-4 shadow-sm ${
        isCritical
          ? isDarkMode ? 'bg-red-950/35 border-red-900' : 'bg-red-50 border-red-100'
          : isDarkMode ? 'bg-amber-950/30 border-amber-900' : 'bg-yellow-50 border-yellow-100'
      }`}
    >
      <div className={`p-2 rounded-lg ${
        isCritical
          ? isDarkMode ? 'bg-red-950/80 text-red-300' : 'bg-red-100 text-syntix-red'
          : isDarkMode ? 'bg-amber-950/80 text-amber-300' : 'bg-yellow-100 text-yellow-600'
      }`}>
        <BellRing className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <h5 className={`font-bold ${isCritical ? (isDarkMode ? 'text-red-200' : 'text-red-900') : (isDarkMode ? 'text-amber-200' : 'text-yellow-900')}`}>
            {alert.mensaje}
          </h5>
          <span className={`text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap ${
            isCritical
              ? isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-200 text-red-800'
              : isDarkMode ? 'bg-amber-900 text-amber-200' : 'bg-yellow-200 text-yellow-800'
          }`}>
            {alert.prioridad === 'rojo' ? 'Critica' : 'Proxima'}
          </span>
        </div>
        <p className={`text-sm mt-1 ${isCritical ? (isDarkMode ? 'text-red-300' : 'text-red-700') : (isDarkMode ? 'text-amber-300' : 'text-yellow-700')}`}>
          <span className="font-semibold">{alert.tipo}:</span> {alert.entidad}
        </p>
        <p className={`text-xs mt-2 font-semibold ${isCritical ? (isDarkMode ? 'text-red-200' : 'text-red-800') : (isDarkMode ? 'text-amber-200' : 'text-yellow-800')}`}>
          {expirationText.fullText}
        </p>
      </div>
    </div>
  );
}
