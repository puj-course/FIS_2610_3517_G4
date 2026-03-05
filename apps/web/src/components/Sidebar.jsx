import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Users, FileText, BellRing, Search, BarChart3, Settings, X } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts.js';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { alerts } = useAlerts();
  
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/vehiculos', icon: Car, label: 'Vehículos' },
    { path: '/conductores', icon: Users, label: 'Conductores' },
    { path: '/documentos', icon: FileText, label: 'Documentos' },
    { path: '/alertas', icon: BellRing, label: 'Alertas', badge: alerts.length },
    { path: '/validacion-runt', icon: Search, label: 'Validación RUNT' },
    { path: '/reportes', icon: BarChart3, label: 'Reportes' },
    { path: '/configuracion', icon: Settings, label: 'Configuración' },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-syntix-navy text-white">
          <div className="font-bold text-xl tracking-wider">
            SYNTIX <span className="text-syntix-green">TECH</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-1 hover:bg-white/10 rounded text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto bg-gray-50">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-syntix-green/10 text-syntix-green font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-syntix-navy'
                }`
              }
            >
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

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="text-xs text-gray-500 text-center font-medium">
            Drive Control v1.0
          </div>
        </div>
      </aside>
    </>
  );
}