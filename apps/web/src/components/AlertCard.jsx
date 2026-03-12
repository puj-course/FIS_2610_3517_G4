import React from 'react';
import { AlertTriangle, Info, XCircle } from 'lucide-react';

export default function AlertCard({ title, description, type = 'warning', date }) {
  const styles = {
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    danger: 'border-syntix-red/30 bg-red-50 text-syntix-red',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  };

  const icons = {
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    danger: <XCircle className="w-5 h-5 text-syntix-red" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[type]} flex items-start gap-3 shadow-sm`}>
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-sm mt-1 opacity-90">{description}</p>
        {date && <p className="text-xs mt-2 opacity-70 font-medium">{date}</p>}
      </div>
    </div>
  );
}