import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { X, Mail, Lock, Building, Phone, Loader2, ShieldCheck, RefreshCw, Eye, EyeOff, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { queueOnboardingForUser } from '@/contexts/OnboardingContext.jsx';
import { authService } from '@/services/api.js';
import GoogleAuthButton from '@/components/GoogleAuthButton.jsx';
import { isValidColombianMobile } from '@/utils/colombiaFormats.js';
import { isValidEmailFormat } from '@/utils/emailValidation.js';

const isOnlyDigits = (value) =>
  Array.from(String(value ?? '')).every((character) => character >= '0' && character <= '9');

// Registro en dos pasos: alta inicial y luego verificación OTP para cerrar el onboarding.
export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  // `formData` concentra el paso inicial del registro tradicional.
  const [formData, setFormData] = useState({ email: '', password: '', empresa: '', telefono: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // `step` define si estamos rellenando datos, eligiendo canal de OTP, o confirmando el OTP.
  const [step, setStep] = useState('register'); // 'register' | 'chooseChannel' | 'verify'
  // `pendingEmail` conserva el correo que debe verificarse en el segundo paso.
  const [pendingEmail, setPendingEmail] = useState('');
  // `pendingTelefono` conserva el teléfono para poder enviar OTP por SMS si el usuario lo elige.
  const [pendingTelefono, setPendingTelefono] = useState('');
  // `otpChannel` guarda el canal elegido por el usuario ('email' | 'sms').
  const [otpChannel, setOtpChannel] = useState('email');
  // El OTP se separa en 6 casillas para mejorar legibilidad y foco.
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  // Cooldown visual para limitar reenvíos desde el cliente.
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const { register, loginAfterVerification, loginWithGoogle } = useAuth();

  // Si el modal está cerrado, no se renderiza ni mantiene listeners visuales.
  if (!isOpen) return null;

  // Paso 1: registro base. Si el backend responde OK, se avanza al paso OTP.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const empresa = formData.empresa.trim();
    const telefono = formData.telefono.trim();
    const email = formData.email.trim().toLowerCase();

    // La empresa es requisito del modelo de negocio.
    if (!empresa) {
      setError('Ingresa el nombre de la empresa.');
      return;
    }
    // El teléfono alimenta recuperación y perfil del usuario.
    if (!telefono) {
      setError('Ingresa el teléfono.');
      return;
    }
    if (!isValidColombianMobile(telefono)) {
      setError('El celular debe tener 10 digitos e iniciar por 3.');
      return;
    }
    // El correo es la llave principal de identidad y del OTP.
    if (!isValidEmailFormat(email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (!formData.password) {
      setError('Ingresa una contraseña.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    // Se inicia la llamada al contexto solo después de pasar todas las validaciones locales.
    setIsSubmitting(true);
    try {
      // Primero se registra el usuario sin disparar OTP todavía; el canal se elige a continuación.
      const res = await register(email, formData.password, empresa, telefono);
      if (res.needsVerification) {
        // El backend creó la cuenta pendiente; ahora el usuario elige por dónde recibir el código.
        setPendingEmail(res.email || email);
        setPendingTelefono(telefono);
        setStep('chooseChannel');
      } else if (res.success) {
        // Fallback reservado para registros que no requieran OTP en otros escenarios.
        queueOnboardingForUser(res.user?.email || email);
        onClose();
      } else {
        setError(res.message || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error inesperado al registrar. Intente nuevamente.');
      console.error('Error registrando usuario:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async (credential) => {
    // Con Google, empresa y teléfono siguen siendo obligatorios porque no vienen del perfil federado.
    const empresa = formData.empresa.trim();
    const telefono = formData.telefono.trim();

    if (!empresa) {
      setError('Ingresa el nombre de la empresa antes de continuar con Google.');
      return;
    }

    if (!telefono) {
      setError('Ingresa el teléfono antes de continuar con Google.');
      return;
    }

    if (!isValidColombianMobile(telefono)) {
      setError('El celular debe tener 10 digitos e iniciar por 3.');
      return;
    }

    if (!credential) {
      setError('Google no devolvio un token valido.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // El backend decide si la cuenta Google se crea o si simplemente inicia sesión.
      const res = await loginWithGoogle({ idToken: credential, empresa, telefono });
      if (res.success) {
        // Solo se cola onboarding si realmente fue una cuenta nueva.
        if (res.created && res.user?.email) {
          queueOnboardingForUser(res.user.email);
        }
        onClose();
      } else {
        setError(res.message || 'No se pudo completar el registro con Google.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cooldown visual para evitar spam de reenvios.
  const startCooldown = () => {
    // Arranca en 60 y baja cada segundo hasta liberar el botón.
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // El usuario eligió el canal; se solicita el OTP y se avanza a la pantalla de verificación.
  const handleChannelSelect = async (channel) => {
    setError('');
    setOtpChannel(channel);
    setIsSubmitting(true);
    try {
      // Siempre se identifica la cuenta por correo; el canal le dice al backend si envía email o SMS.
      const res = await authService.reenviarCodigo(pendingEmail, channel);
      if (res.success) {
        setOtp(['', '', '', '', '', '']);
        setStep('verify');
        startCooldown();
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        setError(res.message || 'No se pudo enviar el codigo. Intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al enviar el codigo.');
      console.error('Error enviando OTP de registro:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Permite solo digitos y avanza automaticamente entre inputs.
  const handleOtpChange = (index, value) => {
    // Se rechaza cualquier carácter que no sea numérico.
    if (!isOnlyDigits(value)) return;
    const newOtp = [...otp];
    // Cada input guarda solo el último dígito ingresado.
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    // Si el usuario escribió algo, el foco salta al siguiente cuadro.
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
    // Se recompone el OTP completo antes de enviarlo al backend.
    const codigo = otp.join('');
    if (codigo.length < 6) { setError('Ingresa el código completo de 6 dígitos'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      // El backend verifica hash, expiración e intentos restantes.
      const res = await authService.verificarCodigo(pendingEmail, codigo);
      if (res.success) {
        queueOnboardingForUser(res.data.user?.email || pendingEmail);
        // Esta llamada crea la sesión real justo después de validar el OTP.
        if (loginAfterVerification) loginAfterVerification(res.data.user, res.data.token);
        onClose();
      } else {
        setError(res.message || 'Código incorrecto');
      }
    } catch (err) {
      setError('Error al verificar. Intente nuevamente.');
      console.error('Error verificando codigo de registro:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Solicita un OTP nuevo respetando el cooldown configurado.
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    try {
      // Siempre se identifica la cuenta por correo; el canal determina cómo llega el código.
      const res = await authService.reenviarCodigo(pendingEmail, otpChannel);
      if (res.success) {
        setOtp(['', '', '', '', '', '']);
        startCooldown();
        inputRefs.current[0]?.focus();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Error al reenviar el código.');
      console.error('Error reenviando codigo de registro:', err);
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
            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}
              <div>
                <label htmlFor="register-company" className="block text-sm font-medium text-gray-700 mb-1">Nombre de Empresa</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input id="register-company" type="text" required value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="Mi Empresa SAS" />
                </div>
              </div>
              <div>
                <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input id="register-phone" type="tel" required value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="3001234567" />
                </div>
              </div>
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input id="register-email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="admin@empresa.com" />
                </div>
              </div>
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input id="register-password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="••••••••" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-syntix-green transition-colors"
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                    title={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-syntix-green text-white py-2.5 rounded-lg font-medium hover:bg-syntix-green/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Registrando...</>) : 'Registrarse'}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">o registrarte con</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <GoogleAuthButton
                  // El botón usa el mismo proveedor global configurado en main.jsx.
                  onSuccess={handleGoogleRegister}
                  onError={() => setError('No se pudo completar el registro con Google.')}
                  disabled={isSubmitting}
                  text="signup_with"
                />
                <p className="text-center text-xs text-gray-500">
                  {/* Se explica por qué Google no elimina por completo el formulario del registro. */}
                  Google aporta el correo verificado; empresa y teléfono siguen siendo obligatorios para crear la cuenta.
                </p>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                ¿Ya tienes cuenta? <button type="button" onClick={onSwitchToLogin} className="text-syntix-navy font-semibold hover:underline">Inicia Sesión</button>
              </p>
            </form>
          </>
        )}

        {step === 'chooseChannel' && (
          <>
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-syntix-green" />
                <h2 className="text-2xl font-bold text-syntix-navy">Verificar Cuenta</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-5">
              {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}

              <p className="text-sm text-gray-600 text-center">
                ¿Por donde quieres recibir tu codigo de verificacion?
              </p>

              <div className="grid grid-cols-2 gap-3">
                {/* Opcion correo electronico */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleChannelSelect('email')}
                  className="flex flex-col items-center gap-3 p-5 border-2 border-gray-200 rounded-xl hover:border-syntix-green hover:bg-syntix-green/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="w-12 h-12 rounded-full bg-syntix-navy/10 group-hover:bg-syntix-green/15 flex items-center justify-center transition-colors">
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 text-syntix-navy animate-spin" />
                    ) : (
                      <Mail className="w-6 h-6 text-syntix-navy group-hover:text-syntix-green transition-colors" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm text-gray-800 group-hover:text-syntix-green transition-colors">Correo</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[100px]">{pendingEmail}</p>
                  </div>
                </button>

                {/* Opcion SMS */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleChannelSelect('sms')}
                  className="flex flex-col items-center gap-3 p-5 border-2 border-gray-200 rounded-xl hover:border-syntix-green hover:bg-syntix-green/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="w-12 h-12 rounded-full bg-syntix-navy/10 group-hover:bg-syntix-green/15 flex items-center justify-center transition-colors">
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 text-syntix-navy animate-spin" />
                    ) : (
                      <Smartphone className="w-6 h-6 text-syntix-navy group-hover:text-syntix-green transition-colors" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm text-gray-800 group-hover:text-syntix-green transition-colors">SMS</p>
                    <p className="text-xs text-gray-500 mt-0.5">{pendingTelefono}</p>
                  </div>
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                El codigo expira en 10 minutos.
              </p>
            </div>
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
                {otpChannel === 'sms' ? (
                  <>
                    <p className="text-gray-600 text-sm">Enviamos un codigo de 6 digitos por SMS a</p>
                    <p className="font-semibold text-syntix-navy mt-1">{pendingTelefono}</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm">Enviamos un código de 6 dígitos a</p>
                    <p className="font-semibold text-syntix-navy mt-1">{pendingEmail}</p>
                    {/* Se avisa spam porque varios profesores/equipos suelen probar con Gmail. */}
                    <p className="text-gray-500 text-xs mt-2">Revisa tu bandeja de entrada y carpeta de spam.</p>
                  </>
                )}
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

RegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
};
