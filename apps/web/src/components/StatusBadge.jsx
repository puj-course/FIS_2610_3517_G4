import React from 'react';

export default function StatusBadge({ status, label }) {
  const colors = {
    verde: 'bg-syntix-green/10 text-syntix-green border-syntix-green/20',
    amarillo: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    rojo: 'bg-syntix-red/10 text-syntix-red border-syntix-red/20',
  };

  const defaultColor = 'bg-gray-100 text-gray-800 border-gray-200';
  const colorClass = colors[status?.toLowerCase()] || defaultColor;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      {label || status?.toUpperCase() || 'DESCONOCIDO'}
    </span>
  );
}