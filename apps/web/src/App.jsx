import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import DashboardLayout from '@/layouts/DashboardLayout.jsx';

import HomePage from '@/pages/HomePage.jsx';
import TeamPage from '@/pages/TeamPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';

import DashboardPage from '@/pages/DashboardPage.jsx';
import AlertasPage from '@/pages/AlertasPage.jsx';
import VehiculosPage from '@/pages/VehiculosPage.jsx';
import ConductoresPage from '@/pages/ConductoresPage.jsx';
import DocumentosPage from '@/pages/DocumentosPage.jsx';
import ValidacionRUNTPage from '@/pages/ValidacionRUNTPage.jsx';
import ReportesPage from '@/pages/ReportesPage.jsx';
import ConfiguracionPage from '@/pages/ConfiguracionPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehiculos"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <VehiculosPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/conductores"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ConductoresPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documentos"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DocumentosPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alertas"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AlertasPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/validacion-runt"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ValidacionRUNTPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ReportesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ConfiguracionPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
