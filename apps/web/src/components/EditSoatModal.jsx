import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X, FileText, Save } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments.js';
import { useVehicles } from '@/hooks/useVehicles.js';
import {
  isDateRangeValid,
  isValidDateValue,
  isValidDocumentCode,
  isValidPlate,
  normalizeDocumentCode,
  normalizePlate,
} from '@/utils/colombiaFormats.js';

const ASEGURADORAS_DEMO = [
  'Seguros Mundial',
  'Seguros Bolivar',
  'SURA',
  'Previsora Seguros',
  'Aseguradora Solidaria',
  'Mapfre',
  'Allianz',
  'Liberty Seguros',
];

const createInitialFormData = () => ({
  numeroPoliza: '',
  aseguradora: '',
  fechaExpedicion: '',
  fechaInicioVigencia: '',
  fechaFinVigencia: '',
  observaciones: '',
});

export default function EditSoatModal({ isOpen, onClose, soat }) {
  const { editSoat } = useDocuments();
  const { vehiculos } = useVehicles();
  const [formData, setFormData] = useState(createInitialFormData);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!soat) return;

    setFormData({
      numeroPoliza: soat.numeroPoliza || '',
      aseguradora: soat.aseguradora || '',
      fechaExpedicion: soat.fechaExpedicion || '',
      fechaInicioVigencia: soat.fechaInicioVigencia || soat.fechaInicio || '',
      fechaFinVigencia: soat.fechaFinVigencia || soat.fechaVencimiento || '',
      observaciones: soat.observaciones || '',
    });
    setError('');
  }, [soat]);

  if (!isOpen || !soat) return null;

  const vehiculo = vehiculos.find((v) => String(v.id) === String(soat.vehiculoId));
  const placaVehiculo = normalizePlate(vehiculo?.placa || soat.placaVehiculo || soat.placa || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!soat.vehiculoId) {
      setError('Seleccione un vehiculo asociado al SOAT.');
      return;
    }

    if (!isValidPlate(placaVehiculo)) {
      setError('La placa asociada debe tener formato ABC123.');
      return;
    }

    const numeroPoliza = normalizeDocumentCode(formData.numeroPoliza);
    if (!numeroPoliza) {
      setError('El numero de poliza es obligatorio.');
      return;
    }

    if (!isValidDocumentCode(numeroPoliza)) {
      setError('El numero de poliza debe ser alfanumerico y tener entre 6 y 30 caracteres.');
      return;
    }

    const aseguradora = formData.aseguradora.trim();
    if (!aseguradora) {
      setError('Seleccione una aseguradora.');
      return;
    }

    if (!isValidDateValue(formData.fechaExpedicion)) {
      setError('Seleccione una fecha de expedicion valida.');
      return;
    }

    if (!isValidDateValue(formData.fechaInicioVigencia) || !isValidDateValue(formData.fechaFinVigencia)) {
      setError('Seleccione fechas de vigencia validas.');
      return;
    }

    if (!isDateRangeValid(formData.fechaInicioVigencia, formData.fechaFinVigencia)) {
      setError('La fecha fin de vigencia no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      setSaving(true);
      await editSoat(soat.id, {
        vehiculoId: soat.vehiculoId,
        placaVehiculo,
        numeroPoliza,
        aseguradora,
        fechaExpedicion: formData.fechaExpedicion,
        fechaInicioVigencia: formData.fechaInicioVigencia,
        fechaFinVigencia: formData.fechaFinVigencia,
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
            <FileText className="w-5 h-5" />
            Editar SOAT
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
            <span className="block text-sm font-bold text-gray-700 mb-1">Vehiculo</span>
            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
              {vehiculo ? `${vehiculo.placa} · ${vehiculo.tipo || 'Otro'}` : 'Vehiculo no encontrado'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-soat-numero-poliza" className="block text-sm font-bold text-gray-700 mb-1">Numero de poliza</label>
              <input
                id="edit-soat-numero-poliza"
                type="text"
                required
                value={formData.numeroPoliza}
                onChange={(e) => setFormData({ ...formData, numeroPoliza: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none uppercase"
              />
            </div>
            <div>
              <label htmlFor="edit-soat-aseguradora" className="block text-sm font-bold text-gray-700 mb-1">Aseguradora</label>
              <input
                id="edit-soat-aseguradora"
                list="aseguradoras-soat-edit"
                required
                value={formData.aseguradora}
                onChange={(e) => setFormData({ ...formData, aseguradora: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
              <datalist id="aseguradoras-soat-edit">
                {ASEGURADORAS_DEMO.map((aseguradora) => (
                  <option key={aseguradora} value={aseguradora} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="edit-soat-fecha-expedicion" className="block text-sm font-bold text-gray-700 mb-1">Fecha expedicion</label>
              <input
                id="edit-soat-fecha-expedicion"
                type="date"
                required
                value={formData.fechaExpedicion}
                onChange={(e) => setFormData({ ...formData, fechaExpedicion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label htmlFor="edit-soat-inicio-vigencia" className="block text-sm font-bold text-gray-700 mb-1">Inicio vigencia</label>
              <input
                id="edit-soat-inicio-vigencia"
                type="date"
                required
                value={formData.fechaInicioVigencia}
                onChange={(e) => setFormData({ ...formData, fechaInicioVigencia: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label htmlFor="edit-soat-fin-vigencia" className="block text-sm font-bold text-gray-700 mb-1">Fin vigencia</label>
              <input
                id="edit-soat-fin-vigencia"
                type="date"
                required
                value={formData.fechaFinVigencia}
                onChange={(e) => setFormData({ ...formData, fechaFinVigencia: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-soat-observaciones" className="block text-sm font-bold text-gray-700 mb-1">Observaciones</label>
            <textarea
              id="edit-soat-observaciones"
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

EditSoatModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  soat: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    vehiculoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placa: PropTypes.string,
    placaVehiculo: PropTypes.string,
    numeroPoliza: PropTypes.string,
    aseguradora: PropTypes.string,
    fechaExpedicion: PropTypes.string,
    fechaInicio: PropTypes.string,
    fechaInicioVigencia: PropTypes.string,
    fechaVencimiento: PropTypes.string,
    fechaFinVigencia: PropTypes.string,
    observaciones: PropTypes.string,
  }),
};
