import React from 'react';
import { Helmet } from 'react-helmet';
import { ShieldCheck, TrendingDown, Zap, FileCheck } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader.jsx';
import ModalFactory from '@/components/ModalFactory.jsx';
import useModalManager from '@/hooks/useModalManager.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { activeModal, openModal, closeModal } = useModalManager();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const openLogin = () => openModal('login');
  const openRegister = () => openModal('register');

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openRegister();
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>SYNTIX TECH | Drive Control</title>
      </Helmet>

      <PublicHeader onLoginClick={openLogin} onRegisterClick={openRegister} />

      {/* Hero Section - Modificada sin imagen */}
      <section id="inicio" className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden min-h-screen flex items-center bg-syntix-navy">
        {/* Decoración de fondo con círculos de luz en lugar de imagen */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(1,181,116,0.15)_0%,transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(1,181,116,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-syntix-green/20 text-syntix-green font-semibold text-sm mb-6 border border-syntix-green/30 backdrop-blur-sm">
              Gestión Inteligente de Flotas
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Blindaje Operativo para su Flota
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              Automatización del cumplimiento legal (SOAT, Tecno, Licencias) para evitar inmovilizaciones y multas. La regla de oro para su tranquilidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleCtaClick} className="bg-syntix-green text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-syntix-green/90 transition-all shadow-lg shadow-syntix-green/30 flex items-center justify-center gap-2">
                {isAuthenticated ? 'Ir al Dashboard' : 'Comenzar Ahora'} <Zap className="w-5 h-5" />
              </button>
              {!isAuthenticated && (
                <button onClick={openLogin} className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm">
                  Acceso Clientes
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-syntix-navy mb-4">¿Por qué elegir Drive Control?</h2>
            <p className="text-lg text-gray-600">Nuestra plataforma aplica la "Regla de Oro": el estado de su vehículo es tan bueno como su documento más próximo a vencer.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Automatización', desc: 'Cálculo automático de estados y alertas tempranas.', color: 'text-yellow-500', bg: 'bg-yellow-50' },
              { icon: ShieldCheck, title: 'Cumplimiento Legal', desc: 'Evite inmovilizaciones por documentos vencidos.', color: 'text-syntix-green', bg: 'bg-syntix-green/10' },
              { icon: TrendingDown, title: 'Reducción de Costos', desc: 'Minimice gastos en multas y patios.', color: 'text-syntix-red', bg: 'bg-syntix-red/10' },
              { icon: FileCheck, title: 'Eficiencia Operativa', desc: 'Toda la información centralizada y accesible.', color: 'text-blue-500', bg: 'bg-blue-50' }
            ].map((b, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-xl ${b.bg} flex items-center justify-center mb-6`}>
                  <b.icon className={`w-7 h-7 ${b.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
                <p className="text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-syntix-navy rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-syntix-green rounded-full opacity-20 blur-3xl"></div>
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 relative z-10">
              <span className="text-syntix-green">$7.1M COP</span> promedio por multa/patio evitada
            </h3>
            <p className="text-gray-300 text-lg relative z-10">El retorno de inversión de Drive Control es inmediato al prevenir una sola inmovilización.</p>
          </div>
        </div>
      </section>

      <ModalFactory
        modalType={activeModal}
        onClose={closeModal}
        onSwitchToRegister={openRegister}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
}