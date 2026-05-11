import React, { useEffect, useState } from 'react';
import { X, Wrench, Save } from 'lucide-react';
import { useRtm } from '@/contexts/RtmContext.jsx';
import { useVehicles } from '@/hooks/useVehicles.js';
import {
  isDateRangeValid,
  isValidDateValue,
  isValidDocumentCode,
  isValidPlate,
  normalizeDocumentCode,
  normalizePlate,
} from '@/utils/colombiaFormats.js';

const CDAS_DEMO = [
  'CDA Bogota Norte',
  'CDA Movilidad Capital',
  'CDA Andino',
  'CDA Autocontrol',
  'CDA Revision Segura',
  'CDA Centro Diagnostico Vial',
  'CDA Ruta Segura',
  'CDA Tecnica Motor',
];

const RESULTADOS = ['Aprobado', 'Rechazado', 'Pendiente'];

const createInitialFormData = () => ({
  numeroCertificado: '',
  cda: '',
  fechaExpedicion: '',
  fechaVencimiento: '',
  resultado: 'Aprobado',
  observaciones: '',
});

export default function EditRtmModal({ isOpen, onClose, rtm }) {
  const { editRtm } = useRtm();
  const { vehiculos } = useVehicles();
  const [formData, setFormData] = useState(createInitialFormData);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!rtm) return;

    setFormData({
      numeroCertificado: rtm.numeroCertificado || rtm.numeroRtm || '',
      cda: rtm.cda || '',
      fechaExpedicion: rtm.fechaExpedicion || rtm.fechaInicio || '',
      fechaVencimiento: rtm.fechaVencimiento || '',
      resultado: rtm.resultado || 'Aprobado',
      observaciones: rtm.observaciones || '',
    });
    setError('');
  }, [rtm]);

  if (!isOpen || !rtm) return null;

  const vehiculo = vehiculos.find((v) => String(v.id) === String(rtm.vehiculoId));
  const placaVehiculo = normalizePlate(vehiculo?.placa || rtm.placaVehiculo || rtm.placa || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rtm.vehiculoId) {
      setError('Seleccione un vehiculo asociado a la RTM.');
      return;
    }

    if (!isValidPlate(placaVehiculo)) {
      setError('La placa asociada debe tener formato ABC123.');
      return;
    }

    const numeroCertificado = normalizeDocumentCode(formData.numeroCertificado);
    if (!numeroCertificado) {
      setError('El numero de certificado es obligatorio.');
      return;
    }

    if (!isValidDocumentCode(numeroCertificado)) {
      setError('El numero de certificado debe ser alfanumerico y tener entre 6 y 30 caracteres.');
      return;
    }

    const cda = formData.cda.trim();
    if (!cda) {
      setError('El CDA es obligatorio.');
      return;
    }

    if (!isValidDateValue(formData.fechaExpedicion) || !isValidDateValue(formData.fechaVencimiento)) {
      setError('Seleccione fechas validas para la RTM.');
      return;
    }

    if (!isDateRangeValid(formData.fechaExpedicion, formData.fechaVencimiento)) {
      setError('La fecha de vencimiento no puede ser anterior a la fecha de expedicion.');
      return;
    }

    try {
      setSaving(true);
      await editRtm(rtm.id, {
        vehiculoId: rtm.vehiculoId,
        placaVehiculo,
        numeroCertificado,
        cda,
        fechaExpedicion: formData.fechaExpedicion,
        fechaVencimiento: formData.fechaVencimiento,
        resultado: formData.resultado,
        observaciones: formData.observaciones.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar los cambios. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-syntix-navy flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Editar RTM
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Vehiculo</label>
            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
              {vehiculo ? `${vehiculo.placa} · ${vehiculo.tipo || 'Otro'}` : 'Vehiculo no encontrado'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Numero de certificado RTM</label>
              <input
                type="text"
                required
                value={formData.numeroCertificado}
                onChange={(e) => setFormData({ ...formData, numeroCertificado: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none uppercase"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">CDA</label>
              <input
                list="cdas-rtm-edit"
                required
                value={formData.cda}
                onChange={(e) => setFormData({ ...formData, cda: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
              <datalist id="cdas-rtm-edit">
                {CDAS_DEMO.map((cda) => (
                  <option key={cda} value={cda} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Fecha expedicion</label>
              <input
                type="date"
                required
                value={formData.fechaExpedicion}
                onChange={(e) => setFormData({ ...formData, fechaExpedicion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Fecha vencimiento</label>
              <input
                type="date"
                required
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Resultado</label>
              <select
                value={formData.resultado}
                onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
              >
                {RESULTADOS.map((resultado) => (
                  <option key={resultado} value={resultado}>{resultado}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Observaciones</label>
            <textarea
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none min-h-20"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-syntix-navy text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
