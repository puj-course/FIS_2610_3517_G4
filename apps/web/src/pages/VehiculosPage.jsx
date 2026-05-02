// apps/web/src/pages/VehiculosPage.jsx
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Plus, Trash2, Car } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import AddVehicleModal from '@/components/AddVehicleModal.jsx';
import { useVehicles } from '@/hooks/useVehicles.js';

export default function VehiculosPage() {
  const { vehiculos, deleteVehicle } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('todos');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  const openCreateModal = () => {
    setVehicleToEdit(null);
    setIsVehicleModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVehicleModalOpen(false);
    setVehicleToEdit(null);
  };

  const filteredVehiculos = useMemo(() => {
    return vehiculos.filter((v) => {
      const matchesSearch = [v.placa, v.marca, v.modelo, v.ownerLabel]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesState = filterState === 'todos' || v.estadoGeneral === filterState;
      return matchesSearch && matchesState;
    });
  }, [vehiculos, searchTerm, filterState]);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Vehiculos | SYNTIX Drive Control</title>
      </Helmet>

      {/* Header: apilable en mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-syntix-navy">Gestion de Vehiculos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Consulta, registra y valida los vehiculos asociados al usuario dentro del sistema.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-syntix-navy text-white px-4 py-3 sm:py-2 rounded-lg text-sm font-medium hover:bg-syntix-navy/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Vehiculo
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filtros: apilables en mobile */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50/50">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por placa, marca, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none"
            />
          </div>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-syntix-green outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="verde">Al Dia (Verde)</option>
            <option value="amarillo">Por Vencer (Amarillo)</option>
            <option value="rojo">Critico (Rojo)</option>
          </select>
        </div>

        {/* Tabla con scroll interno horizontal */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-4 py-4">Placa</th>
                <th className="px-4 py-4">Vehiculo</th>
                {/* Ocultar "Usuario asociado" en mobile */}
                <th className="hidden lg:table-cell px-4 py-4">Usuario asociado</th>
                {/* Ocultar "Conductor" en mobile pequeño */}
                <th className="hidden md:table-cell px-4 py-4">Conductor</th>
                <th className="px-4 py-4">Estado</th>
                <th className="px-4 py-4 text-center">Editar</th>
                <th className="px-4 py-4 text-right">Eliminar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVehiculos.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-gray-900 whitespace-nowrap">
                    {v.placa}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900 whitespace-nowrap">
                      {v.marca} {v.modelo}
                    </div>
                    {/* Año/tipo solo visible en la celda en mobile (compacto) */}
                    <div className="text-xs text-gray-500">
                      {v.tipo}
                      <span className="hidden sm:inline"> - {v.anio}</span>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4">
                    <div className="font-medium text-gray-900 truncate max-w-[160px]">
                      {v.ownerLabel}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4">
                    {v.conductor ? (
                      <span className="font-medium text-gray-900">{v.conductor.nombre}</span>
                    ) : (
                      <span className="text-gray-400 italic">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={v.estadoGeneral} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => openEditModal(v)}
                      className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-syntix-navy bg-syntix-navy/5 hover:bg-syntix-navy/10 rounded-lg transition-colors min-h-[36px]"
                      aria-label={`Editar vehiculo ${v.placa}`}
                    >
                      Editar
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {/* Área táctil ampliada con p-3 */}
                    <button
                      type="button"
                      onClick={() => deleteVehicle(v.id)}
                      className="p-3 text-gray-400 hover:text-syntix-red hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Eliminar vehiculo ${v.placa}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredVehiculos.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Car className="w-8 h-8 text-gray-300" />
                      <div>
                        <p className="font-medium text-gray-700">Aun no hay vehiculos para mostrar.</p>
                        <p className="text-sm text-gray-500">
                          Agrega un vehiculo para comenzar a gestionar la flota.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddVehicleModal
        isOpen={isVehicleModalOpen}
        onClose={handleCloseModal}
        vehicleToEdit={vehicleToEdit}
      />
    </div>
  );
}