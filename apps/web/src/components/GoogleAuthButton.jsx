import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const googleClientId = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

export default function GoogleAuthButton({ onSuccess, onError, disabled = false, text = 'continue_with' }) {
  if (!googleClientId) {
    return null;
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
      <GoogleLogin
        onSuccess={(credentialResponse) => onSuccess?.(credentialResponse?.credential || '')}
        onError={() => onError?.()}
        text={text}
        theme="outline"
        shape="rectangular"
        width="320"
      />
    </div>
  );
}
