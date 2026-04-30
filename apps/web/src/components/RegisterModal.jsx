import React, { useState, useRef } from 'react';
import { X, Mail, Lock, Building, Phone, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { authService } from '@/services/api.js';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '', empresa: '', telefono: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [pendingEmail, setPendingEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const { register, loginAfterVerification } = useAuth();

  if (!isOpen) return null;

  // Paso 1: registro base. Si el backend responde OK, se avanza al paso OTP.
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
      if (res.success || res.needsVerification) {
        setPendingEmail(formData.email);
        setStep('verify');
        startCooldown();
      } else {
        setError(res.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error inesperado al registrar. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cooldown visual para evitar spam de reenvios.
  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // Permite solo digitos y avanza automaticamente entre inputs.
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Si el campo esta vacio y se borra, vuelve al input anterior.
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paso 2: valida OTP y activa sesion del usuario verificado.
  const handleVerify = async (e) => {
    e.preventDefault();
    const codigo = otp.join('');
    if (codigo.length < 6) { setError('Ingresa el código completo de 6 dígitos'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await authService.verificarCodigo(pendingEmail, codigo);
      if (res.success) {
        if (loginAfterVerification) loginAfterVerification(res.data.user);
        onClose();
      } else {
        setError(res.message || 'Código incorrecto');
      }
    } catch (err) {
      setError('Error al verificar. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Solicita un OTP nuevo respetando el cooldown configurado.
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    try {
      const res = await authService.reenviarCodigo(pendingEmail);
      if (res.success) {
        setOtp(['', '', '', '', '', '']);
        startCooldown();
        inputRefs.current[0]?.focus();
      } else {
        setError(res.message);
      }
    } catch {
      setError('Error al reenviar el código.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

        {step === 'register' && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-syntix-navy">Crear Cuenta</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
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
              <button type="submit" disabled={isSubmitting} className="w-full bg-syntix-green text-white py-2.5 rounded-lg font-medium hover:bg-syntix-green/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Registrando...</>) : 'Registrarse'}
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">
                ¿Ya tienes cuenta? <button type="button" onClick={onSwitchToLogin} className="text-syntix-navy font-semibold hover:underline">Inicia Sesión</button>
              </p>
            </form>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-syntix-green" />
                <h2 className="text-2xl font-bold text-syntix-navy">Verificar Cuenta</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleVerify} className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Enviamos un código de 6 dígitos a</p>
                <p className="font-semibold text-syntix-navy mt-1">{pendingEmail}</p>
                <p className="text-gray-500 text-xs mt-2">Revisa tu bandeja de entrada y carpeta de spam.</p>
              </div>

              {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}

              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-syntix-navy"
                  />
                ))}
              </div>

              <button type="submit" disabled={isSubmitting || otp.join('').length < 6} className="w-full bg-syntix-green text-white py-2.5 rounded-lg font-medium hover:bg-syntix-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Verificando...</>) : 'Verificar y Activar Cuenta'}
              </button>

              <div className="text-center">
                <button type="button" onClick={handleResend} disabled={resendCooldown > 0} className="flex items-center gap-1 mx-auto text-sm text-syntix-navy hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed">
                  <RefreshCw className="w-4 h-4" />
                  {resendCooldown > 0 ? `Reenviar código en ${resendCooldown}s` : 'Reenviar código'}
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}