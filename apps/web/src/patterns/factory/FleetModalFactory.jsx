import React from 'react';
import BaseModalFactory from './BaseModalFactory.jsx';
import AddVehicleModal from '@/components/AddVehicleModal.jsx';
import AddDocumentModal from '@/components/AddDocumentModal.jsx';
import AddConductorModal from '@/components/AddConductorModal.jsx';
import AddRtmModal from '@/components/AddRtmModal.jsx';

export default class FleetModalFactory extends BaseModalFactory {
  canHandle(modalType) {
    return (
      modalType === 'addVehicle' ||
      modalType === 'addDocument' ||
      modalType === 'addConductor' ||
      modalType === 'addRtm'
    );
  }

  createModal(modalType, props) {
    if (modalType === 'addVehicle') {
      return <AddVehicleModal {...props} />;
    }

    if (modalType === 'addDocument') {
      return <AddDocumentModal {...props} />;
    }

    if (modalType === 'addConductor') {
      return <AddConductorModal {...props} />;
    }

    if (modalType === 'addRtm') {
      return <AddRtmModal {...props} />;
    }

    return null;
  }
}