import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import DashboardLayout from '@/layouts/DashboardLayout.jsx';

import HomePage from '@/pages/HomePage.jsx';
import TeamPage from '@/pages/TeamPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Tu página de inicio y equipo (PÚBLICAS Y VISIBLES) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />

          {/* Redirección: Si intentan entrar a cualquier otra parte (como el dashboard), 
              los devuelve al inicio automáticamente. Así no rompes el diseño. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;