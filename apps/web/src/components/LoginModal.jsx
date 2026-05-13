import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Mail, Lock, Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { authService } from '@/services/api.js';
import GoogleAuthButton from '@/components/GoogleAuthButton.jsx';
import { isValidEmailFormat } from '@/utils/emailValidation.js';

const getDigitsOnly = (value) =>
  Array.from(String(value ?? ''))
    .filter((character) => character >= '0' && character <= '9')
    .join('');

const isValidRecoveryIdentifier = (value) => {
  // Se acepta correo o un teléfono con longitud suficiente para cubrir recuperación por SMS.
  const normalizedValue = String(value || '').trim();
  return isValidEmailFormat(normalizedValue) || getDigitsOnly(normalizedValue).length >= 7;
};

// Modal ligero para autenticación desde la landing sin abandonar el flujo público.
export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  // `mode` controla las tres pantallas internas del mismo modal: login, recover y reset.
  const [mode, setMode] = useState('login');
  // Credenciales del acceso tradicional.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Datos de recuperación de cuenta.
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // `recoveryToken` amarra el segundo paso al intento de recuperación emitido por backend.
  const [recoveryToken, setRecoveryToken] = useState('');
  // Estos dos valores permiten decirle al usuario por dónde fue enviado el código.
  const [resetChannel, setResetChannel] = useState('');
  const [resetDestinationHint, setResetDestinationHint] = useState('');
  // Los toggles separan la visibilidad de la contraseña actual y la nueva.
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  // `error` y `notice` pintan feedback contextual según el paso actual.
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  // Se usa un único flag para deshabilitar envíos simultáneos.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  // El modal se desmonta por completo cuando no está abierto.
  if (!isOpen) return null;

  const clearMessages = () => {
    setError('');
    setNotice('');
  };

  const goToLogin = () => {
    // Al volver al login se limpia cualquier residuo del flujo de recuperación.
    clearMessages();
    setRecoveryToken('');
    setResetChannel('');
    setResetDestinationHint('');
    setMode('login');
  };

  const goToRecover = () => {
    // Si el usuario ya escribió un correo en login, se reutiliza como pista inicial.
    clearMessages();
    setResetIdentifier(email.trim().toLowerCase());
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setRecoveryToken('');
    setResetChannel('');
    setResetDestinationHint('');
    setMode('recover');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setIsSubmitting(true);

    try {
      // El contexto resuelve si autentica vía backend o fallback local.
      const res = await login(email, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'Credenciales invalidas');
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesion. Intenta nuevamente.');
      console.error('Error en login:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credential) => {
    // Sin credential no tiene sentido llamar al backend.
    if (!credential) {
      setError('Google no devolvio un token valido.');
      return;
    }

    clearMessages();
    setIsSubmitting(true);

    try {
      // Para login con Google no se envían empresa/teléfono; eso solo es obligatorio al crear cuenta.
      const res = await loginWithGoogle({ idToken: credential });
      if (res.success) {
        onClose();
      } else {
        setError(res.message || 'No se pudo iniciar sesion con Google.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    // El identificador puede ser correo o teléfono según lo que el usuario recuerde.
    const normalizedIdentifier = resetIdentifier.trim();

    if (!isValidRecoveryIdentifier(normalizedIdentifier)) {
      setError('Ingresa un correo o telefono valido.');
      return;
    }

    setIsSubmitting(true);

    try {
      // El backend decide si responde mensaje genérico o habilita el paso de reset con token.
      const res = await authService.solicitarRecuperacion(normalizedIdentifier);

      if (res.success) {
        if (res.data?.recoveryToken) {
          // Si hay token, el backend ya emitió el OTP y podemos pasar al paso 2.
          setRecoveryToken(res.data.recoveryToken);
          setResetChannel(res.data.channel || '');
          setResetDestinationHint(res.data.destinationHint || '');
          setResetCode('');
          setNewPassword('');
          setConfirmPassword('');
          setNotice(res.message || 'Codigo enviado al contacto registrado.');
          setMode('reset');
        } else {
          // Respuesta genérica para no filtrar si la cuenta realmente existe.
          setNotice(res.message || 'Si existe una cuenta asociada, enviaremos un codigo al contacto registrado.');
        }
      } else {
        setError(res.message || 'No se pudo enviar el codigo.');
      }
    } catch (err) {
      setError('Error inesperado al solicitar recuperacion.');
      console.error('Error solicitando recuperacion de cuenta:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    // El código se limpia para evitar espacios y caracteres extraños.
    const normalizedCode = resetCode.trim();

    if (!recoveryToken) {
      setError('Solicita un nuevo codigo de recuperacion antes de continuar.');
      return;
    }

    if (normalizedCode.length !== 6) {
      setError('Ingresa el codigo de 6 digitos.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setIsSubmitting(true);

    try {
      // El backend valida token, OTP y contraseña nueva en una sola operación.
      const res = await authService.restablecerPassword(recoveryToken, normalizedCode, newPassword);

      if (res.success) {
        // Se deja precargado el correo recuperado para facilitar el login posterior.
        setEmail(res.data?.email || '');
        setPassword('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        setResetIdentifier('');
        setRecoveryToken('');
        setResetChannel('');
        setResetDestinationHint('');
        setNotice(res.message || 'Contrasena actualizada. Ya puedes iniciar sesion.');
        setMode('login');
      } else {
        setError(res.message || 'No se pudo actualizar la contrasena.');
      }
    } catch (err) {
      setError('Error inesperado al restablecer la contrasena.');
      console.error('Error restableciendo contrasena:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleByMode = {
    // El título cambia con el paso para evitar renderizar modales distintos.
    login: 'Iniciar Sesion',
    recover: 'Recuperar Cuenta',
    reset: 'Nueva Contrasena',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {mode !== 'login' && (
              <button
                type="button"
                onClick={goToLogin}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Volver a iniciar sesion"
                title="Volver"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-syntix-navy">{titleByMode[mode]}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error de negocio o validación del backend/local fallback. */}
            {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}
            {/* Aviso positivo como recuperación completada o código enviado. */}
            {notice && <div className="p-3 bg-green-50 text-syntix-green text-sm rounded-lg border border-green-100">{notice}</div>}

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electronico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="login-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="admin@empresa.com" />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="login-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="••••••••" />
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
              <button type="button" onClick={goToRecover} className="mt-2 text-sm text-syntix-green font-semibold hover:underline">
                ¿Olvidaste tu contrasena?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-syntix-navy text-white py-2.5 rounded-lg font-medium hover:bg-syntix-navy/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Accediendo...
                </>
              ) : (
                'Acceder'
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">o continuar con</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleAuthButton
                // El modal solo transforma el credential de Google en login federado del contexto.
                onSuccess={handleGoogleLogin}
                onError={() => setError('No se pudo completar la autenticacion con Google.')}
                disabled={isSubmitting}
                text="signin_with"
              />
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              ¿No tienes cuenta? <button type="button" onClick={onSwitchToRegister} className="text-syntix-green font-semibold hover:underline">Registrate</button>
            </p>
          </form>
        )}

        {mode === 'recover' && (
          <form onSubmit={handleRecoverSubmit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}
            {notice && <div className="p-3 bg-green-50 text-syntix-green text-sm rounded-lg border border-green-100">{notice}</div>}
            <div>
              <label htmlFor="login-recovery-identifier" className="block text-sm font-medium text-gray-700 mb-1">Correo o Telefono</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="login-recovery-identifier" type="text" required value={resetIdentifier} onChange={e => setResetIdentifier(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="admin@empresa.com o 3001234567" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {/* Se deja explícito que ambos canales apuntan a la misma cuenta. */}
                Puedes iniciar la recuperacion con el correo registrado o con el telefono asociado a tu cuenta.
              </p>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-syntix-green text-white py-2.5 rounded-lg font-medium hover:bg-syntix-green/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Enviando...</>) : 'Enviar codigo'}
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}
            {notice && <div className="p-3 bg-green-50 text-syntix-green text-sm rounded-lg border border-green-100">{notice}</div>}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheck className="w-4 h-4 text-syntix-green" />
              <span>
                {/* Este texto confirma si el backend tuvo que degradar de email a SMS. */}
                {resetChannel === 'sms' ? 'SMS enviado a ' : 'Codigo enviado a '}
                {resetDestinationHint || 'tu contacto registrado'}
              </span>
            </div>

            <div>
              <label htmlFor="login-reset-code" className="block text-sm font-medium text-gray-700 mb-1">Codigo</label>
              <input id="login-reset-code" type="text" inputMode="numeric" maxLength={6} required value={resetCode} onChange={e => setResetCode(getDigitsOnly(e.target.value).slice(0, 6))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900 text-center tracking-[0.45em] font-semibold" placeholder="000000" />
            </div>

            <div>
              <label htmlFor="login-new-password" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contrasena</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="login-new-password" type={showNewPassword ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="••••••••" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-syntix-green transition-colors"
                  aria-label={showNewPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  title={showNewPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="login-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contrasena</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="login-confirm-password" type={showNewPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-syntix-green text-white py-2.5 rounded-lg font-medium hover:bg-syntix-green/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Actualizando...</>) : 'Actualizar contrasena'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSwitchToRegister: PropTypes.func.isRequired,
};
