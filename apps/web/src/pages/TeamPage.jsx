import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PublicHeader from '@/components/PublicHeader.jsx';
import LoginModal from '@/components/LoginModal.jsx';
import RegisterModal from '@/components/RegisterModal.jsx';

export default function TeamPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-20">
      <Helmet>
        <title>Nuestro Equipo | SYNTIX TECH</title>
      </Helmet>

      <PublicHeader
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-syntix-navy mb-4">
            Conoce a Nuestro Equipo
          </h1>
          <p className="text-lg text-gray-600">
            El talento detrás de SYNTIX TECH. Un equipo multidisciplinario comprometido con la excelencia
            y la innovación en la gestión de flotas.
          </p>
        </div>

        <div className="text-center text-gray-500">
          (Cards de integrantes se agregan en la siguiente tarea del sprint)
        </div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
}