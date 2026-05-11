import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext.jsx';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import OnboardingTour from '@/components/OnboardingTour.jsx';
import Sidebar from '@/components/Sidebar.jsx';

// DashboardLayout mantiene la estructura compartida del backoffice:
// navegación lateral, cabecera fija y espacio central para cada módulo.
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isInteractionLocked } = useOnboarding();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <div
        aria-hidden={isInteractionLocked}
        className={isInteractionLocked ? 'pointer-events-none select-none' : ''}
      >
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      <div
        aria-hidden={isInteractionLocked}
        className={`flex-1 flex flex-col overflow-hidden ${isInteractionLocked ? 'pointer-events-none select-none' : ''}`}
      >
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <OnboardingTour />
    </div>
  );
}
