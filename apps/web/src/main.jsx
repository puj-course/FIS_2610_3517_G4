import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from '@/App';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';
import './index.css';

// Punto de arranque unico de React: aqui se monta toda la SPA sobre el nodo root.
const googleClientId = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* El tema envuelve siempre a la app para que el modo oscuro funcione
        incluso cuando la autenticacion externa de Google no este habilitada. */}
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </GoogleOAuthProvider>
    ) : (
      <ThemeProvider>
        <App />
      </ThemeProvider>
    )}
  </React.StrictMode>
);
