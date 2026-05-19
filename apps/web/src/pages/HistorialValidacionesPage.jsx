import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Download, Eye, Trash2, Calendar } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge.jsx';
import DetallesValidacionModal from '@/components/DetallesValidacionModal.jsx';
import { useValidationHistory } from '@/hooks/useValidationHistory.js';
import { useTheme } from '@/contexts/ThemeContext.jsx';

// HistorialValidacionesPage funciona como bitácora de auditoría para consultas RUNT ya realizadas.
export default function HistorialValidacionesPage() {
  const { validations, deleteValidation, getValidationHistory, exportToCSV, getStatistics } = useValidationHistory();
  const { isDarkMode } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('todos');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 20;

  // Los filtros se aplican antes de paginar para que la navegación siempre refleje el subconjunto activo.
  const filteredValidations = useMemo(() => {
    let filtered = [...validations];

    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.placa.includes(searchTerm.toUpperCase())
      );
    }

    if (filterState !== 'todos') {
      filtered = filtered.filter(v => {
        const soatVigente = v.resultadoRUNT?.data?.soat?.vigente;
        const rtmVigente = v.resultadoRUNT?.data?.rtm?.vigente;

        if (filterState === 'vigentes') return soatVigente && rtmVigente;
        if (filterState === 'alertas') return !soatVigente || !rtmVigente;
        if (filterState === 'vencidos') return !soatVigente || !rtmVigente;
      });
    }

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

  // La paginación mantiene liviana la tabla aunque el historial siga creciendo.
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

  const inputCls = `w-full rounded-lg border py-2 text-sm outline-none focus:ring-2 focus:ring-syntix-green focus:border-syntix-green ${
    isDarkMode
      ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500'
      : 'border-gray-300 bg-white text-gray-900'
  }`;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Historial de Validaciones | SYNTIX Drive Control</title>
      </Helmet>

      {/* Header */}
      <div data-onboarding="runt-history-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>
            Historial de Validaciones RUNT
          </h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Consulta y audita las validaciones realizadas sobre la flota.
          </p>
        </div>
        <button
          data-onboarding="runt-history-export"
          onClick={handleDownloadCSV}
          disabled={filteredValidations.length === 0}
          className="bg-syntix-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-syntix-green/90 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* Estadísticas */}
      <div data-onboarding="runt-history-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-lg border p-4 text-center ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
          <p className={`text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Total</p>
          <p className={`text-3xl font-black ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>{stats.total}</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>validaciones</p>
        </div>
        <div className={`rounded-lg border p-4 text-center ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
          <p className={`text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Esta Semana</p>
          <p className="text-3xl font-black text-syntix-green">{stats.thisWeek}</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>consultadas</p>
        </div>
        <div className={`rounded-lg border p-4 text-center ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
          <p className={`text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Con Alertas</p>
          <p className="text-3xl font-black text-syntix-red">{stats.withVencimientos}</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>vencidas</p>
        </div>
        <div className={`rounded-lg border p-4 text-center ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
          <p className={`text-xs font-bold uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Cumplimiento</p>
          <p className="text-3xl font-black text-syntix-green">{stats.compliancePercentage}%</p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>vigentes</p>
        </div>
      </div>

      {/* Filtros */}
      <div data-onboarding="runt-history-filters" className={`rounded-xl shadow-sm border p-4 space-y-4 ${
        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Buscar por placa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`${inputCls} pl-9 pr-4`}
            />
          </div>

          {/* Filtro Estado */}
          <select
            value={filterState}
            onChange={(e) => {
              setFilterState(e.target.value);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border outline-none focus:ring-2 focus:ring-syntix-green ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900 text-slate-200'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            <option value="todos">Todos los estados</option>
            <option value="vigentes">Vigentes (Verde)</option>
            <option value="alertas">Con Alertas</option>
            <option value="vencidos">Vencidos (Rojo)</option>
          </select>

          {/* Fecha Inicio */}
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => {
                setDateRange({ ...dateRange, start: e.target.value });
                setCurrentPage(1);
              }}
              className={`${inputCls} pl-9 pr-4`}
            />
          </div>

          {/* Fecha Fin */}
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => {
                setDateRange({ ...dateRange, end: e.target.value });
                setCurrentPage(1);
              }}
              className={`${inputCls} pl-9 pr-4`}
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div data-onboarding="runt-history-table" className={`rounded-2xl shadow-sm border overflow-hidden ${
        isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
      }`}>
        {filteredValidations.length === 0 ? (
          <div className="p-8 text-center">
            <p className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>No hay validaciones registradas</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className={`w-full text-left text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                <thead className={`font-semibold border-b ${
                  isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-300' : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}>
                  <tr>
                    <th className="px-6 py-4">Placa</th>
                    <th className="px-6 py-4">Fecha/Hora</th>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4 text-center">SOAT</th>
                    <th className="px-6 py-4 text-center">RTM</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'divide-y divide-slate-800' : 'divide-y divide-gray-100'}>
                  {paginatedValidations.map((validation) => {
                    const soatVigente = validation.resultadoRUNT?.data?.soat?.vigente;
                    const rtmVigente = validation.resultadoRUNT?.data?.rtm?.vigente;
                    const soatState = soatVigente ? 'verde' : 'rojo';
                    const rtmState = rtmVigente ? 'verde' : 'rojo';

                    return (
                      <tr key={validation.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/70' : 'hover:bg-gray-50'}`}>
                        <td className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{validation.placa}</td>
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
                            className={`p-2 rounded-lg transition-colors inline-flex ${
                              isDarkMode
                                ? 'text-slate-400 hover:bg-slate-700 hover:text-syntix-green'
                                : 'text-syntix-blue hover:bg-blue-50'
                            }`}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(validation.id)}
                            className={`p-2 rounded-lg transition-colors inline-flex ${
                              isDarkMode
                                ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-300'
                                : 'text-syntix-red hover:bg-red-50'
                            }`}
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
              <div className={`px-6 py-4 border-t flex justify-between items-center ${
                isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-gray-200 bg-gray-50'
              }`}>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Página {currentPage} de {totalPages}
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg text-sm border disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg text-sm border disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
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
