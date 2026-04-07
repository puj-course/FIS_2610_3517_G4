import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';

// Estructura y Seguridad
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';


import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';


import DashboardPage from './pages/DashboardPage';
//import ValidacionRUNTPage from "./pages/validacionRunt.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />

          {/* 2. Rutas Privadas */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          
          

          {/* 4. Redirección global */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;