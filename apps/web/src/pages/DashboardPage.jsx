import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ModalFactory from '@/components/ModalFactory.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import useModalManager from '@/hooks/useModalManager.js';
import { useVehicles } from '@/hooks/useVehicles.js';
import { useConductors } from '@/hooks/useConductors.js';
import { useAlerts } from '@/hooks/useAlerts.js';

// DashboardPage prioriza lectura rápida: KPIs, accesos directos y señales recientes de la operación.
export default function DashboardPage() {
  const { vehiculos } = useVehicles();
  const { conductores } = useConductors();
  const { alerts } = useAlerts();
  const { isDarkMode } = useTheme();
  const { activeModal, openModal, closeModal } = useModalManager();

  // Las tarjetas superiores sintetizan el estado del sistema sin obligar a entrar a cada módulo.
  const stats = useMemo(
    () => [
      { label: 'Vehículos', value: vehiculos.length, hint: 'Registrados' },
      { label: 'Conductores', value: conductores.length, hint: 'Activos' },
      {
        label: 'Docs vencen pronto',
        value: alerts.filter((alert) => alert.prioridad === 'amarillo').length,
        hint: 'Alertas amarillas'
      },
      { label: 'Alertas', value: alerts.length, hint: 'Pendientes' },
    ],
    [vehiculos, conductores, alerts]
  );

  const recentVehicles = useMemo(() => vehiculos.slice(-3).reverse(), [vehiculos]);
  const openVehicleModal = () => openModal('addVehicle');
  // Estos colores viven en variables porque esta vista usa estilos inline y
  // necesitábamos adaptar el contraste al modo oscuro sin reescribirla completa.
  const pageTextColor = isDarkMode ? '#e2e8f0' : '#111827';
  const mutedTextColor = isDarkMode ? '#94a3b8' : '#555';
  const secondaryTextColor = isDarkMode ? '#64748b' : '#888';

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial', color: pageTextColor }}>
      <div
        data-onboarding="dashboard-summary"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 26, color: pageTextColor }}>Dashboard</h1>
          <p style={{ marginTop: 6, color: mutedTextColor }}>
            Resumen operativo de DriveControl con accesos rápidos para navegar y registrar vehículos.
          </p>
        </div>

        <div data-onboarding="dashboard-header-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/vehiculos" data-onboarding="dashboard-action-vehicles" style={btnSecondary(isDarkMode)}>
            Ir a Vehículos
          </Link>
          <button type="button" onClick={openVehicleModal} data-onboarding="dashboard-action-add-vehicle" style={btnPrimary(isDarkMode)}>
            + Vehículo
          </button> 
          <button
              type="button"
              onClick={() => openModal('addDocument')}
              data-onboarding="dashboard-action-add-soat"
              style={btnSecondary(isDarkMode)}
            >
              + SOAT
            </button>
          <button
              type="button"
              onClick={() => openModal('addRtm')}
              data-onboarding="dashboard-action-add-rtm"
              style={btnSecondary(isDarkMode)}
            >
              + RTM
            </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 18 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            data-onboarding={`dashboard-stat-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            style={card(isDarkMode)}
          >
            <div style={{ color: mutedTextColor, fontSize: 13 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6, color: pageTextColor }}>{s.value}</div>
            <div style={{ color: secondaryTextColor, fontSize: 12, marginTop: 4 }}>{s.hint}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12, marginTop: 14 }}>
        {/* Cada tarjeta usa helpers inline para mantener la compatibilidad con
            la implementación original del dashboard y aun así soportar dark mode. */}
        <div data-onboarding="dashboard-quick-actions" style={card(isDarkMode)}>
          <h2 style={h2(isDarkMode)}>Accesos rápidos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            <Link to="/vehiculos" data-onboarding="dashboard-quick-vehicles" style={quickLink(isDarkMode)}>Vehículos</Link>
            <Link to="/conductores" data-onboarding="dashboard-quick-conductores" style={quickLink(isDarkMode)}>Conductores</Link>
            <Link to="/documentos" data-onboarding="dashboard-quick-documentos" style={quickLink(isDarkMode)}>Documentos</Link>
            <Link to="/alertas" data-onboarding="dashboard-quick-alertas" style={quickLink(isDarkMode)}>Alertas</Link>
            <Link to="/validacion-runt" data-onboarding="dashboard-quick-runt" style={quickLink(isDarkMode)}>Validación RUNT</Link>
            <Link to="/reportes" data-onboarding="dashboard-quick-reportes" style={quickLink(isDarkMode)}>Reportes</Link>
          </div>
        </div>

        <div data-onboarding="dashboard-recent-vehicles" style={card(isDarkMode)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h2 style={h2(isDarkMode)}>Vehículos recientes</h2>
            <Link to="/vehiculos" style={smallLink(isDarkMode)}>Ver todos →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {recentVehicles.length > 0 ? (
              recentVehicles.map((vehicle) => (
                <div key={vehicle.id} style={alertRow(isDarkMode)}>
                  <span style={badge(vehicle.estadoGeneral === 'verde' ? 'Baja' : vehicle.estadoGeneral === 'amarillo' ? 'Media' : 'Alta')}>
                    {vehicle.placa}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, color: pageTextColor }}>{vehicle.marca} {vehicle.modelo}</div>
                    <div style={{ fontSize: 13, color: mutedTextColor, marginTop: 2 }}>
                      {vehicle.tipo}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: mutedTextColor, fontSize: 13, marginTop: 8 }}>
                No hay vehículos registrados todavía.
              </p>
            )}
          </div>
        </div>

        <div data-onboarding="dashboard-recent-alerts" style={card(isDarkMode)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h2 style={h2(isDarkMode)}>Alertas recientes</h2>
            <Link to="/alertas" style={smallLink(isDarkMode)}>Ver todas →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {alerts.slice(0, 3).map((a) => (
              <div key={a.id} style={alertRow(isDarkMode)}>
                <span style={badge(a.prioridad === 'rojo' ? 'Alta' : a.prioridad === 'amarillo' ? 'Media' : 'Baja')}>
                  {a.tipo}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: pageTextColor }}>{a.mensaje}</div>
                  <div style={{ fontSize: 13, color: mutedTextColor, marginTop: 2 }}>{a.entidad}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-onboarding="dashboard-doc-status" style={card(isDarkMode)}>
          <h2 style={h2(isDarkMode)}>Estado documental</h2>
          <p style={{ marginTop: 6, color: mutedTextColor, fontSize: 13 }}>
            Aquí puedes revisar el semáforo documental de los vehículos y entrar rápidamente al módulo correspondiente.
          </p>

          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={pill('#e8f5e9', '#2e7d32')}>OK</span>
            <span style={pill('#fff8e1', '#a15c00')}>Próximo</span>
            <span style={pill('#ffebee', '#b71c1c')}>Vencido</span>
          </div>

          <div data-onboarding="dashboard-doc-links" style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/documentos" style={btnSecondary(isDarkMode)}>Ir a Documentos</Link>
            <Link to="/vehiculos" style={btnSecondary(isDarkMode)}>Ir a Vehículos</Link>
          </div>
        </div>
      </div>

      <ModalFactory modalType={activeModal} onClose={closeModal} />
    </div>
  );
}

const card = (isDarkMode) => ({
  border: isDarkMode ? '1px solid #1e293b' : '1px solid #eee',
  borderRadius: 14,
  padding: 14,
  background: isDarkMode ? '#0f172a' : '#fff',
  boxShadow: isDarkMode ? '0 1px 8px rgba(0,0,0,0.18)' : '0 1px 8px rgba(0,0,0,0.04)',
});

// Los helpers siguientes encapsulan los estilos repetidos del dashboard para
// que el ajuste de tema oscuro no quede disperso en JSX difícil de mantener.
const h2 = (isDarkMode) => ({ margin: 0, fontSize: 16, color: isDarkMode ? '#f8fafc' : '#111827' });

const btnPrimary = (isDarkMode) => ({
  textDecoration: 'none',
  background: isDarkMode ? '#1f2937' : '#111',
  color: '#fff',
  padding: '10px 12px',
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 13,
  border: 'none',
  cursor: 'pointer',
});

const btnSecondary = (isDarkMode) => ({
  textDecoration: 'none',
  background: isDarkMode ? '#111827' : '#f3f4f6',
  color: isDarkMode ? '#e2e8f0' : '#111',
  padding: '10px 12px',
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 13,
  border: isDarkMode ? '1px solid #334155' : 'none',
});

const quickLink = (isDarkMode) => ({
  textDecoration: 'none',
  border: isDarkMode ? '1px solid #334155' : '1px solid #eee',
  borderRadius: 12,
  padding: '12px 10px',
  color: isDarkMode ? '#e2e8f0' : '#111',
  fontWeight: 600,
  fontSize: 13,
  background: isDarkMode ? '#020617' : '#fafafa',
  textAlign: 'center',
});

const smallLink = (isDarkMode) => ({
  textDecoration: 'none',
  color: isDarkMode ? '#f8fafc' : '#111',
  fontSize: 13,
  fontWeight: 600,
});

const alertRow = (isDarkMode) => ({
  display: 'grid',
  gridTemplateColumns: '64px 1fr',
  gap: 10,
  alignItems: 'start',
  padding: 10,
  border: isDarkMode ? '1px solid #1e293b' : '1px solid #eee',
  borderRadius: 12,
  background: isDarkMode ? '#020617' : '#fafafa',
});

function badge(level) {
  const map = {
    Alta: { bg: '#ffebee', fg: '#b71c1c' },
    Media: { bg: '#fff8e1', fg: '#a15c00' },
    Baja: { bg: '#e3f2fd', fg: '#0d47a1' },
  };
  const c = map[level] || { bg: '#eee', fg: '#111' };
  return {
    display: 'inline-block',
    background: c.bg,
    color: c.fg,
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    textAlign: 'center',
    width: 'fit-content',
  };
}

function pill(bg, fg) {
  return {
    background: bg,
    color: fg,
    borderRadius: 999,
    padding: '6px 10px',
    fontSize: 12,
    fontWeight: 700,
    border: '1px solid rgba(0,0,0,0.06)',
  };
}
