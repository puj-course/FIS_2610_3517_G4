import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';

// Estructura y Seguridad
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import DashboardLayout from '@/layouts/DashboardLayout.jsx';

// Páginas Públicas
import HomePage from '@/pages/HomePage.jsx';
import TeamPage from '@/pages/TeamPage.jsx';
import ValidacionRUNTPage from '@/pages/ValidacionRUNTPage.jsx';

// Páginas Privadas
import DashboardPage from '@/pages/DashboardPage.jsx';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />

          {/* 2. Rutas Privadas (Dashboard habilitado) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Aquí puedes agregar /vehiculos, /conductores, etc. en el futuro */}
          </Route>
          <Route path="/validacion-runt" element={<ValidacionRUNTPage />} />

          {/* 3. Redirección global: Si la URL no existe, vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;