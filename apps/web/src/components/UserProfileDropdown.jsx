import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';

// Dropdown del perfil pensado para no saturar la cabecera con acciones secundarias del usuario.
export default function UserProfileDropdown({ variant = 'light' }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Se cierra al hacer clic fuera para que el menú no quede abierto por accidente.
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  if (!user) return null;

  const initial = user.empresa ? user.empresa.charAt(0).toUpperCase() : 'U';
  const isDark = variant === 'dark';
  const triggerClassName = isDark
    ? 'flex items-center gap-3 rounded-full p-1.5 transition-colors focus:outline-none hover:bg-white/10'
    : 'flex items-center gap-3 rounded-full p-1.5 transition-colors focus:outline-none hover:bg-gray-100';
  const companyClassName = isDark ? 'text-sm font-bold text-white' : 'text-sm font-bold text-syntix-navy';
  const emailClassName = isDark ? 'text-xs text-gray-300' : 'text-xs text-gray-500';
  // El menú oscuro solo se aplica dentro del header autenticado cuando además
  // el modo oscuro está activo; así evitamos romper el header público.
  const useDarkMenu = isDark && isDarkMode;
  const menuClassName = useDarkMenu
    ? 'absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 py-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200'
    : 'absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200';
  const itemClassName = useDarkMenu
    ? 'flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 transition-colors hover:bg-slate-800 hover:text-white'
    : 'flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-syntix-navy';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClassName}
      >
        <div className="hidden md:block text-right">
          <p className={companyClassName}>{user.empresa}</p>
          <p className={emailClassName}>{user.email}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-syntix-green text-lg font-bold text-white shadow-sm">
          {initial}
        </div>
      </button>

      {isOpen && (
        <div className={menuClassName}>
          {/* Este bloque solo se muestra en móvil porque en desktop ya se ve
              empresa/correo al lado del avatar dentro del trigger. */}
          <div className={`border-b px-4 py-3 md:hidden ${useDarkMenu ? 'border-slate-800' : 'border-gray-100'}`}>
            <p className={`truncate text-sm font-bold ${useDarkMenu ? 'text-slate-100' : 'text-gray-900'}`}>{user.empresa}</p>
            <p className={`truncate text-xs ${useDarkMenu ? 'text-slate-400' : 'text-gray-500'}`}>{user.email}</p>
          </div>

          <Link 
            to="/perfil" 
            onClick={() => setIsOpen(false)}
            className={itemClassName}
          >
            <User className="w-4 h-4" /> Perfil
          </Link>
          
          <Link 
            to="/dashboard" 
            onClick={() => setIsOpen(false)}
            className={itemClassName}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          
          <Link 
            to="/configuracion" 
            onClick={() => setIsOpen(false)}
            className={itemClassName}
          >
            <Settings className="w-4 h-4" /> Configuracion
          </Link>
          
          <div className={`my-1 h-px ${useDarkMenu ? 'bg-slate-800' : 'bg-gray-100'}`}></div>
          
          <button 
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm text-syntix-red transition-colors ${
              useDarkMenu ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
            }`}
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

UserProfileDropdown.propTypes = {
  variant: PropTypes.oneOf(['light', 'dark']),
};
