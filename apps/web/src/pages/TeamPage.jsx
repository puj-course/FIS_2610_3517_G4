import React from 'react';
import { Helmet } from 'react-helmet';
import PublicHeader from '@/components/PublicHeader.jsx';
import ModalFactory from '@/components/ModalFactory.jsx';
import useModalManager from '@/hooks/useModalManager.js';

export default function TeamPage() {
  const { activeModal, openModal, closeModal } = useModalManager();

  const team = [
    { name: 'Sebastian Ramirez Maldonado', role: 'Scrum Master', desc: 'Facilitador del equipo, asegura que se sigan las prácticas ágiles y elimina impedimentos.' },
    { name: 'Samuel Freile', role: 'Configuration Manager', desc: 'Responsable de la gestión de versiones, entornos y control de cambios del proyecto.' },
    { name: 'Sebastian Rodriguez Ramirez', role: 'QA Lead', desc: 'Líder de aseguramiento de calidad, diseña y ejecuta estrategias de pruebas para garantizar la excelencia.' },
    { name: 'Solon Losada', role: 'DevOps Engineer', desc: 'Encargado de la integración y despliegue continuo, infraestructura y automatización de procesos.' },
    { name: 'Sebastian Vargas', role: 'Product Owner y Sprint Planner', desc: 'Define la visión del producto, prioriza el backlog y planifica los sprints para maximizar el valor.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-20">
      <Helmet>
        <title>Nuestro Equipo | SYNTIX TECH</title>
      </Helmet>

      <PublicHeader 
        onLoginClick={() => openModal('login')} 
        onRegisterClick={() => openModal('register')} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-syntix-navy mb-4">Conoce a Nuestro Equipo</h1>
          <p className="text-lg text-gray-600">
            El talento detrás de SYNTIX TECH. Un equipo multidisciplinario comprometido con la excelencia y la innovación en la gestión de flotas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
              <div className="w-20 h-20 bg-syntix-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 group-hover:bg-syntix-green transition-colors shadow-inner">
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm font-semibold text-syntix-green mb-3">{member.role}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <ModalFactory
        modalType={activeModal}
        onClose={closeModal}
        onSwitchToRegister={() => openModal('register')}
        onSwitchToLogin={() => openModal('login')}
      />
    </div>
  );
}