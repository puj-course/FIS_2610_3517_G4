import React, { useState } from 'react';
import { X, Mail, Lock, Building, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '', empresa: '', telefono: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await register(formData.email, formData.password, formData.empresa, formData.telefono);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error inesperado al registrar. Intente nuevamente.');
      console.error('Error en registro:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-syntix-navy">Crear Cuenta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Empresa</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" required value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="Mi Empresa SAS" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="tel" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="300 123 4567" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="admin@empresa.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="••••••••" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-syntix-green text-white py-2.5 rounded-lg font-medium hover:bg-syntix-green/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes cuenta? <button type="button" onClick={onSwitchToLogin} className="text-syntix-navy font-semibold hover:underline">Inicia Sesión</button>
          </p>
        </form>
      </div>
    </div>
  );
}