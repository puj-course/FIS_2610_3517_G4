// apps/web/src/App.jsx
import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
<<<<<<< HEAD

// Estructura y Seguridad
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute'; 

import { routesConfig } from './Routes/routesConfig'; 

=======
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import DashboardLayout from '@/layouts/DashboardLayout.jsx';

import HomePage from '@/pages/HomePage.jsx';
import TeamPage from '@/pages/TeamPage.jsx';

import DashboardPage from '@/pages/DashboardPage.jsx';
import AlertasPage from '@/pages/AlertasPage.jsx';
import VehiculosPage from '@/pages/VehiculosPage.jsx';
import ConductoresPage from '@/pages/ConductoresPage.jsx';
import DocumentosPage from '@/pages/DocumentosPage.jsx';
import ValidacionRUNTPage from '@/pages/ValidacionRUNTPage.jsx';
import ReportesPage from '@/pages/ReportesPage.jsx';
import ConfiguracionPage from '@/pages/ConfiguracionPage.jsx';
>>>>>>> origin/develop

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
<<<<<<< HEAD
          
          {routesConfig.map((route) => {
            
            const elementToRender = route.protected ? (
              <ProtectedRoute>
                <DashboardLayout>
                  {route.element}
                </DashboardLayout>
              </ProtectedRoute>
            ) : (
              route.element
            );

            return (
              <Route 
                key={route.path} 
                path={route.path} 
                element={elementToRender} 
              />
            );
          })}
=======
          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />

          {/* Protegidas */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/vehiculos" element={<VehiculosPage />} />
            <Route path="/conductores" element={<ConductoresPage />} />
            <Route path="/documentos" element={<DocumentosPage />} />
            <Route path="/alertas" element={<AlertasPage />} />
            <Route path="/validacion-runt" element={<ValidacionRUNTPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
          </Route>
>>>>>>> origin/develop

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;