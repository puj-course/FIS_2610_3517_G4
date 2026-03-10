<<<<<<< HEAD



import HomePage from '@/pages/HomePage.jsx';
import TeamPage from '@/pages/TeamPage.jsx';
import PlanesPage from "@/pages/PlanesPage.jsx";
=======
import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import DashboardLayout from '@/layouts/DashboardLayout.jsx';

// Solo importamos lo necesario para que no de errores de archivos faltantes
import HomePage from '@/pages/HomePage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* LA PORTADA: Esto es lo primero que se verá en localhost:3000 */}
          <Route path="/" element={<HomePage />} />

          {/* ÁREA INTERNA: Solo accesible vía /dashboard */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Si alguien se pierde, vuelve a la Portada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
>>>>>>> main
