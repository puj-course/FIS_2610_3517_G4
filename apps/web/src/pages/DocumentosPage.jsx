import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Wrench, Pencil, Trash2 } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments.js';
import { useRtm } from '@/contexts/RtmContext.jsx';
import { useVehicles } from '@/hooks/useVehicles.js';
import ModalFactory from '@/components/ModalFactory.jsx';
import useModalManager from '@/hooks/useModalManager.js';
import EditSoatModal from '@/components/EditSoatModal.jsx';
import EditRtmModal from '@/components/EditRtmModal.jsx';

function getBadgeClasses(estado) {
  if (estado === 'rojo') return 'bg-red-50 text-red-500 border border-red-200';
  if (estado === 'amarillo') return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
  return 'bg-green-50 text-green-600 border border-green-200';
}

export default function DocumentosPage() {
  const { soats, removeSoat } = useDocuments();
  const { rtms, removeRtm } = useRtm();
  const { vehiculos } = useVehicles();
  const { activeModal, openModal, closeModal } = useModalManager();

  const [soatEditando, setSoatEditando] = useState(null);
  const [rtmEditando, setRtmEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { tipo, id, nombre }
  const [deleting, setDeleting] = useState(false);

  const getVehiculo = (vehiculoId) =>
    vehiculos.find((v) => String(v.id) === String(vehiculoId));

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

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-4xl font-extrabold text-syntix-navy mb-2">
            Gestión de Documentos
          </h1>
          <p className="text-gray-500 text-lg">Control de SOAT y Tecnomecánica</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openModal('addDocument')}
            style={{ background: '#111', color: '#fff', padding: '10px 16px', borderRadius: 10, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}
          >
            + SOAT
          </button>
          <button
            type="button"
            onClick={() => openModal('addRtm')}
            style={{ background: '#f3f4f6', color: '#111', padding: '10px 16px', borderRadius: 10, fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}
          >
            + RTM
          </button>
        </div>
      </div>

      {/* Tabla SOAT */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <Shield className="w-6 h-6 text-syntix-navy" />
          <h2 className="text-2xl font-bold text-syntix-navy">Pólizas SOAT</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-syntix-navy font-bold">Vehículo</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">N° Póliza</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Vencimiento</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Días Restantes</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Estado</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {soats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No hay SOATs registrados.
                  </td>
                </tr>
              ) : (
                soats.map((s) => {
                  const vehiculo = getVehiculo(s.vehiculoId);
                  return (
                    <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {vehiculo ? vehiculo.placa : 'Vehículo no encontrado'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{s.numeroPoliza}</td>
                      <td className="px-6 py-4 text-gray-700">{s.fechaVencimiento}</td>
                      <td className="px-6 py-4 text-gray-700">{s.diasRestantes} días</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClasses(s.estado)}`}>
                          {s.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSoatEditando(s)}
                            className="p-2 rounded-lg text-gray-400 hover:text-syntix-navy hover:bg-gray-100 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({ tipo: 'soat', id: s.id, nombre: s.numeroPoliza })}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla RTM */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <Wrench className="w-6 h-6 text-syntix-navy" />
          <h2 className="text-2xl font-bold text-syntix-navy">Revisiones Técnico-Mecánicas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-syntix-navy font-bold">Vehículo</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">N° RTM</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Vencimiento</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Días Restantes</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Estado</th>
                <th className="px-6 py-4 text-syntix-navy font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rtms.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No hay RTMs registradas.
                  </td>
                </tr>
              ) : (
                rtms.map((r) => {
                  const vehiculo = getVehiculo(r.vehiculoId);
                  return (
                    <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {vehiculo ? vehiculo.placa : 'Vehículo no encontrado'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{r.numeroRtm}</td>
                      <td className="px-6 py-4 text-gray-700">{r.fechaVencimiento}</td>
                      <td className="px-6 py-4 text-gray-700">{r.diasRestantes} días</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeClasses(r.estado)}`}>
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setRtmEditando(r)}
                            className="p-2 rounded-lg text-gray-400 hover:text-syntix-navy hover:bg-gray-100 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({ tipo: 'rtm', id: r.id, nombre: r.numeroRtm })}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal confirmación eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar documento?</h2>
            <p className="text-gray-500 mb-6">
              Vas a eliminar <span className="font-bold text-gray-800">{confirmDelete.nombre}</span>. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales de edición */}
      <EditSoatModal
        isOpen={!!soatEditando}
        soat={soatEditando}
        onClose={() => setSoatEditando(null)}
      />
      <EditRtmModal
        isOpen={!!rtmEditando}
        rtm={rtmEditando}
        onClose={() => setRtmEditando(null)}
      />

      <ModalFactory modalType={activeModal} onClose={closeModal} />
    </div>
  );
}
