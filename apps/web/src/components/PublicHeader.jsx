import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import UserProfileDropdown from './UserProfileDropdown.jsx';

export default function PublicHeader({ onLoginClick, onRegisterClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-extrabold text-2xl tracking-tight text-syntix-navy">
              SYNTIX <span className="text-syntix-green">TECH</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/#inicio" className="text-gray-700 hover:text-syntix-green font-medium transition-colors">Inicio</a>
            <a href="/#beneficios" className="text-gray-700 hover:text-syntix-green font-medium transition-colors">Beneficios</a>
            <Link to="/team" className="text-gray-700 hover:text-syntix-green font-medium transition-colors">Nuestro Equipo</Link>
            <a href="/#servicios" className="text-gray-700 hover:text-syntix-green font-medium transition-colors">Servicios</a>
            <Link to="/planes" className="text-gray-700 hover:text-syntix-green font-medium transition-colors">Planes</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <>
                <button onClick={onLoginClick} className="text-syntix-navy font-medium hover:text-syntix-green transition-colors">
                  Iniciar Sesión
                </button>
                <button onClick={onRegisterClick} className="bg-syntix-navy text-white px-5 py-2.5 rounded-lg font-medium hover:bg-syntix-navy/90 transition-colors shadow-md shadow-syntix-navy/20">
                  Registrarse
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg">
          <a href="/#inicio" className="block text-gray-700 font-medium py-2">Inicio</a>
          <a href="/#beneficios" className="block text-gray-700 font-medium py-2">Beneficios</a>
          <Link to="/team" className="block text-gray-700 font-medium py-2">Nuestro Equipo</Link>
          <a href="/#servicios" className="block text-gray-700 font-medium py-2">Servicios</a>
          
          <div className="pt-4 flex flex-col gap-3 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="flex justify-center py-2">
                <UserProfileDropdown />
              </div>
            ) : (
              <>
                <button onClick={onLoginClick} className="w-full border border-syntix-navy text-syntix-navy py-2 rounded-lg font-medium">
                  Iniciar Sesión
                </button>
                <button onClick={onRegisterClick} className="w-full bg-syntix-navy text-white py-2 rounded-lg font-medium">
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}