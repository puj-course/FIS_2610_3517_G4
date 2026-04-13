import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'syntix_soats';
const DocumentsContext = createContext(null);

function calcularDiasRestantes(fechaVencimiento) {
  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);

  hoy.setHours(0, 0, 0, 0);
  vencimiento.setHours(0, 0, 0, 0);

  const diffMs = vencimiento - hoy;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function calcularEstado(diasRestantes) {
  if (diasRestantes < 0) return 'rojo';
  if (diasRestantes <= 30) return 'amarillo';
  return 'verde';
}

export function DocumentsProvider({ children }) {
  const [soats, setSoats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(soats));
  }, [soats]);

  const addSoat = (nuevoSoat) => {
    const diasRestantes = calcularDiasRestantes(nuevoSoat.fechaVencimiento);
    const estado = calcularEstado(diasRestantes);

    const soatConDatos = {
      id: Date.now().toString(),
      ...nuevoSoat,
      diasRestantes,
      estado,
    };

    setSoats((prev) => {
      const filtrados = prev.filter((s) => s.vehiculoId !== nuevoSoat.vehiculoId);
      return [...filtrados, soatConDatos];
    });
  };

  const removeSoat = (id) => {
    setSoats((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <DocumentsContext.Provider
      value={{
        soats,
        addSoat,
        removeSoat,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);

  if (!context) {
    throw new Error('useDocuments debe usarse dentro de DocumentsProvider');
  }

  return context;
}