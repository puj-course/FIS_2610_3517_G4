import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Plus, User, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import AddConductorModal from '@/components/AddConductorModal.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { useConductors } from '@/hooks/useConductors.js';
import { useVehicles } from '@/hooks/useVehicles.js';
import { getVehicleOptionLabel } from '@/utils/colombiaFormats.js';

const getConductorId = (conductor) => conductor?._id || conductor?.id;

const resolveAssignedVehicle = (conductor, vehiculos) => {
  const conductorVehicleId = conductor?.vehiculoId || conductor?.vehicleId;

  if (conductorVehicleId) {
    return vehiculos.find(
      (vehiculo) => String(conductorVehicleId) === String(vehiculo._id || vehiculo.id)
    ) || null;
  }

  const conductorId = getConductorId(conductor);
  if (!conductorId) return null;

  return vehiculos.find(
    (vehiculo) => String(vehiculo.conductorId) === String(conductorId)
  ) || null;
};

const hasVehicleReference = (conductor) =>
  Boolean(conductor?.vehiculoId || conductor?.vehicleId);

const getAssignedVehicleLabel = (conductor, vehiculos) => {
  const vehicle = resolveAssignedVehicle(conductor, vehiculos);

  if (vehicle) {
    return getVehicleOptionLabel(vehicle);
  }

  return hasVehicleReference(conductor) ? 'Vehículo no encontrado' : 'Sin vehículo asignado';
};

// Vista operativa para buscar, registrar y corregir conductores sin salir del dashboard.
export default function ConductoresPage() {
  const { conductores, deleteConductor } = useConductors();
  const { vehiculos } = useVehicles();
  const { isDarkMode } = useTheme();
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
    (c) => {
      // La búsqueda también contempla el vehículo asignado porque en operación
      // muchas veces se recuerda el conductor por la placa y no por el nombre.
      const query = searchTerm.toLowerCase();
      const assignedVehicleLabel = getAssignedVehicleLabel(c, vehiculos).toLowerCase();

      return (
        c.nombre.toLowerCase().includes(query) ||
        c.documento.includes(searchTerm) ||
        assignedVehicleLabel.includes(query)
      );
    }
  );

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Conductores | SYNTIX Drive Control</title>
      </Helmet>

      <div data-onboarding="conductors-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>Gestion de Conductores</h1>
        <button
          type="button"
          onClick={openCreateModal}
          data-onboarding="conductors-add-button"
          className="bg-syntix-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-syntix-navy/90 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Conductor
        </button>
      </div>

      <div className={`overflow-hidden rounded-2xl border shadow-sm ${
        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
      }`}>
        {/* La tabla mezcla datos del conductor y del vehículo asignado para
            resolver la trazabilidad sin tener que navegar entre módulos. */}
        <div className={`border-b p-4 ${isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-gray-100 bg-gray-50/50'}`}>
          <div data-onboarding="conductors-search" className="relative w-full sm:w-96">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg border py-2 pl-9 pr-4 text-sm outline-none focus:border-syntix-green focus:ring-2 focus:ring-syntix-green ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
          </div>
        </div>

        <div data-onboarding="conductors-table" className="overflow-x-auto">
          <table className={`w-full text-left text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            <thead className={`border-b font-semibold ${
              isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-300' : 'border-gray-200 bg-gray-50 text-gray-700'
            }`}>
              <tr>
                <th className="px-6 py-4">Conductor</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Licencia</th>
                <th className="px-6 py-4">Vehículo asignado</th>
                <th className="px-6 py-4 text-center">Editar</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? 'divide-y divide-slate-800' : 'divide-y divide-gray-100'}>
              {filtered.map((c) => {
                const assignedVehicleLabel = getAssignedVehicleLabel(c, vehiculos);

                return (
                  <tr key={c.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/70' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-syntix-navy/5 text-syntix-navy'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <span className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{c.nombre}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">{c.documento}</td>
                    <td className="px-6 py-4">{c.telefono}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Cat: {c.categoria}</span>
                        <StatusBadge status={c.estado} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`block max-w-[240px] truncate text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}
                        title={assignedVehicleLabel}
                      >
                        {assignedVehicleLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                      type="button"
                      onClick={() => openEditModal(c)}
                      className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isDarkMode
                          ? 'bg-syntix-green/10 text-syntix-green hover:bg-syntix-green/20'
                          : 'bg-syntix-navy/5 text-syntix-navy hover:bg-syntix-navy/10'
                      }`}
                      aria-label={`Editar conductor ${c.nombre}`}
                    >
                        Editar
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                      type="button"
                      onClick={() => deleteConductor(c.id)}
                      className={`rounded-lg p-2 transition-colors ${
                        isDarkMode
                          ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-300'
                          : 'text-gray-400 hover:bg-red-50 hover:text-syntix-red'
                      }`}
                      aria-label={`Eliminar conductor ${c.nombre}`}
                    >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
