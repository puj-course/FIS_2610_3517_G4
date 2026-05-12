import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, Car, Download, FileText, ShieldCheck, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { useVehicles } from '@/hooks/useVehicles.js';
import { useConductors } from '@/hooks/useConductors.js';
import { useDocuments } from '@/hooks/useDocuments.js';
import { useRtm } from '@/contexts/RtmContext.jsx';
import { useAlerts } from '@/hooks/useAlerts.js';
import { formatColombianDate, getExpirationAlertText } from '@/utils/dateUtils.js';
import { buildQualityMetricsSummary } from '@/utils/qualityMetrics.js';

const statusLabels = {
  verde: 'Al dia',
  amarillo: 'Por vencer',
  rojo: 'Critico',
  neutral: 'Sin datos',
};

const progressWidth = (value, total) => (total > 0 ? `${Math.round((value / total) * 100)}%` : '0%');

const quoteCsv = (field) => `"${String(field ?? '').replaceAll('"', '""')}"`;

const qualityStatusStyles = {
  verde: {
    badge: 'bg-syntix-green/10 text-syntix-green border-syntix-green/20',
    value: 'text-syntix-green',
  },
  amarillo: {
    badge: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    value: 'text-yellow-600',
  },
  rojo: {
    badge: 'bg-syntix-red/10 text-syntix-red border-syntix-red/20',
    value: 'text-syntix-red',
  },
  neutral: {
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    value: 'text-gray-500',
  },
};

// ReportesPage traduce el estado real de la flota a metricas y exportables simples.
export default function ReportesPage() {
  const { isDarkMode } = useTheme();
  const { vehiculos } = useVehicles();
  const { conductores } = useConductors();
  const { soats } = useDocuments();
  const { rtms } = useRtm();
  const { alerts } = useAlerts();

  const vehicleAlerts = useMemo(
    () => alerts.filter((alert) => alert.categoria === 'vehiculos'),
    [alerts]
  );

  const conductorAlerts = useMemo(
    () => alerts.filter((alert) => alert.categoria === 'conductores'),
    [alerts]
  );

  const stateStats = useMemo(() => {
    const missingDocumentAlerts = alerts.filter((alert) => alert.tipo === 'Documento Faltante');
    const estadosDocumentales = [
      ...soats.map((soat) => soat.estado),
      ...rtms.map((rtm) => rtm.estado),
      ...conductores.map((conductor) => conductor.estado),
      ...missingDocumentAlerts.map((alert) => alert.prioridad),
    ].filter(Boolean);

    return {
      verde: estadosDocumentales.filter((estado) => estado === 'verde').length,
      amarillo: estadosDocumentales.filter((estado) => estado === 'amarillo').length,
      rojo: estadosDocumentales.filter((estado) => estado === 'rojo').length,
      total: estadosDocumentales.length,
    };
  }, [alerts, conductores, rtms, soats]);

  const alertStats = useMemo(() => ({
    soat: vehicleAlerts.filter((alert) => alert.grupo === 'SOAT').length,
    rtm: vehicleAlerts.filter((alert) => alert.grupo === 'RTM').length,
    licencias: conductorAlerts.filter((alert) => alert.grupo === 'Licencias').length,
  }), [vehicleAlerts, conductorAlerts]);

  const documentStats = useMemo(() => ({
    soat: {
      total: soats.length,
      vigente: soats.filter((soat) => soat.estado === 'verde').length,
      proximo: soats.filter((soat) => soat.estado === 'amarillo').length,
      vencido: soats.filter((soat) => soat.estado === 'rojo').length,
      faltantes: vehiculos.filter((vehiculo) => !vehiculo.soat).length,
    },
    rtm: {
      total: rtms.length,
      vigente: rtms.filter((rtm) => rtm.estado === 'verde').length,
      proximo: rtms.filter((rtm) => rtm.estado === 'amarillo').length,
      vencido: rtms.filter((rtm) => rtm.estado === 'rojo').length,
      faltantes: vehiculos.filter((vehiculo) => !vehiculo.rtm).length,
    },
  }), [rtms, soats, vehiculos]);

  const cumplimiento = vehiculos.length > 0
    ? Math.round((vehiculos.filter((vehiculo) => vehiculo.estadoGeneral === 'verde').length / vehiculos.length) * 100)
    : 0;

  const qualityMetrics = useMemo(() => buildQualityMetricsSummary({
    vehicles: vehiculos,
    conductors: conductores,
    soats,
    rtms,
    alerts,
  }), [alerts, conductores, rtms, soats, vehiculos]);

  const handleExportCSV = () => {
    // El CSV sale desde los datos ya visibles en la UI para que el exportable
    // coincida con la misma lectura operativa que ve el usuario en pantalla.
    const headers = [
      'Placa',
      'Marca/Modelo',
      'Tipo',
      'Conductor',
      'Estado SOAT',
      'Vencimiento SOAT',
      'Estado RTM',
      'Vencimiento RTM',
      'Estado Licencia',
      'Vencimiento Licencia',
      'Estado General',
    ];

    const rows = vehiculos.map((vehiculo) => {
      const conductorName = vehiculo.conductor?.nombre || 'Sin asignar';
      const soatStatus = vehiculo.soat?.estado || 'sin soat';
      const rtmStatus = vehiculo.rtm?.estado || 'sin rtm';
      const licenseStatus = vehiculo.conductor?.estado || 'sin conductor';

      return [
        vehiculo.placa,
        `${vehiculo.marca || ''} ${vehiculo.modelo || ''}`.trim(),
        vehiculo.tipo,
        conductorName,
        soatStatus.toUpperCase(),
        formatColombianDate(vehiculo.soat?.fechaFinVigencia || vehiculo.soat?.fechaVencimiento),
        rtmStatus.toUpperCase(),
        formatColombianDate(vehiculo.rtm?.fechaVencimiento),
        licenseStatus.toUpperCase(),
        formatColombianDate(vehiculo.conductor?.fechaVencimiento),
        (vehiculo.estadoGeneral || 'sin dato').toUpperCase(),
      ].map(quoteCsv).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Drive_Control_Reporte_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Reportes | SYNTIX Drive Control</title>
      </Helmet>

      <div data-onboarding="reports-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>Reportes y Analitica</h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Metricas reales de cumplimiento de la flota</p>
        </div>
        <button
          data-onboarding="reports-export"
          onClick={handleExportCSV}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
            isDarkMode
              ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Download className="w-4 h-4" /> Descargar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <MetricCard icon={Car} label="Vehiculos" value={vehiculos.length} hint="Registrados" isDarkMode={isDarkMode} />
        <MetricCard icon={Users} label="Conductores" value={conductores.length} hint="Registrados" isDarkMode={isDarkMode} />
        <MetricCard icon={ShieldCheck} label="SOAT" value={soats.length} hint="Documentos" isDarkMode={isDarkMode} />
        <MetricCard icon={FileText} label="RTM" value={rtms.length} hint="Revisiones" isDarkMode={isDarkMode} />
        <MetricCard icon={AlertTriangle} label="Alertas" value={alerts.length} hint="Activas" isDarkMode={isDarkMode} />
      </div>

      <section className="space-y-4">
        <div>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>Metricas de calidad del sistema</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {qualityMetrics.map((metric) => (
            renderQualityMetricCard(metric, isDarkMode)
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* La tarjeta de cumplimiento resume el panorama general y la de
            distribucion explica donde esta concentrado el riesgo documental. */}
        <div data-onboarding="reports-compliance-card" className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-lg ${
          isDarkMode ? 'bg-slate-900' : 'bg-syntix-navy'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-syntix-green rounded-full opacity-20 blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Cumplimiento Total</h3>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black text-syntix-green">{cumplimiento}%</span>
            </div>
            <p className="mt-4 text-gray-400">Vehiculos al dia segun la Regla de Oro, incluyendo documentos faltantes</p>
          </div>
        </div>

        <div data-onboarding="reports-distribution-card" className={`flex flex-col justify-center rounded-2xl border p-8 shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
        }`}>
          <h3 className={`mb-6 text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>Distribucion Documental</h3>
          <div className="space-y-4">
            <StatusBar label="Al Dia (Verde)" value={stateStats.verde} total={stateStats.total} colorClass="bg-syntix-green" textClass="text-syntix-green" isDarkMode={isDarkMode} />
            <StatusBar label="Por Vencer (Amarillo)" value={stateStats.amarillo} total={stateStats.total} colorClass="bg-yellow-500" textClass="text-yellow-500" isDarkMode={isDarkMode} />
            <StatusBar label="Critico (Rojo)" value={stateStats.rojo} total={stateStats.total} colorClass="bg-syntix-red" textClass="text-syntix-red" isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportSection
          title={`Alertas de vehiculos (${vehicleAlerts.length})`}
          emptyMessage="No hay alertas de vehiculos para reportar."
          alerts={vehicleAlerts}
          isDarkMode={isDarkMode}
        />
        <ReportSection
          title={`Alertas de conductores (${conductorAlerts.length})`}
          emptyMessage="No hay alertas de conductores para reportar."
          alerts={conductorAlerts}
          isDarkMode={isDarkMode}
        />
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${
        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
      }`}>
        <h3 className={`mb-4 text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>Resumen Documental</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DocumentSummary title="SOAT" stats={documentStats.soat} alerts={alertStats.soat} isDarkMode={isDarkMode} />
          <DocumentSummary title="RTM" stats={documentStats.rtm} alerts={alertStats.rtm} isDarkMode={isDarkMode} />
          <DocumentSummary title="Licencias" total={conductores.length} alerts={alertStats.licencias} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}

function renderQualityMetricCard(metric, isDarkMode) {
  const styles = qualityStatusStyles[metric.status] || qualityStatusStyles.neutral;
  const neutralBadge = isDarkMode && metric.status === 'neutral'
    ? 'bg-slate-800 text-slate-300 border-slate-700'
    : styles.badge;

  return (
    <div key={metric.id} className={`rounded-xl border p-5 shadow-sm ${
      isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{metric.name}</p>
          <p className={`mt-2 text-4xl font-black ${styles.value}`}>{metric.value}%</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${neutralBadge}`}>
          {statusLabels[metric.status] || metric.status}
        </span>
      </div>

      <p className={`mt-3 text-xs font-semibold ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Total evaluado: {metric.total}</p>

      <div className={`mt-4 space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
        <p>
          <span className={`block text-xs font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Interpretacion</span>
          {metric.interpretation}
        </p>
        <p>
          <span className={`block text-xs font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Impacto</span>
          {metric.impact}
        </p>
        <p>
          <span className={`block text-xs font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Accion de mejora</span>
          {metric.improvementAction}
        </p>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, hint, isDarkMode }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${
      isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{label}</p>
          <p className={`mt-1 text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>{value}</p>
          <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>{hint}</p>
        </div>
        <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-gray-50 text-syntix-navy'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBar({ label, value, total, colorClass, textClass, isDarkMode }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-1">
        <span className={textClass}>{label}</span>
        <span className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>{value}</span>
      </div>
      <div className={`h-2.5 w-full rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: progressWidth(value, total) }} />
      </div>
    </div>
  );
}

function ReportSection({ title, alerts, emptyMessage, isDarkMode }) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${
      isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
    }`}>
      <h3 className={`mb-4 text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{title}</h3>

      {alerts.length === 0 ? (
        <div className={`rounded-lg border border-dashed p-4 text-sm ${
          isDarkMode ? 'border-slate-700 bg-slate-950/60 text-slate-400' : 'border-gray-200 bg-gray-50 text-gray-500'
        }`}>
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.slice(0, 6).map((alert) => {
            const expiration = getExpirationAlertText(alert.diasRestantes, alert.fechaVencimiento);

            return (
              <div key={alert.id} className={`rounded-xl border p-4 ${
                isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-gray-100 bg-gray-50'
              }`}>
                <div className="flex justify-between gap-3">
                  <div>
                    <p className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{alert.mensaje}</p>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {alert.tipo}: {alert.entidad}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md h-fit ${alert.prioridad === 'rojo' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {statusLabels[alert.prioridad] || alert.prioridad}
                  </span>
                </div>
                <p className={`mt-2 text-xs font-semibold ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>{expiration.fullText}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocumentSummary({ title, total, alerts, stats = null, isDarkMode }) {
  const totalValue = stats?.total ?? total;

  return (
    <div className={`rounded-xl border p-4 ${
      isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-gray-100 bg-gray-50'
    }`}>
      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{title}</p>
      <p className={`mt-1 text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>{totalValue}</p>
      {stats && (
        <div className={`mt-3 grid grid-cols-2 gap-2 text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          <span>Vigentes: <strong>{stats.vigente}</strong></span>
          <span>Proximos: <strong>{stats.proximo}</strong></span>
          <span>Vencidos: <strong>{stats.vencido}</strong></span>
          <span>Sin registro: <strong>{stats.faltantes}</strong></span>
        </div>
      )}
      <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
        {alerts} alertas activas
      </p>
    </div>
  );
}
