import React from 'react';

export default class BaseModalFactory {
  canHandle() {
    return false;
  }

  createModal() {
    return null;
  }
}