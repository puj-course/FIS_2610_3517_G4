import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Car, Users, FileText, BellRing, Search, BarChart3, Settings, User, X } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts.js';
import { useTheme } from '@/contexts/ThemeContext.jsx';

// Sidebar concentra los módulos del backoffice y refleja cuántas alertas siguen activas.
export default function Sidebar({ isOpen, toggleSidebar }) {
  const { totalAlerts } = useAlerts();
  const { isDarkMode } = useTheme();

  // Perfil quedó primero para reforzar que es la nueva puerta de entrada del usuario
  // a sus preferencias y datos de cuenta.
  const navItems = [
    { path: '/perfil', icon: User, label: 'Perfil' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/vehiculos', icon: Car, label: 'Vehículos' },
    { path: '/conductores', icon: Users, label: 'Conductores' },
    { path: '/documentos', icon: FileText, label: 'Documentos' },
    { path: '/alertas', icon: BellRing, label: 'Alertas', badge: totalAlerts },
    { path: '/validacion-runt', icon: Search, label: 'Validación RUNT' },
    { path: '/reportes', icon: BarChart3, label: 'Reportes' },
    { path: '/configuracion', icon: Settings, label: 'Configuración' },
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Cerrar menu lateral"
        />
      )}

      <aside
          data-onboarding="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r transition-transform duration-200 ease-in-out lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-gray-200 bg-white'}`}
      >
        <div className={`flex h-16 items-center justify-between border-b px-6 text-white ${
            isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-gray-100 bg-syntix-navy'
          }`}>
          <Link to="/" className="font-bold text-xl tracking-wider hover:opacity-80 transition-opacity cursor-pointer">
            SYNTIX <span className="text-syntix-green">TECH</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 hover:bg-white/10 rounded text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className={`flex-1 space-y-1 overflow-y-auto px-3 py-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-syntix-green/15 text-syntix-green font-semibold'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-syntix-navy'
                }`
              }
            >
              {/* Se separa badge de alerta del contenido para que solo ese módulo
                  muestre señal visual cuando existan pendientes activos. */}
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>

              {item.badge > 0 && (
                <span className="bg-syntix-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={`border-t p-4 ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-gray-200 bg-white'}`}>
          <div className={`text-center text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Drive Control v1.0
          </div>
        </div>
      </aside>
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};
