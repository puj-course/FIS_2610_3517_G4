import React, { useState } from 'react';
import { X, Car, Save } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles.js';

// Agregar Vehiculo
export default function AddVehicleModal({ isOpen, onClose }) {
  const { vehiculos, addVehicle } = useVehicles();
  const [formData, setFormData] = useState({
    placa: '', marca: '', modelo: '', anio: new Date().getFullYear(), tipo: 'Automóvil'
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const placaUpper = formData.placa.toUpperCase();
    if (vehiculos.some(v => v.placa.toUpperCase() === placaUpper)) {
      setError('Ya existe un vehículo con esta placa.');
      return;
    }

    addVehicle({
      ...formData,
      placa: placaUpper,
      conductorId: null
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-syntix-navy flex items-center gap-2">
            <Car className="w-5 h-5" /> Agregar Vehículo
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Placa</label>
            <input 
              type="text" 
              required 
              maxLength={7}
              value={formData.placa} 
              onChange={e => setFormData({...formData, placa: e.target.value.toUpperCase()})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900 uppercase font-bold tracking-wider" 
              placeholder="ABC-123" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Marca</label>
              <input 
                type="text" 
                required 
                value={formData.marca} 
                onChange={e => setFormData({...formData, marca: e.target.value})} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900" 
                placeholder="Toyota" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Modelo</label>
              <input 
                type="text" 
                required 
                value={formData.modelo} 
                onChange={e => setFormData({...formData, modelo: e.target.value})} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900" 
                placeholder="Hilux" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Año</label>
              <input 
                type="number" 
                required 
                min="1990"
                max={new Date().getFullYear() + 1}
                value={formData.anio} 
                onChange={e => setFormData({...formData, anio: parseInt(e.target.value)})} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
              <select 
                value={formData.tipo} 
                onChange={e => setFormData({...formData, tipo: e.target.value})} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green outline-none text-gray-900 bg-white"
              >
                <option value="Automóvil">Automóvil</option>
                <option value="Camioneta">Camioneta</option>
                <option value="Camión">Camión</option>
                <option value="Furgón">Furgón</option>
                <option value="Motocicleta">Motocicleta</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-syntix-navy text-white px-6 py-2 rounded-lg font-medium hover:bg-syntix-navy/90 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}