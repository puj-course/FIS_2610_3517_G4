import React from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useOnboarding } from '@/contexts/OnboardingContext.jsx';
import { Menu, Bell, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAlerts } from '@/hooks/useAlerts.js';
import UserProfileDropdown from '@/components/UserProfileDropdown.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';

// Header muestra el contexto actual del dashboard y concentra acciones globales:
// navegación móvil, alertas activas y cierre de sesión.
export default function Header({ toggleSidebar }) {
  const { user } = useAuth();
  const { startTour } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();
  const { alerts } = useAlerts();
  const { isDarkMode } = useTheme();

  const alertCount = alerts.length;
  const hasActiveAlerts = alertCount > 0;
  const handleAlertsClick = () => navigate('/alertas');

  // El breadcrumb simple se deriva de la ruta activa para evitar títulos hardcodeados por vista.
  const pathNames = location.pathname.split('/').filter(x => x);
  const currentPage = pathNames.length > 0 ? pathNames[pathNames.length - 1] : 'Dashboard';

  return (
    <header className={`h-16 sticky top-0 z-30 flex items-center justify-between px-4 text-white shadow-md lg:px-8 ${
      isDarkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-syntix-navy'
    }`}>
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-300 hover:bg-white/10 rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-gray-300">
          <span>Drive Control</span>
          <span className="text-gray-500">/</span>
          <span className="text-white capitalize">{currentPage.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={startTour}
          className={`hidden md:inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
            isDarkMode
              ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
              : 'border-white/15 text-gray-200 hover:bg-white/10'
          }`}
          title="Abrir tutorial"
        >
          <Sparkles className="w-4 h-4" />
          Tutorial
        </button>
        <button
          onClick={handleAlertsClick}
          className={`relative rounded-full p-2 ${
            isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-300 hover:bg-white/10'
          }`}
          title="Ver alertas"
        >
          <Bell className="w-5 h-5" />
          {hasActiveAlerts && (
            <span className={`absolute top-1 right-1 h-2.5 w-2.5 rounded-full border-2 bg-syntix-red ${
              isDarkMode ? 'border-slate-900' : 'border-syntix-navy'
            }`}></span>
          )}
        </button>
        {user && (
          <div className={`border-l pl-4 ${isDarkMode ? 'border-slate-700' : 'border-white/20'}`}>
            <UserProfileDropdown variant="dark" />
          </div>
        )}
      </div>
    </header>
  );
}
