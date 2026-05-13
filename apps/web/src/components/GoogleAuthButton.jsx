import React from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from '@react-oauth/google';

// La existencia del client ID decide si la app puede mostrar o no el botón federado.
const googleClientId = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

export default function GoogleAuthButton({ onSuccess, onError, disabled = false, text = 'continue_with' }) {
  // Si falta configuración, el botón desaparece por completo para no ofrecer un flujo roto.
  if (!googleClientId) {
    return null;
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
      <GoogleLogin
        // Google entrega un credentialResponse; aquí solo propagamos el JWT que usa backend.
        onSuccess={(credentialResponse) => onSuccess?.(credentialResponse?.credential || '')}
        // El consumidor decide cómo mostrar el error final en cada modal.
        onError={() => onError?.()}
        text={text}
        theme="outline"
        shape="rectangular"
        width="320"
      />
    </div>
  );
}

GoogleAuthButton.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  disabled: PropTypes.bool,
  text: PropTypes.string,
};
