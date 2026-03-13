import React, { useMemo } from "react";
import DataPanel from '@/components/DataPanel.jsx';
import { Link } from "react-router-dom";

export default function DashboardPage() {
  // Datos demo (puedes conectar luego a LocalStorage / backend)
  const stats = useMemo(
    () => [
      { label: "Vehículos", value: 12, hint: "Registrados" },
      { label: "Conductores", value: 8, hint: "Activos" },
      { label: "Docs vencen pronto", value: 3, hint: "SOAT / Tecno" },
      { label: "Alertas", value: 5, hint: "Pendientes" },
    ],
    []
  );

  const alerts = useMemo(
    () => [
      { level: "Alta", title: "SOAT vence en 3 días", desc: "Vehículo: ABC-123" },
      { level: "Media", title: "Tecnomecánica vence en 12 días", desc: "Vehículo: XYZ-987" },
      { level: "Baja", title: "Actualizar datos conductor", desc: "Conductor: Juan Pérez" },
    ],
    []
  );

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26 }}>Dashboard</h1>
          <p style={{ marginTop: 6, color: "#555" }}>
            Resumen operativo de DriveControl (documentos, alertas y accesos rápidos).
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/vehiculos" style={btnPrimary}>
            + Vehículo
          </Link>
          <Link to="/documentos" style={btnSecondary}>
            + Documento
          </Link>
        </div>
      </div>
      <DataPanel />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 18 }}>
        {stats.map((s) => (
          <div key={s.label} style={card}>
            <div style={{ color: "#666", fontSize: 13 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{s.value}</div>
            <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{s.hint}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12, marginTop: 14 }}>
        {/* Accesos rápidos */}
        <div style={card}>
          <h2 style={h2}>Accesos rápidos</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            <Link to="/vehiculos" style={quickLink}>Vehículos</Link>
            <Link to="/conductores" style={quickLink}>Conductores</Link>
            <Link to="/documentos" style={quickLink}>Documentos</Link>
            <Link to="/alertas" style={quickLink}>Alertas</Link>
            <Link to="/validacion-runt" style={quickLink}>Validación RUNT</Link>
            <Link to="/reportes" style={quickLink}>Reportes</Link>
          </div>
        </div>

        {/* Alertas */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h2 style={h2}>Alertas recientes</h2>
            <Link to="/alertas" style={smallLink}>Ver todas →</Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {alerts.map((a, idx) => (
              <div key={idx} style={alertRow}>
                <span style={badge(a.level)}>{a.level}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estado documental */}
        <div style={card}>
          <h2 style={h2}>Estado documental</h2>
          <p style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
            Aquí puedes mostrar SOAT/Tecnomecánica por vehículo con semáforo (OK / Próximo / Vencido).
          </p>

          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={pill("#e8f5e9", "#2e7d32")}>OK</span>
            <span style={pill("#fff8e1", "#a15c00")}>Próximo</span>
            <span style={pill("#ffebee", "#b71c1c")}>Vencido</span>
          </div>

          <div style={{ marginTop: 12 }}>
            <Link to="/documentos" style={btnSecondary}>Ir a Documentos</Link>
          </div>
        </div>

        {/* Configuración */}
        <div style={card}>
          <h2 style={h2}>Configuración</h2>
          <p style={{ marginTop: 6, color: "#666", fontSize: 13 }}>
            Ajusta preferencias, usuario y parámetros de alertas.
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <Link to="/configuracion" style={btnSecondary}>Configuración</Link>
            <Link to="/ajustes-usuario" style={btnSecondary}>Ajustes usuario</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- styles (inline, para que funcione aunque Tailwind no esté listo) ---------- */
const card = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 14,
  background: "#fff",
  boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
};

const h2 = { margin: 0, fontSize: 16 };

const btnPrimary = {
  textDecoration: "none",
  background: "#111",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 13,
};

const btnSecondary = {
  textDecoration: "none",
  background: "#f3f4f6",
  color: "#111",
  padding: "10px 12px",
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 13,
};

const quickLink = {
  textDecoration: "none",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: "12px 10px",
  color: "#111",
  fontWeight: 600,
  fontSize: 13,
  background: "#fafafa",
  textAlign: "center",
};

const smallLink = {
  textDecoration: "none",
  color: "#111",
  fontSize: 13,
  fontWeight: 600,
};

const alertRow = {
  display: "grid",
  gridTemplateColumns: "64px 1fr",
  gap: 10,
  alignItems: "start",
  padding: 10,
  border: "1px solid #eee",
  borderRadius: 12,
  background: "#fafafa",
};

function badge(level) {
  const map = {
    Alta: { bg: "#ffebee", fg: "#b71c1c" },
    Media: { bg: "#fff8e1", fg: "#a15c00" },
    Baja: { bg: "#e3f2fd", fg: "#0d47a1" },
  };
  const c = map[level] || { bg: "#eee", fg: "#111" };
  return {
    display: "inline-block",
    background: c.bg,
    color: c.fg,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
    width: "fit-content",
  };
}

function pill(bg, fg) {
  return {
    background: bg,
    color: fg,
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid rgba(0,0,0,0.06)",
  };
}