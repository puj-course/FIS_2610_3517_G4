// apps/web/src/App.jsx
import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';

// Estructura y Seguridad
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute'; 

import { routesConfig } from './Routes/routesConfig'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {routesConfig.map((route) => {
            
            return (
              <Route 
                key={route.path} 
                path={route.path} 
                element={route.element} 
              />
            );
          })}

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;