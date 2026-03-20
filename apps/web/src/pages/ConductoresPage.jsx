import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Plus, User, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import { useConductors } from '@/hooks/useConductors.js';

export default function ConductoresPage() {
  const { conductores, deleteConductor } = useConductors();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = conductores.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.documento.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Conductores | SYNTIX Drive Control</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-syntix-navy">Gestión de Conductores</h1>
        <button className="bg-syntix-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-syntix-navy/90 transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Conductor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o documento..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Conductor</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Licencia</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-syntix-navy/5 rounded-full flex items-center justify-center text-syntix-navy">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">{c.nombre}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">{c.documento}</td>
                  <td className="px-6 py-4">{c.telefono}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-bold text-gray-500">Cat: {c.categoria}</span>
                      <StatusBadge status={c.estado} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteConductor(c.id)} className="p-2 text-gray-400 hover:text-syntix-red hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}