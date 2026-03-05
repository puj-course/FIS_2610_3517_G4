import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';

// Estructura y Seguridad
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import DashboardLayout from '@/layouts/DashboardLayout.jsx';

// Páginas (Las dos principales)
import HomePage from '@/pages/HomePage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. HomePage: La que acabas de pasar */}
          <Route path="/" element={<HomePage />} />

          {/* 2. Rutas Privadas: DashboardLayout con el Dashboard adentro */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Si necesitas más rutas como /vehiculos, agrégalas aquí debajo */}
          </Route>

          {/* 3. Redirección global */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;