'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  registerUser,
  loginUser,
  logoutUser,
  getSessionUser,
  updateExistingUserRole,
  deleteExistingUser
} from '../../lib/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getSessionUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const register = async (email, password) => {
    const result = await registerUser(email, password);
    if (result.success) {
      setUser(result.user);
      console.log("Sesion iniciada (simulada) para:", result.user.email, "Rol:", result.user.role);
    }
    return result;
  };

  const login = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.success) {
      setUser(result.user);
      console.log("Sesion iniciada (simulada) para:", result.user.email, "Rol:", result.user.role);
    }
    return result;
  };

  const logout = async () => {
    const result = await logoutUser();
    if (result.success) {
      setUser(null);
      console.log("Sesion cerrada (simulada).");
      router.push('/');
    }
    return result;
  };

  const getAllUsersFromService = () => {
    return updateExistingUserRole(null);
  };

  const updateUserRoleInContext = (userId, newRole) => {
    const result = updateExistingUserRole(userId, newRole);
    if (result.success && user && user.id === userId) {
      setUser({ ...user, role: newRole });
    }
    return result;
  };

  const deleteUserInContext = (userIdToDelete) => {
    const result = deleteExistingUser(userIdToDelete);
    if (result.success && user && user.id === userIdToDelete) {
      logout();
    }
    return result;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user && user.role === 'admin',
    register,
    login,
    logout,
    getAllUsers: getAllUsersFromService,
    updateUserRole: updateUserRoleInContext,
    deleteUser: deleteUserInContext,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
