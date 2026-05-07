import { useState } from 'react';

// Gestor simple para que las páginas hablen en términos de "modal activo" y no de múltiples booleans.
export default function useModalManager(initialModal = null) {
  const [activeModal, setActiveModal] = useState(initialModal);

  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);
  const isModalOpen = (modalType) => activeModal === modalType;

  return {
    activeModal,
    openModal,
    closeModal,
    isModalOpen,
  };
}
