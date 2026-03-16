import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('syntix_user', null);
  const [usersDb, setUsersDb] = useLocalStorage('syntix_users_db', []);

  const register = (email, password, empresa, telefono) => {
    if (usersDb.find(u => u.email === email)) {
      return { success: false, message: 'El correo ya está registrado' };
    }
    const newUser = { email, password, empresa, telefono, role: 'admin' };
    setUsersDb([...usersDb, newUser]);
    setUser({ email, empresa, telefono, role: 'admin' });
    return { success: true };
  };

  const login = (email, password) => {
    const foundUser = usersDb.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPass } = foundUser;
      setUser(userWithoutPass);
      return { success: true };
    }
    // Fallback mock for testing if db is empty
    if (email === 'admin@syntix.tech' && password === 'admin123') {
      setUser({ email, empresa: 'SYNTIX Demo', telefono: '3000000000', role: 'admin' });
      return { success: true };
    }
    return { success: false, message: 'Credenciales inválidas' };
  };

  const updateUser = (newEmail, newPassword) => {
    if (!user) return { success: false, message: 'No hay usuario autenticado' };
    
    const updatedUsersDb = usersDb.map(u => {
      if (u.email === user.email) {
        return { ...u, email: newEmail || u.email, password: newPassword || u.password };
      }
      return u;
    });
    
    setUsersDb(updatedUsersDb);
    setUser({ ...user, email: newEmail || user.email });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);