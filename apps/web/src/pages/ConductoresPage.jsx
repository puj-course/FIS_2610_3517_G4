// apps/web/src/pages/ConductoresPage.jsx
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Plus, User, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import AddConductorModal from '@/components/AddConductorModal.jsx';
import { useConductors } from '@/hooks/useConductors.js';

export default function ConductoresPage() {
  const { conductores, deleteConductor } = useConductors();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConductorModalOpen, setIsConductorModalOpen] = useState(false);
  const [conductorToEdit, setConductorToEdit] = useState(null);

  const openCreateModal = () => {
    setConductorToEdit(null);
    setIsConductorModalOpen(true);
  };

  const openEditModal = (conductor) => {
    setConductorToEdit(conductor);
    setIsConductorModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsConductorModalOpen(false);
    setConductorToEdit(null);
  };

  const filtered = conductores.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.documento.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Conductores | SYNTIX Drive Control</title>
      </Helmet>

      {/* Header: apilable en mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-syntix-navy">Gestion de Conductores</h1>
        <button
          type="button"
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-syntix-navy text-white px-4 py-3 sm:py-2 rounded-lg text-sm font-medium hover:bg-syntix-navy/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Conductor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Barra de búsqueda: full width en mobile */}
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

        {/* Tabla con scroll interno horizontal */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-4">Conductor</th>
                {/* Ocultar columna Documento en pantallas muy pequeñas */}
                <th className="hidden sm:table-cell px-4 py-4">Documento</th>
                {/* Ocultar Contacto en mobile */}
                <th className="hidden md:table-cell px-4 py-4">Contacto</th>
                <th className="px-4 py-4">Licencia</th>
                <th className="px-4 py-4 text-center">Editar</th>
                <th className="px-4 py-4 text-right">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                    No se encontraron conductores.
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 shrink-0 bg-syntix-navy/5 rounded-full flex items-center justify-center text-syntix-navy">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900 truncate max-w-[120px] sm:max-w-none">
                      {c.nombre}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-4 font-medium">{c.documento}</td>
                  <td className="hidden md:table-cell px-4 py-4">{c.telefono}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-bold text-gray-500">Cat: {c.categoria}</span>
                      <StatusBadge status={c.estado} />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => openEditModal(c)}
                      className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-syntix-navy bg-syntix-navy/5 hover:bg-syntix-navy/10 rounded-lg transition-colors min-h-[36px]"
                      aria-label={`Editar conductor ${c.nombre}`}
                    >
                      Editar
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {/* Área táctil ampliada con p-3 */}
                    <button
                      type="button"
                      onClick={() => deleteConductor(c.id)}
                      className="p-3 text-gray-400 hover:text-syntix-red hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Eliminar conductor ${c.nombre}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddConductorModal
        isOpen={isConductorModalOpen}
        onClose={handleCloseModal}
        conductorToEdit={conductorToEdit}
      />
    </div>
  );
}