import { useState } from 'react';

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
