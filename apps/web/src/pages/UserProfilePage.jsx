import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Building2, Car, Mail, Phone, ShieldCheck, TriangleAlert, Users, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useVehicles } from '@/hooks/useVehicles.js';
import { useConductors } from '@/hooks/useConductors.js';
import { useAlerts } from '@/hooks/useAlerts.js';
import ThemeToggle from '@/components/ThemeToggle.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';

// UserProfilePage concentra la entrada inicial al perfil sin mezclarla con la
// configuración global del sistema. La idea es mostrar identidad + resumen
// operativo y dejar una base clara para preferencias y seguridad en sprints siguientes.
export default function UserProfilePage() {
  const { user } = useAuth();
  const { vehiculos } = useVehicles();
  const { conductores } = useConductors();
  const { alerts } = useAlerts();
  const { isDarkMode } = useTheme();

  const stats = useMemo(
    () => [
      { label: 'Vehiculos registrados', value: vehiculos.length, icon: Car, tone: 'text-syntix-navy' },
      { label: 'Conductores activos', value: conductores.length, icon: Users, tone: 'text-syntix-green' },
      { label: 'Alertas pendientes', value: alerts.length, icon: TriangleAlert, tone: 'text-syntix-red' },
    ],
    [vehiculos.length, conductores.length, alerts.length]
  );

  const recentVehicles = useMemo(() => vehiculos.slice(-3).reverse(), [vehiculos]);
  const userInitial = useMemo(
    () => String(user?.empresa || user?.email || 'U').charAt(0).toUpperCase(),
    [user?.empresa, user?.email]
  );

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Perfil | SYNTIX Drive Control</title>
      </Helmet>

      <section className={`overflow-hidden rounded-3xl border shadow-sm ${
        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
      }`}>
        <div className={`flex flex-col gap-6 px-6 py-8 text-white lg:flex-row lg:items-center lg:justify-between ${
          isDarkMode ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800' : 'bg-gradient-to-r from-syntix-navy to-slate-800'
        }`}>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-bold">
              {userInitial}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Perfil de usuario</p>
              <h1 className="mt-2 text-3xl font-bold">{user?.empresa || 'Usuario autenticado'}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80">
                Aqui puedes revisar tu informacion principal y un resumen rapido de la flota asociada a tu cuenta.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <ThemeToggle compact label="Modo oscuro" />
            <Link to="/vehiculos" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-syntix-navy transition hover:bg-gray-100">
              Ver vehiculos
            </Link>
            <Link to="/configuracion" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
              Ir a configuracion
            </Link>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <ProfileField
                icon={Building2}
                label="Empresa"
                value={user?.empresa || 'Sin informacion registrada'}
                isDarkMode={isDarkMode}
              />
              <ProfileField
                icon={Mail}
                label="Correo"
                value={user?.email || 'Sin correo disponible'}
                isDarkMode={isDarkMode}
              />
              <ProfileField
                icon={Phone}
                label="Telefono"
                value={user?.telefono || 'Sin telefono disponible'}
                isDarkMode={isDarkMode}
              />
              <ProfileField
                icon={ShieldCheck}
                label="Rol"
                value={user?.role || 'Sin rol disponible'}
                isDarkMode={isDarkMode}
              />
            </div>

          <div className={`rounded-2xl border border-dashed p-5 ${
            isDarkMode ? 'border-slate-700 bg-slate-950/60' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <UserCircle2 className="h-5 w-5 text-syntix-navy" />
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>Estado del modulo</h2>
            </div>
            <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Esta es la primera version del perfil. Ya puedes guardar la preferencia de modo oscuro y en Sprint 13
              se pueden extender acciones sensibles como cambio de contrasena y cambio de correo con validaciones adicionales.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className={`rounded-2xl border p-5 shadow-sm ${
            isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{stat.label}</p>
                <p className={`mt-2 text-3xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.tone}`} />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <article className={`rounded-2xl border p-5 shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>Vehiculos recientes</h2>
            <Link to="/vehiculos" className="text-sm font-semibold text-syntix-navy hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {recentVehicles.length > 0 ? (
              recentVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 ${
                    isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{vehicle.placa}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {vehicle.marca} {vehicle.modelo} - {vehicle.tipo}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-gray-600'
                  }`}>
                    {vehicle.estadoGeneral || 'sin estado'}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState text="Todavia no hay vehiculos registrados para mostrar en tu perfil." isDarkMode={isDarkMode} />
            )}
          </div>
        </article>

        <article className={`rounded-2xl border p-5 shadow-sm ${
          isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
        }`}>
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>Siguientes mejoras</h2>
          <div className="mt-4 space-y-3">
            <FutureItem title="Preferencias avanzadas" text="Refinar colores, densidad visual y accesibilidad segun el perfil del usuario." isDarkMode={isDarkMode} />
            <FutureItem title="Cambio de contrasena" text="Agregar una accion segura para actualizar credenciales." isDarkMode={isDarkMode} />
            <FutureItem title="Cambio de correo" text="Soportar validacion y confirmacion del nuevo correo." isDarkMode={isDarkMode} />
          </div>
        </article>
      </section>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, isDarkMode }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
      isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-gray-100 bg-gray-50'
    }`}>
      <div className={`rounded-xl p-2 text-syntix-navy shadow-sm ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{label}</p>
        <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ text, isDarkMode }) {
  return (
    <div className={`rounded-2xl border border-dashed px-4 py-6 text-sm ${
      isDarkMode ? 'border-slate-700 bg-slate-950/60 text-slate-400' : 'border-gray-200 bg-gray-50 text-gray-500'
    }`}>
      {text}
    </div>
  );
}

function FutureItem({ title, text, isDarkMode }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${
      isDarkMode ? 'border-slate-800 bg-slate-950/70' : 'border-gray-100 bg-gray-50'
    }`}>
      <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{title}</p>
      <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{text}</p>
    </div>
  );
}
