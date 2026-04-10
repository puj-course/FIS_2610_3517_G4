import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Download, Eye, Trash2, Calendar } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import DetallesValidacionModal from '@/components/DetallesValidacionModal.jsx';
import { useValidationHistory } from '@/hooks/useValidationHistory.js';

export default function HistorialValidacionesPage() {
  const { validations, deleteValidation, getValidationHistory, exportToCSV, getStatistics } = useValidationHistory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('todos');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 20;

  // Filtrar validaciones
  const filteredValidations = useMemo(() => {
    let filtered = [...validations];

    // Filtro por búsqueda (placa)
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.placa.includes(searchTerm.toUpperCase())
      );
    }

    // Filtro por estado
    if (filterState !== 'todos') {
      filtered = filtered.filter(v => {
        const soatVigente = v.resultadoRUNT?.data?.soat?.vigente;
        const rtmVigente = v.resultadoRUNT?.data?.rtm?.vigente;
        
        if (filterState === 'vigentes') return soatVigente && rtmVigente;
        if (filterState === 'alertas') return !soatVigente || !rtmVigente;
        if (filterState === 'vencidos') return !soatVigente || !rtmVigente;
      });
    }

    // Filtro por rango de fechas
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start).getTime();
      const end = new Date(dateRange.end).getTime();
      
      filtered = filtered.filter(v => {
        const timestamp = new Date(v.timestamp).getTime();
        return timestamp >= start && timestamp <= end;
      });
    }

    return filtered;
  }, [validations, searchTerm, filterState, dateRange]);

  // Paginación
  const totalPages = Math.ceil(filteredValidations.length / itemsPerPage);
  const paginatedValidations = filteredValidations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => getStatistics(), [validations]);

  const handleViewDetails = (validation) => {
    setSelectedValidation(validation);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro que deseas eliminar esta validación?')) {
      deleteValidation(id);
    }
  };

  const handleDownloadCSV = () => {
    const csv = exportToCSV();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `historial-validaciones-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Historial de Validaciones | SYNTIX Drive Control</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-syntix-navy">Historial de Validaciones RUNT</h1>
        <button 
          onClick={handleDownloadCSV}
          disabled={filteredValidations.length === 0}
          className="bg-syntix-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-syntix-green/90 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total</p>
          <p className="text-3xl font-black text-syntix-navy">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">validaciones</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Esta Semana</p>
          <p className="text-3xl font-black text-syntix-green">{stats.thisWeek}</p>
          <p className="text-xs text-gray-500 mt-1">consultadas</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Con Alertas</p>
          <p className="text-3xl font-black text-syntix-red">{stats.withVencimientos}</p>
          <p className="text-xs text-gray-500 mt-1">vencidas</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Cumplimiento</p>
          <p className="text-3xl font-black text-syntix-green">{stats.compliancePercentage}%</p>
          <p className="text-xs text-gray-500 mt-1">vigentes</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por placa..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none"
            />
          </div>

          {/* Filtro Estado */}
          <select 
            value={filterState}
            onChange={(e) => {
              setFilterState(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-syntix-green outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="vigentes">Vigentes (Verde)</option>
            <option value="alertas">Con Alertas</option>
            <option value="vencidos">Vencidos (Rojo)</option>
          </select>

          {/* Fecha Inicio */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => {
                setDateRange({ ...dateRange, start: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none"
            />
          </div>

          {/* Fecha Fin */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => {
                setDateRange({ ...dateRange, end: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredValidations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 font-medium">No hay validaciones registradas</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Placa</th>
                    <th className="px-6 py-4">Fecha/Hora</th>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4 text-center">SOAT</th>
                    <th className="px-6 py-4 text-center">RTM</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedValidations.map((validation) => {
                    const soatVigente = validation.resultadoRUNT?.data?.soat?.vigente;
                    const rtmVigente = validation.resultadoRUNT?.data?.rtm?.vigente;
                    const soatState = soatVigente ? 'verde' : 'rojo';
                    const rtmState = rtmVigente ? 'verde' : 'rojo';

                    return (
                      <tr key={validation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{validation.placa}</td>
                        <td className="px-6 py-4 text-xs">
                          {new Date(validation.timestamp).toLocaleString('es-CO')}
                        </td>
                        <td className="px-6 py-4 text-sm">{validation.usuario}</td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={soatState} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={rtmState} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleViewDetails(validation)}
                            className="p-2 text-syntix-blue hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(validation.id)}
                            className="p-2 text-syntix-red hover:bg-red-50 rounded-lg transition-colors inline-flex"
                            title="Eliminar"
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

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                <p className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Detalles */}
      {selectedValidation && (
        <DetallesValidacionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          validation={selectedValidation}
          historialPlaca={getValidationHistory(selectedValidation.placa)}
          onDeleteValidation={handleDelete}
          onDownloadPDF={() => alert('Descarga PDF implementada en SUB-03.8')}
        />
      )}
    </div>
  );
}
