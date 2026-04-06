import React from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { LogOut, Menu, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAlerts } from '@/hooks/useAlerts.js';

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { alerts } = useAlerts();
  
  const pathNames = location.pathname.split('/').filter(x => x);
  const currentPage = pathNames.length > 0 ? pathNames[pathNames.length - 1] : 'Dashboard';

  return (
    <header className="bg-syntix-navy text-white h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-md">
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
        <button className="p-2 text-gray-300 hover:bg-white/10 rounded-full relative">
          <Bell className="w-5 h-5" />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-syntix-red rounded-full border-2 border-syntix-navy"></span>
          )}
        </button>
        <div className="flex items-center gap-3 border-l pl-4 border-white/20">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white">{user?.empresa || 'Empresa'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <div className="w-8 h-8 bg-syntix-green text-white rounded-full flex items-center justify-center font-bold text-sm">
            <User className="w-4 h-4" />
          </div>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-syntix-red hover:bg-white/5 rounded-md transition-colors" title="Cerrar Sesión">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}