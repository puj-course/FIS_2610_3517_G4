import React, { useMemo, useState } from 'react';
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
  vehiculoId: '',
  numeroPoliza: '',
  aseguradora: '',
  fechaExpedicion: '',
  fechaInicioVigencia: '',
  fechaFinVigencia: '',
  observaciones: '',
});

export default function AddDocumentModal({ isOpen, onClose }) {
  const { vehiculos } = useVehicles();
  const { addSoat } = useDocuments();
  const [formData, setFormData] = useState(createInitialFormData);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedVehicle = useMemo(
    () => vehiculos.find((vehiculo) => String(vehiculo.id) === String(formData.vehiculoId)),
    [formData.vehiculoId, vehiculos]
  );

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData(createInitialFormData());
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.vehiculoId) {
      setError('Seleccione un vehiculo asociado al SOAT.');
      return;
    }

    const placaVehiculo = normalizePlate(selectedVehicle?.placa || '');
    if (!selectedVehicle || !isValidPlate(placaVehiculo)) {
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
      await addSoat({
        vehiculoId: formData.vehiculoId,
        placaVehiculo,
        numeroPoliza,
        aseguradora,
        fechaExpedicion: formData.fechaExpedicion,
        fechaInicioVigencia: formData.fechaInicioVigencia,
        fechaFinVigencia: formData.fechaFinVigencia,
        observaciones: formData.observaciones.trim(),
      });

      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el SOAT. Intenta de nuevo.');
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
            Agregar SOAT
          </h2>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
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
            <label htmlFor="soat-vehiculo" className="block text-sm font-bold text-gray-700 mb-1">Vehiculo</label>
            <select
              id="soat-vehiculo"
              required
              value={formData.vehiculoId}
              onChange={(e) => setFormData({ ...formData, vehiculoId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
            >
              <option value="">Selecciona un vehiculo</option>
              {vehiculos.map((vehiculo) => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.placa} · {vehiculo.tipo || 'Otro'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="soat-numero-poliza" className="block text-sm font-bold text-gray-700 mb-1">Numero de poliza</label>
              <input
                id="soat-numero-poliza"
                type="text"
                required
                value={formData.numeroPoliza}
                onChange={(e) => setFormData({ ...formData, numeroPoliza: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none uppercase"
                placeholder="SOAT20260001"
              />
            </div>
            <div>
              <label htmlFor="soat-aseguradora" className="block text-sm font-bold text-gray-700 mb-1">Aseguradora</label>
              <input
                id="soat-aseguradora"
                list="aseguradoras-soat"
                required
                value={formData.aseguradora}
                onChange={(e) => setFormData({ ...formData, aseguradora: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                placeholder="SURA"
              />
              <datalist id="aseguradoras-soat">
                {ASEGURADORAS_DEMO.map((aseguradora) => (
                  <option key={aseguradora} value={aseguradora} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="soat-fecha-expedicion" className="block text-sm font-bold text-gray-700 mb-1">Fecha expedicion</label>
              <input
                id="soat-fecha-expedicion"
                type="date"
                required
                value={formData.fechaExpedicion}
                onChange={(e) => setFormData({ ...formData, fechaExpedicion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label htmlFor="soat-inicio-vigencia" className="block text-sm font-bold text-gray-700 mb-1">Inicio vigencia</label>
              <input
                id="soat-inicio-vigencia"
                type="date"
                required
                value={formData.fechaInicioVigencia}
                onChange={(e) => setFormData({ ...formData, fechaInicioVigencia: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label htmlFor="soat-fin-vigencia" className="block text-sm font-bold text-gray-700 mb-1">Fin vigencia</label>
              <input
                id="soat-fin-vigencia"
                type="date"
                required
                value={formData.fechaFinVigencia}
                onChange={(e) => setFormData({ ...formData, fechaFinVigencia: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="soat-observaciones" className="block text-sm font-bold text-gray-700 mb-1">Observaciones</label>
            <textarea
              id="soat-observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none min-h-20"
              placeholder="Opcional"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-syntix-navy text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddDocumentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
