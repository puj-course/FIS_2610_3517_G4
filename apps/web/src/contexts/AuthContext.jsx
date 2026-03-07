// Importa React y hooks necesarios
import React, { createContext, useContext } from 'react';

// Hook personalizado para guardar datos en localStorage
import { useLocalStorage } from '@/hooks/useLocalStorage.js';


// Crea el contexto de autenticacion
const AuthContext = createContext(null);


// Provider que envuelve la aplicacion
export function AuthProvider({ children }) {

  // Usuario actual guardado en localStorage
  const [user, setUser] = useLocalStorage('syntix_user', null);

  // Base de datos local de usuarios
  const [usersDb, setUsersDb] = useLocalStorage('syntix_users_db', []);


  // Funcion para registrar usuarios
  const register = (email, password, empresa, telefono) => {

    // Verifica si el correo ya existe
    if (usersDb.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Crea el nuevo usuario
    const newUser = { email, password, empresa, telefono, role: 'admin' };

    // Guarda el usuario en la base local
    setUsersDb([...usersDb, newUser]);

    // Inicia sesion automaticamente
    setUser({ email, empresa, telefono, role: 'admin' });

    return { success: true };
  };


  // Funcion de login
  const login = (email, password) => {

    // Busca usuario en la base local
    const foundUser = usersDb.find(
      u => u.email === email && u.password === password
    );

    // Si existe inicia sesion
    if (foundUser) {

      // Elimina password antes de guardar en estado
      const { password: _, ...userWithoutPass } = foundUser;

      setUser(userWithoutPass);

      return { success: true };
    }

    // Usuario mock para pruebas
    if (email === 'admin@syntix.tech' && password === 'admin123') {

      setUser({
        email: 'admin@syntix.tech',
        empresa: 'SYNTIX Demo',
        telefono: '3000000000',
        role: 'admin'
      });

      return { success: true };
    }

    return { success: false, message: 'Invalid credentials' };
  };


  // Actualiza datos del usuario
  const updateUser = (newEmail, newPassword) => {

    if (!user) {
      return { success: false, message: 'No authenticated user' };
    }

    // Actualiza usuario en la base local
    const updatedUsersDb = usersDb.map(u => {

      if (u.email === user.email) {
        return {
          ...u,
          email: newEmail || u.email,
          password: newPassword || u.password
        };
      }

      return u;
    });

    setUsersDb(updatedUsersDb);

    // Actualiza usuario en sesion
    setUser({ ...user, email: newEmail || user.email });

    return { success: true };
  };


  // Funcion logout
  const logout = () => {
    setUser(null);
  };


  // Valores que se comparten en el contexto
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateUser,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);