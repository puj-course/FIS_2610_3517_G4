import React from "react";

export default function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-extrabold text-2xl tracking-tight text-syntix-navy">
              SYNTIX <span className="text-syntix-green">TECH</span>
            </span>
          </div>
          
          {/* Menú */}
          <nav className="hidden md:flex space-x-8">
            <span className="text-gray-700 hover:text-syntix-green font-medium transition-colors cursor-pointer">Inicio</span>
            <span className="text-gray-700 hover:text-syntix-green font-medium transition-colors cursor-pointer">Beneficios</span>
            <span className="text-gray-700 hover:text-syntix-green font-medium transition-colors cursor-pointer">Nuestro Equipo</span>
            <span className="text-gray-700 hover:text-syntix-green font-medium transition-colors cursor-pointer">Servicios</span>
            <span className="text-gray-700 hover:text-syntix-green font-medium transition-colors cursor-pointer">Planes</span>
          </nav>

          {/* Botones */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-syntix-navy font-medium hover:text-syntix-green transition-colors">
              Iniciar Sesión
            </button>
            <button className="bg-syntix-navy text-white px-5 py-2.5 rounded-lg font-medium hover:bg-syntix-navy/90 transition-colors shadow-md shadow-syntix-navy/20">
              Registrarse
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
