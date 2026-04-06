import React from 'react';
import LoginModal from '@/components/LoginModal.jsx';
import RegisterModal from '@/components/RegisterModal.jsx';
import AddVehicleModal from '@/components/AddVehicleModal.jsx';

/**
 * ModalFactory centraliza la renderización de modales según el tipo.
 *
 * Este patrón Factory Method ayuda a mantener un solo punto de control
 * para decidir qué modal se muestra y reduce duplicación de estado en páginas.
 */
export default function ModalFactory({ modalType, ...props }) {
  if (!modalType) return null;

  const commonProps = { isOpen: true, ...props };

  switch (modalType) {
    case 'login':
      return <LoginModal {...commonProps} />;
    case 'register':
      return <RegisterModal {...commonProps} />;
    case 'addVehicle':
      return <AddVehicleModal {...commonProps} />;
    default:
      return null;
  }
}
