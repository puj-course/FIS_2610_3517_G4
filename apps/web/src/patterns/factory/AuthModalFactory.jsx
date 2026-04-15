import React from 'react';
import BaseModalFactory from './BaseModalFactory.jsx';
import LoginModal from '@/components/LoginModal.jsx';
import RegisterModal from '@/components/RegisterModal.jsx';

export default class AuthModalFactory extends BaseModalFactory {
  canHandle(modalType) {
    return modalType === 'login' || modalType === 'register';
  }

  createModal(modalType, props) {
    if (modalType === 'login') {
      return <LoginModal {...props} />;
    }

    if (modalType === 'register') {
      return <RegisterModal {...props} />;
    }

    return null;
  }
}