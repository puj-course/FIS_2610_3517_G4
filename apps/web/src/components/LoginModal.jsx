import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { authService } from '@/services/api.js';
import GoogleAuthButton from '@/components/GoogleAuthButton.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidRecoveryIdentifier = (value) => {
  const normalizedValue = String(value || '').trim();
  return EMAIL_REGEX.test(normalizedValue) || normalizedValue.replace(/\D/g, '').length >= 7;
};

// Modal ligero para autenticación desde la landing sin abandonar el flujo público.
export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [resetChannel, setResetChannel] = useState('');
  const [resetDestinationHint, setResetDestinationHint] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const clearMessages = () => {
    setError('');
    setNotice('');
  };

  const goToLogin = () => {
    clearMessages();
    setRecoveryToken('');
    setResetChannel('');
    setResetDestinationHint('');
    setMode('login');
  };

  const goToRecover = () => {
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
    if (!credential) {
      setError('Google no devolvio un token valido.');
      return;
    }

    clearMessages();
    setIsSubmitting(true);

    try {
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
    const normalizedIdentifier = resetIdentifier.trim();

    if (!isValidRecoveryIdentifier(normalizedIdentifier)) {
      setError('Ingresa un correo o telefono valido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.solicitarRecuperacion(normalizedIdentifier);

      if (res.success) {
        if (res.data?.recoveryToken) {
          setRecoveryToken(res.data.recoveryToken);
          setResetChannel(res.data.channel || '');
          setResetDestinationHint(res.data.destinationHint || '');
          setResetCode('');
          setNewPassword('');
          setConfirmPassword('');
          setNotice(res.message || 'Codigo enviado al contacto registrado.');
          setMode('reset');
        } else {
          setNotice(res.message || 'Si existe una cuenta asociada, enviaremos un codigo al contacto registrado.');
        }
      } else {
        setError(res.message || 'No se pudo enviar el codigo.');
      }
    } catch (err) {
      setError('Error inesperado al solicitar recuperacion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
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
      const res = await authService.restablecerPassword(recoveryToken, normalizedCode, newPassword);

      if (res.success) {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleByMode = {
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
            {error && <div className="p-3 bg-red-50 text-syntix-red text-sm rounded-lg border border-red-100">{error}</div>}
            {notice && <div className="p-3 bg-green-50 text-syntix-green text-sm rounded-lg border border-green-100">{notice}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electronico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="admin@empresa.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="••••••••" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo o Telefono</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" required value={resetIdentifier} onChange={e => setResetIdentifier(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="admin@empresa.com o 3001234567" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
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
                {resetChannel === 'sms' ? 'SMS enviado a ' : 'Codigo enviado a '}
                {resetDestinationHint || 'tu contacto registrado'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Codigo</label>
              <input type="text" inputMode="numeric" maxLength={6} required value={resetCode} onChange={e => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900 text-center tracking-[0.45em] font-semibold" placeholder="000000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contrasena</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showNewPassword ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="••••••••" />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contrasena</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showNewPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-syntix-green focus:border-syntix-green outline-none text-gray-900" placeholder="••••••••" />
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
