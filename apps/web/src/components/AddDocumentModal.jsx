import React, { useState } from 'react';
import { X, FileText, Save } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments.js';
import { useVehicles } from '@/hooks/useVehicles.js';

export default function AddDocumentModal({ isOpen, onClose }) {
  const { vehiculos } = useVehicles();
  const { addSoat } = useDocuments();

  const [formData, setFormData] = useState({
    vehiculoId: '',
    numeroPoliza: '',
    fechaInicio: '',
    fechaVencimiento: '',
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.vehiculoId ||
      !formData.numeroPoliza ||
      !formData.fechaInicio ||
      !formData.fechaVencimiento
    ) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (formData.fechaVencimiento <= formData.fechaInicio) {
      setError('La fecha de vencimiento debe ser posterior a la fecha de inicio.');
      return;
    }

    try {
      setSaving(true);
      await addSoat({
        vehiculoId: formData.vehiculoId,
        numeroPoliza: formData.numeroPoliza,
        fechaInicio: formData.fechaInicio,
        fechaVencimiento: formData.fechaVencimiento,
      });

      setFormData({
        vehiculoId: '',
        numeroPoliza: '',
        fechaInicio: '',
        fechaVencimiento: '',
      });

      onClose();
    } catch (err) {
      setError('Error al guardar el documento. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-syntix-navy flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Agregar Documento
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Vehículo
            </label>
            <select
              required
              value={formData.vehiculoId}
              onChange={(e) =>
                setFormData({ ...formData, vehiculoId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            >
              <option value="">Selecciona un vehículo</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.placa} - {v.marca} {v.modelo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Número de póliza
            </label>
            <input
              type="text"
              required
              value={formData.numeroPoliza}
              onChange={(e) =>
                setFormData({ ...formData, numeroPoliza: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              placeholder="SOAT-1004"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) =>
                  setFormData({ ...formData, fechaInicio: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Fecha vencimiento
              </label>
              <input
                type="date"
                required
                value={formData.fechaVencimiento}
                onChange={(e) =>
                  setFormData({ ...formData, fechaVencimiento: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
            >
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