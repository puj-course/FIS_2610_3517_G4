import React, { useState, useEffect } from 'react';
import { X, Wrench, Save } from 'lucide-react';
import { useRtm } from '@/contexts/RtmContext.jsx';
import { useVehicles } from '@/hooks/useVehicles.js';

export default function EditRtmModal({ isOpen, onClose, rtm }) {
  const { editRtm } = useRtm();
  const { vehiculos } = useVehicles();

  const [formData, setFormData] = useState({
    numeroRtm: '',
    fechaInicio: '',
    fechaVencimiento: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rtm) {
      setFormData({
        numeroRtm: rtm.numeroRtm || '',
        fechaInicio: rtm.fechaInicio || '',
        fechaVencimiento: rtm.fechaVencimiento || '',
      });
    }
  }, [rtm]);

  if (!isOpen || !rtm) return null;

  const vehiculo = vehiculos.find((v) => String(v.id) === String(rtm.vehiculoId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.numeroRtm || !formData.fechaInicio || !formData.fechaVencimiento) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (formData.fechaVencimiento <= formData.fechaInicio) {
      setError('La fecha de vencimiento debe ser posterior a la fecha de inicio.');
      return;
    }

    try {
      setSaving(true);
      await editRtm(rtm.id, formData);
      onClose();
    } catch (err) {
      setError('Error al guardar los cambios. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-syntix-navy flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Editar Tecnomecánica
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
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
            <label className="block text-sm font-bold text-gray-700 mb-1">Vehículo</label>
            <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
              {vehiculo ? `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}` : 'Vehículo no encontrado'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Número de RTM</label>
            <input
              type="text"
              required
              value={formData.numeroRtm}
              onChange={(e) => setFormData({ ...formData, numeroRtm: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Fecha inicio</label>
              <input
                type="date"
                required
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
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
