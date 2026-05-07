
import HomePage from "../pages/HomePage";
import TeamPage from "../pages/TeamPage";
import DashboardPage from "../pages/DashboardPage";
import VehiculosPage from "../pages/VehiculosPage";
import ConductoresPage from "../pages/ConductoresPage";

// Contrato liviano de rutas para pantallas que solo necesitan saber el destino y su protección.
export const routesConfig = [
  { path: "/", element: <HomePage />, protected: false },
  { path: "/team", element: <TeamPage />, protected: false },
  { path: "/dashboard", element: <DashboardPage />, protected: true },
  { path: "/vehiculos", element: <VehiculosPage />, protected: true },
  { path: "/conductores", element: <ConductoresPage />, protected: true },
];
