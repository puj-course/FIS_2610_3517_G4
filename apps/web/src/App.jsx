import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import DashboardLayout from '@/layouts/DashboardLayout.jsx';
import { DocumentsProvider } from '@/contexts/DocumentsContext.jsx';
import { RtmProvider } from '@/contexts/RtmContext.jsx';

import HomePage from '@/pages/HomePage.jsx';
import TeamPage from '@/pages/TeamPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import PlanesPage from '@/pages/PlanesPage.jsx'; // Importación agregada

import DashboardPage from '@/pages/DashboardPage.jsx';
import AlertasPage from '@/pages/AlertasPage.jsx';
import VehiculosPage from '@/pages/VehiculosPage.jsx';
import ConductoresPage from '@/pages/ConductoresPage.jsx';
import DocumentosPage from '@/pages/DocumentosPage.jsx';
import ValidacionRUNTPage from '@/pages/ValidacionRUNTPage.jsx';
import HistorialValidacionesPage from '@/pages/HistorialValidacionesPage.jsx';
import ReportesPage from '@/pages/ReportesPage.jsx';
import ConfiguracionPage from '@/pages/ConfiguracionPage.jsx';

function App() {
  return (
    <AuthProvider>
      <DocumentsProvider>
        <RtmProvider>
        <Router>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/planes" element={<PlanesPage />} /> {/* Ruta agregada */}

            {/* Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/vehiculos" element={<VehiculosPage />} />
                <Route path="/conductores" element={<ConductoresPage />} />
                <Route path="/documentos" element={<DocumentosPage />} />
                <Route path="/alertas" element={<AlertasPage />} />
                <Route path="/validacion-runt" element={<ValidacionRUNTPage />} />
                <Route path="/historial-validaciones" element={<HistorialValidacionesPage />} />
                <Route path="/reportes" element={<ReportesPage />} />
                <Route path="/configuracion" element={<ConfiguracionPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </RtmProvider>
      </DocumentsProvider>
    </AuthProvider>
  );
}

export default App;