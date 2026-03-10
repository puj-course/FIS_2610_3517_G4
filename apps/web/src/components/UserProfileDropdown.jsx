import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, User } from 'lucide-react';

export default function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <div className="hidden md:block text-right">
          <p className="text-sm font-bold text-syntix-navy">{user.empresa}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <div className="w-10 h-10 bg-syntix-green text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
          {initial}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100 md:hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{user.empresa}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          
          <Link 
            to="/dashboard" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-syntix-navy transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          
          <Link 
            to="/ajustes-usuario" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-syntix-navy transition-colors"
          >
            <Settings className="w-4 h-4" /> Ajustes de Cuenta
          </Link>
          
          <div className="h-px bg-gray-100 my-1"></div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-syntix-red hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}