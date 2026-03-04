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
        <h1 className="text-2xl font-bold text-syntix-navy">Nuestro Equipo</h1>
        <p className="text-gray-600 mt-2">
          Página en construcción para Sprint 3 (navegación desde el header).
        </p>
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