import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Shield, Wrench, Pencil, Trash2 } from 'lucide-react';
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

function getBadgeClasses(estado) {
  if (estado === 'rojo') return 'bg-red-50 text-red-500 border border-red-200';
  if (estado === 'amarillo') return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
  return 'bg-green-50 text-green-600 border border-green-200';
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

export default function DocumentosPage() {
  const { soats, removeSoat } = useDocuments();
  const { rtms, removeRtm } = useRtm();
  const { vehiculos } = useVehicles();
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Documentos | SYNTIX Drive Control</title>
      </Helmet>

      <div data-onboarding="documents-header" className="mb-8 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-4xl font-extrabold text-syntix-navy mb-2">
            Gestion de Documentos
          </h1>
          <p className="text-gray-500 text-lg">Control de SOAT y Tecnomecanica</p>
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
            className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
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
      >
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-4 text-syntix-navy font-bold">Vehiculo</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">N° Poliza</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Aseguradora</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Inicio</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Fin vigencia</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Estado</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSoats.length === 0 ? (
              <EmptyRows colSpan={7} hasData={soats.length > 0} />
            ) : (
              filteredSoats.map((soat) => {
                const vehiculo = getVehiculo(soat.vehiculoId);
                const placa = getVehicleLabel(vehiculo);
                const expirationText = getExpirationAlertText(soat.diasRestantes, soat.fechaFinVigencia);

                return (
                  <tr key={soat.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{placa}</div>
                      <div className="text-xs text-gray-500">{getVehicleSubtitle(vehiculo)}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{soat.numeroPoliza}</td>
                    <td className="px-6 py-4 text-gray-700">{soat.aseguradora || 'Sin dato'}</td>
                    <td className="px-6 py-4 text-gray-700">{formatColombianDate(soat.fechaInicioVigencia)}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <div>{formatColombianDate(soat.fechaFinVigencia)}</div>
                      <div className="text-xs text-gray-500 mt-1">{expirationText.primaryText}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClasses(soat.estado)}`}>
                        {statusLabels[soat.estado] || soat.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RowActions
                        onEdit={() => setSoatEditando(soat)}
                        onDelete={() => setConfirmDelete({ tipo: 'soat', id: soat.id, nombre: soat.numeroPoliza })}
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
      >
        <table className="w-full min-w-[1100px]">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-4 text-syntix-navy font-bold">Vehiculo</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Certificado</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">CDA</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Resultado</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Vencimiento</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Estado</th>
              <th className="px-6 py-4 text-syntix-navy font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRtms.length === 0 ? (
              <EmptyRows colSpan={7} hasData={rtms.length > 0} />
            ) : (
              filteredRtms.map((rtm) => {
                const vehiculo = getVehiculo(rtm.vehiculoId);
                const placa = getVehicleLabel(vehiculo);
                const expirationText = getExpirationAlertText(rtm.diasRestantes, rtm.fechaVencimiento);

                return (
                  <tr key={rtm.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{placa}</div>
                      <div className="text-xs text-gray-500">{getVehicleSubtitle(vehiculo)}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{rtm.numeroCertificado}</td>
                    <td className="px-6 py-4 text-gray-700">{rtm.cda || 'Sin dato'}</td>
                    <td className="px-6 py-4 text-gray-700">{rtm.resultado || 'Sin dato'}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <div>{formatColombianDate(rtm.fechaVencimiento)}</div>
                      <div className="text-xs text-gray-500 mt-1">{expirationText.primaryText}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClasses(rtm.estado)}`}>
                        {statusLabels[rtm.estado] || rtm.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RowActions
                        onEdit={() => setRtmEditando(rtm)}
                        onDelete={() => setConfirmDelete({ tipo: 'rtm', id: rtm.id, nombre: rtm.numeroCertificado })}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Eliminar documento</h2>
            <p className="text-gray-500 mb-6">
              Vas a eliminar <span className="font-bold text-gray-800">{confirmDelete.nombre}</span>. Esta accion no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
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
}) {
  return (
    <div data-onboarding={onboardingId} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-syntix-navy" />
          <h2 className="text-2xl font-bold text-syntix-navy">
            {title} ({count}/{total})
          </h2>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none"
          />
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function EmptyRows({ colSpan, hasData }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-8 text-center text-gray-500">
        {hasData ? 'No se encontraron registros con ese criterio.' : 'No hay registros para mostrar.'}
      </td>
    </tr>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="p-2 rounded-lg text-gray-400 hover:text-syntix-navy hover:bg-gray-100 transition-colors"
        title="Editar"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
