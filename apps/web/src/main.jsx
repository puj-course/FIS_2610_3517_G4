import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import './index.css';

// Punto de arranque único de React: aquí se monta toda la SPA sobre el nodo root.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
