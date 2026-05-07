import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from '@/App';
import './index.css';

// Punto de arranque único de React: aquí se monta toda la SPA sobre el nodo root.
const googleClientId = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
)
