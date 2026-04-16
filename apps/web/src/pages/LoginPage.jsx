import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Car, Lock, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const result = login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Credenciales inválidas. Intente de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Login | SYNTIX Drive Control</title>
      </Helmet>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-syntix-navy rounded-2xl flex items-center justify-center shadow-lg">
            <Car className="w-8 h-8 text-syntix-green" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          SYNTIX <span className="text-syntix-green">TECH</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Drive Control - Sistema de Gestión de Flotas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-syntix-red/30 text-syntix-red p-3 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-syntix-green focus:border-syntix-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border text-gray-900"
                  placeholder="admin@syntix.tech"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-syntix-green focus:border-syntix-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border text-gray-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-syntix-navy hover:bg-syntix-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-syntix-navy transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}