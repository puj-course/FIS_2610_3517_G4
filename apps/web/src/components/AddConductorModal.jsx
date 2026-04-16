import React, { useState } from 'react';
import { X, User, Save } from 'lucide-react';
import { useConductors } from '@/hooks/useConductors.js';
import { useVehicles } from '@/hooks/useVehicles.js';

export default function AddConductorModal({ isOpen, onClose }) {
  const { conductores, addConductor } = useConductors();
  const { vehiculos, assignConductor } = useVehicles();

  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    categoria: 'B1',
    fechaVencimiento: '',
    vehiculoId: ''
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      nombre: '',
      documento: '',
      telefono: '',
      categoria: 'B1',
      fechaVencimiento: '',
      vehiculoId: ''
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nombre = formData.nombre.trim();
    const documento = formData.documento.trim();
    const telefono = formData.telefono.trim();
    const fechaVencimiento = formData.fechaVencimiento;

    if (!nombre || !documento || !telefono || !fechaVencimiento) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    if (conductores.some(c => c.documento.trim() === documento)) {
      setError('Ya existe un conductor con este documento.');
      return;
    }

    if (!/^\d{7,15}$/.test(documento)) {
      setError('El documento debe contener solo números y tener entre 7 y 15 dígitos.');
      return;
    }

    if (!/^[0-9+\s-]{7,20}$/.test(telefono)) {
      setError('Ingresa un teléfono válido.');
      return;
    }

    try {
      const newConductor = await addConductor({
        nombre,
        documento,
        telefono,
        categoria: formData.categoria,
        fechaVencimiento
      });

      if (formData.vehiculoId) {
        await assignConductor(formData.vehiculoId, newConductor.id);
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error('Error registrando conductor', err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
        return;
      }

      setError('No fue posible registrar el conductor. Intenta nuevamente.');
    }
  };

  const vehiculosDisponibles = vehiculos.filter((v) => !v.conductorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-syntix-navy flex items-center gap-2">
            <User className="w-5 h-5" /> Agregar Conductor
          </h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900"
              placeholder="Juan Pérez"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Documento</label>
              <input
                type="text"
                required
                value={formData.documento}
                onChange={e => setFormData({ ...formData, documento: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                required
                value={formData.telefono}
                onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900"
                placeholder="3001234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Vehículo a asignar</label>
            <select
              value={formData.vehiculoId}
              onChange={e => setFormData({ ...formData, vehiculoId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900 bg-white"
            >
              <option value="">Sin asignar</option>
              {vehiculosDisponibles.map((vehiculo) => (
                <option key={vehiculo.id} value={vehiculo.id}>
                  {vehiculo.placa} - {vehiculo.marca} {vehiculo.modelo}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Información de Licencia</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900 bg-white"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="B3">B3</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                  <option value="C3">C3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Fecha Vencimiento</label>
                <input
                  type="date"
                  required
                  value={formData.fechaVencimiento}
                  onChange={e => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-syntix-navy text-white px-6 py-2 rounded-lg font-medium hover:bg-syntix-navy/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}