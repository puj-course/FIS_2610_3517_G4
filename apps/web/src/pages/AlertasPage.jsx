import React from 'react';
import { Helmet } from 'react-helmet';

export default function AlertasPage() {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Alertas | SYNTIX Drive Control</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-syntix-navy">Centro de Alertas</h1>
        <p className="text-gray-500 text-sm mt-1">
          Notificaciones automáticas basadas en la Regla de Oro
        </p>
      </div>
    </div>
  );
}