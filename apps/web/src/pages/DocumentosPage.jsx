import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Search, Shield, Wrench, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { useDocuments } from '@/hooks/useDocuments.js';
import { useRtm } from '@/contexts/RtmContext.jsx';
import { useVehicles } from '@/hooks/useVehicles.js';
import ModalFactory from '@/components/ModalFactory.jsx';
import useModalManager from '@/hooks/useModalManager.js';
import EditSoatModal from '@/components/EditSoatModal.jsx';
import EditRtmModal from '@/components/EditRtmModal.jsx';
import { formatColombianDate, getExpirationAlertText } from '@/utils/dateUtils.js';
import { isValidPlate, normalizePlate } from '@/utils/colombiaFormats.js';

const UNKNOWN_VEHICLE_LABEL = 'Vehiculo no encontrado';

const statusLabels = {
  verde: 'Vigente',
  amarillo: 'Proximo',
  rojo: 'Vencido',
};

function getBadgeClasses(estado, isDarkMode) {
  if (estado === 'rojo') return isDarkMode
    ? 'bg-red-500/10 text-red-300 border border-red-500/20'
    : 'bg-red-50 text-red-500 border border-red-200';
  if (estado === 'amarillo') return isDarkMode
    ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20'
    : 'bg-yellow-50 text-yellow-600 border border-yellow-200';
  return isDarkMode
    ? 'bg-green-500/10 text-green-300 border border-green-500/20'
    : 'bg-green-50 text-green-600 border border-green-200';
}

const normalizeSearchText = (value) => String(value ?? '').toLowerCase().trim();

const getVehicleLabel = (vehiculo) => {
  const placa = normalizePlate(vehiculo?.placa || '');
  if (!vehiculo || !isValidPlate(placa)) return UNKNOWN_VEHICLE_LABEL;
  return placa;
};

const getDocumentPlate = (documento) => {
  const placa = normalizePlate(documento.placaVehiculo || documento.placa || '');
  return isValidPlate(placa) ? placa : '';
};

const getVehicleSubtitle = (vehiculo) => {
  if (!vehiculo) return '';
  return vehiculo.tipo || 'Otro';
};

const matchesSearch = (values, searchTerm) => {
  const query = normalizeSearchText(searchTerm);
  if (!query) return true;
  return values.some((value) => normalizeSearchText(value).includes(query));
};

const getStatusSearchValues = (estado) => [
  estado,
  statusLabels[estado],
  estado === 'verde' ? 'vigente al dia' : '',
  estado === 'amarillo' ? 'proximo por vencer' : '',
  estado === 'rojo' ? 'vencido critico' : '',
];

// DocumentosPage organiza SOAT y RTM en una sola vista para que el usuario
// revise el estado documental sin saltar entre dos módulos distintos.
export default function DocumentosPage() {
  const { soats, removeSoat } = useDocuments();
  const { rtms, removeRtm } = useRtm();
  const { vehiculos } = useVehicles();
  const { isDarkMode } = useTheme();
  const { activeModal, openModal, closeModal } = useModalManager();

  const [soatEditando, setSoatEditando] = useState(null);
  const [rtmEditando, setRtmEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [soatSearch, setSoatSearch] = useState('');
  const [rtmSearch, setRtmSearch] = useState('');

  const getVehiculo = (vehiculoId) =>
    vehiculos.find((v) => String(v.id) === String(vehiculoId));

  const filteredSoats = useMemo(
    () =>
      soats.filter((soat) => {
        // Se indexan tanto placa como fechas y estado para permitir búsquedas
        // operativas más flexibles en una tabla grande.
        const vehiculo = getVehiculo(soat.vehiculoId);
        const placa = getVehicleLabel(vehiculo);
        return matchesSearch(
          [
            placa,
            getDocumentPlate(soat),
            soat.numeroPoliza,
            soat.aseguradora,
            soat.fechaFinVigencia,
            formatColombianDate(soat.fechaFinVigencia),
            ...getStatusSearchValues(soat.estado),
          ],
          soatSearch
        );
      }),
    [soats, soatSearch, vehiculos]
  );

  const filteredRtms = useMemo(
    () =>
      rtms.filter((rtm) => {
        const vehiculo = getVehiculo(rtm.vehiculoId);
        const placa = getVehicleLabel(vehiculo);
        return matchesSearch(
          [
            placa,
            getDocumentPlate(rtm),
            rtm.numeroCertificado,
            rtm.numeroRtm,
            rtm.cda,
            rtm.resultado,
            rtm.fechaVencimiento,
            formatColombianDate(rtm.fechaVencimiento),
            ...getStatusSearchValues(rtm.estado),
          ],
          rtmSearch
        );
      }),
    [rtms, rtmSearch, vehiculos]
  );

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      if (confirmDelete.tipo === 'soat') await removeSoat(confirmDelete.id);
      if (confirmDelete.tipo === 'rtm') await removeRtm(confirmDelete.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <Helmet>
        <title>Documentos | SYNTIX Drive Control</title>
      </Helmet>

      <div data-onboarding="documents-header" className="mb-8 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className={`mb-2 text-4xl font-extrabold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>
            Gestion de Documentos
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Control de SOAT y Tecnomecanica</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openModal('addDocument')}
            data-onboarding="documents-add-soat"
            className="bg-syntix-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-syntix-navy/90"
          >
            + SOAT
          </button>
          <button
            type="button"
            onClick={() => openModal('addRtm')}
            data-onboarding="documents-add-rtm"
            className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
                : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            + RTM
          </button>
        </div>
      </div>

      <DocumentTableShell
        onboardingId="documents-soat-table"
        icon={Shield}
        title="Polizas SOAT"
        count={filteredSoats.length}
        total={soats.length}
        searchTerm={soatSearch}
        onSearchChange={setSoatSearch}
        placeholder="Buscar SOAT por placa, poliza, aseguradora, estado o vencimiento..."
        isDarkMode={isDarkMode}
      >
        <table className="w-full min-w-[1100px]">
          <thead className={`text-left ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Vehiculo</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>N° Poliza</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Aseguradora</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Inicio</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Fin vigencia</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Estado</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSoats.length === 0 ? (
              <EmptyRows colSpan={7} hasData={soats.length > 0} isDarkMode={isDarkMode} />
            ) : (
              filteredSoats.map((soat) => {
                const vehiculo = getVehiculo(soat.vehiculoId);
                const placa = getVehicleLabel(vehiculo);
                const expirationText = getExpirationAlertText(soat.diasRestantes, soat.fechaFinVigencia);

                return (
                  <tr key={soat.id} className={`border-t ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/70' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{placa}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{getVehicleSubtitle(vehiculo)}</div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{soat.numeroPoliza}</td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{soat.aseguradora || 'Sin dato'}</td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{formatColombianDate(soat.fechaInicioVigencia)}</td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div>{formatColombianDate(soat.fechaFinVigencia)}</div>
                      <div className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{expirationText.primaryText}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClasses(soat.estado, isDarkMode)}`}>
                        {statusLabels[soat.estado] || soat.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RowActions
                        onEdit={() => setSoatEditando(soat)}
                        onDelete={() => setConfirmDelete({ tipo: 'soat', id: soat.id, nombre: soat.numeroPoliza })}
                        isDarkMode={isDarkMode}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DocumentTableShell>

      <DocumentTableShell
        onboardingId="documents-rtm-table"
        icon={Wrench}
        title="Revisiones Tecnico-Mecanicas"
        count={filteredRtms.length}
        total={rtms.length}
        searchTerm={rtmSearch}
        onSearchChange={setRtmSearch}
        placeholder="Buscar RTM por placa, certificado, CDA, resultado, estado o vencimiento..."
        isDarkMode={isDarkMode}
      >
        <table className="w-full min-w-[1100px]">
          <thead className={`text-left ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Vehiculo</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Certificado</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>CDA</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Resultado</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Vencimiento</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Estado</th>
              <th className={`px-6 py-4 font-bold ${isDarkMode ? 'text-slate-200' : 'text-syntix-navy'}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRtms.length === 0 ? (
              <EmptyRows colSpan={7} hasData={rtms.length > 0} isDarkMode={isDarkMode} />
            ) : (
              filteredRtms.map((rtm) => {
                const vehiculo = getVehiculo(rtm.vehiculoId);
                const placa = getVehicleLabel(vehiculo);
                const expirationText = getExpirationAlertText(rtm.diasRestantes, rtm.fechaVencimiento);

                return (
                  <tr key={rtm.id} className={`border-t ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/70' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{placa}</div>
                      <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{getVehicleSubtitle(vehiculo)}</div>
                    </td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{rtm.numeroCertificado}</td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{rtm.cda || 'Sin dato'}</td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{rtm.resultado || 'Sin dato'}</td>
                    <td className={`px-6 py-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      <div>{formatColombianDate(rtm.fechaVencimiento)}</div>
                      <div className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{expirationText.primaryText}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClasses(rtm.estado, isDarkMode)}`}>
                        {statusLabels[rtm.estado] || rtm.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RowActions
                        onEdit={() => setRtmEditando(rtm)}
                        onDelete={() => setConfirmDelete({ tipo: 'rtm', id: rtm.id, nombre: rtm.numeroCertificado })}
                        isDarkMode={isDarkMode}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </DocumentTableShell>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
            isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white'
          }`}>
            <h2 className={`mb-2 text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>Eliminar documento</h2>
            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Vas a eliminar <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{confirmDelete.nombre}</span>. Esta accion no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmDelete(null)} className={`rounded-lg px-4 py-2 font-medium ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? 'Eliminando...' : 'Si, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <EditSoatModal isOpen={!!soatEditando} soat={soatEditando} onClose={() => setSoatEditando(null)} />
      <EditRtmModal isOpen={!!rtmEditando} rtm={rtmEditando} onClose={() => setRtmEditando(null)} />
      <ModalFactory modalType={activeModal} onClose={closeModal} />
    </div>
  );
}

function DocumentTableShell({
  onboardingId,
  icon: Icon,
  title,
  count,
  total,
  searchTerm,
  onSearchChange,
  placeholder,
  children,
  isDarkMode,
}) {
  return (
    // Este shell reutilizable evita duplicar la estructura visual de SOAT y RTM
    // y deja el comportamiento de dark mode centralizado en un solo punto.
    <div data-onboarding={onboardingId} className={`mb-8 overflow-hidden rounded-3xl border shadow-sm ${
      isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'
    }`}>
      <div className={`flex flex-col justify-between gap-4 border-b px-6 py-5 lg:flex-row lg:items-center ${
        isDarkMode ? 'border-slate-800 bg-slate-950/60' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`} />
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-syntix-navy'}`}>
            {title} ({count}/{total})
          </h2>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full rounded-lg border py-2 pl-9 pr-4 text-sm outline-none focus:border-syntix-green focus:ring-2 focus:ring-syntix-green ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          />
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function EmptyRows({ colSpan, hasData, isDarkMode }) {
  return (
    <tr>
      <td colSpan={colSpan} className={`px-6 py-8 text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
        {hasData ? 'No se encontraron registros con ese criterio.' : 'No hay registros para mostrar.'}
      </td>
    </tr>
  );
}

function RowActions({ onEdit, onDelete, isDarkMode }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        className={`rounded-lg p-2 transition-colors ${
          isDarkMode
            ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-100'
            : 'text-gray-400 hover:bg-gray-100 hover:text-syntix-navy'
        }`}
        title="Editar"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={`rounded-lg p-2 transition-colors ${
          isDarkMode
            ? 'text-slate-500 hover:bg-red-500/10 hover:text-red-300'
            : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
        }`}
        title="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

DocumentTableShell.propTypes = {
  onboardingId: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

EmptyRows.propTypes = {
  colSpan: PropTypes.number.isRequired,
  hasData: PropTypes.bool.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

RowActions.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};
