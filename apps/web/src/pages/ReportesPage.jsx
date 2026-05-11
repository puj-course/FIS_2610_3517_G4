import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { AlertTriangle, Car, Download, FileText, ShieldCheck, Users } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles.js';
import { useConductors } from '@/hooks/useConductors.js';
import { useDocuments } from '@/hooks/useDocuments.js';
import { useRtm } from '@/contexts/RtmContext.jsx';
import { useAlerts } from '@/hooks/useAlerts.js';
import { formatColombianDate, getExpirationAlertText } from '@/utils/dateUtils.js';

const statusLabels = {
  verde: 'Al dia',
  amarillo: 'Por vencer',
  rojo: 'Critico',
};

const progressWidth = (value, total) => (total > 0 ? `${Math.round((value / total) * 100)}%` : '0%');

const quoteCsv = (field) => `"${String(field ?? '').replaceAll('"', '""')}"`;

// ReportesPage traduce el estado real de la flota a metricas y exportables simples.
export default function ReportesPage() {
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

  const stateStats = useMemo(() => ({
    verde: vehiculos.filter((v) => v.estadoGeneral === 'verde').length,
    amarillo: vehiculos.filter((v) => v.estadoGeneral === 'amarillo').length,
    rojo: vehiculos.filter((v) => v.estadoGeneral === 'rojo').length,
    total: vehiculos.length,
  }), [vehiculos]);

  const alertStats = useMemo(() => ({
    soat: vehicleAlerts.filter((alert) => alert.grupo === 'SOAT').length,
    rtm: vehicleAlerts.filter((alert) => alert.grupo === 'RTM').length,
    licencias: conductorAlerts.filter((alert) => alert.grupo === 'Licencias').length,
  }), [vehicleAlerts, conductorAlerts]);

  const cumplimiento = stateStats.total > 0
    ? Math.round((stateStats.verde / stateStats.total) * 100)
    : 0;

  const handleExportCSV = () => {
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
        formatColombianDate(vehiculo.soat?.fechaVencimiento),
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-syntix-navy">Reportes y Analitica</h1>
          <p className="text-gray-500 text-sm mt-1">Metricas reales de cumplimiento de la flota</p>
        </div>
        <button onClick={handleExportCSV} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Descargar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <MetricCard icon={Car} label="Vehiculos" value={vehiculos.length} hint="Registrados" />
        <MetricCard icon={Users} label="Conductores" value={conductores.length} hint="Registrados" />
        <MetricCard icon={ShieldCheck} label="SOAT" value={soats.length} hint="Documentos" />
        <MetricCard icon={FileText} label="RTM" value={rtms.length} hint="Revisiones" />
        <MetricCard icon={AlertTriangle} label="Alertas" value={alerts.length} hint="Activas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-syntix-navy rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-syntix-green rounded-full opacity-20 blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Cumplimiento Total</h3>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black text-syntix-green">{cumplimiento}%</span>
            </div>
            <p className="mt-4 text-gray-400">Vehiculos al dia segun la Regla de Oro</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Distribucion de Estados</h3>
          <div className="space-y-4">
            <StatusBar label="Al Dia (Verde)" value={stateStats.verde} total={stateStats.total} colorClass="bg-syntix-green" textClass="text-syntix-green" />
            <StatusBar label="Por Vencer (Amarillo)" value={stateStats.amarillo} total={stateStats.total} colorClass="bg-yellow-500" textClass="text-yellow-500" />
            <StatusBar label="Critico (Rojo)" value={stateStats.rojo} total={stateStats.total} colorClass="bg-syntix-red" textClass="text-syntix-red" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportSection
          title={`Alertas de vehiculos (${vehicleAlerts.length})`}
          emptyMessage="No hay alertas de vehiculos para reportar."
          alerts={vehicleAlerts}
        />
        <ReportSection
          title={`Alertas de conductores (${conductorAlerts.length})`}
          emptyMessage="No hay alertas de conductores para reportar."
          alerts={conductorAlerts}
        />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen Documental</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DocumentSummary title="SOAT" total={soats.length} alerts={alertStats.soat} />
          <DocumentSummary title="RTM" total={rtms.length} alerts={alertStats.rtm} />
          <DocumentSummary title="Licencias" total={conductores.length} alerts={alertStats.licencias} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-black text-syntix-navy mt-1">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{hint}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50 text-syntix-navy">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBar({ label, value, total, colorClass, textClass }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-1">
        <span className={textClass}>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: progressWidth(value, total) }} />
      </div>
    </div>
  );
}

function ReportSection({ title, alerts, emptyMessage }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>

      {alerts.length === 0 ? (
        <div className="text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 p-4">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.slice(0, 6).map((alert) => {
            const expiration = getExpirationAlertText(alert.diasRestantes, alert.fechaVencimiento);

            return (
              <div key={alert.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">{alert.mensaje}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.tipo}: {alert.entidad}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md h-fit ${alert.prioridad === 'rojo' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {statusLabels[alert.prioridad] || alert.prioridad}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-semibold mt-2">{expiration.fullText}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocumentSummary({ title, total, alerts }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-black text-syntix-navy mt-1">{total}</p>
      <p className="text-xs text-gray-500 mt-1">
        {alerts} alertas activas
      </p>
    </div>
  );
}
