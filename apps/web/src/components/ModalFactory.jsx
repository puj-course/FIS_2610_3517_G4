import React from 'react';
import AuthModalFactory from '@/patterns/factory/AuthModalFactory.jsx';
import FleetModalFactory from '@/patterns/factory/FleetModalFactory.jsx';

export default function ModalFactory({ modalType, ...props }) {
  if (!modalType) return null;

  const commonProps = { isOpen: true, ...props };

  const factories = [
    new AuthModalFactory(),
    new FleetModalFactory(),
  ];

  const factory = factories.find((item) => item.canHandle(modalType));

  if (!factory) return null;

  return factory.createModal(modalType, commonProps);
}