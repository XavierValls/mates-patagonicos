'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { fetchAllUsers, updateExistingUserRole, deleteExistingUser } from '../../../lib/authService';

export default function AdminUsersPage() {
  const { user, isAuthenticated, isAdmin, loading, logout, updateUserRole } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [userError, setUserError] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/login');
      } else {
        loadUsers();
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  const loadUsers = () => {
    setUsersLoading(true);
    try {
      const fetchedUsers = fetchAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setUserError("No se pudieron cargar los usuarios.");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUserRoleChange = (userId, newRole) => {
    setUserError('');
    setUserMessage('');
    try {
      const result = updateExistingUserRole(userId, newRole);
      if (result.success) {
        loadUsers();
        setUserMessage(result.message);
        if (user && user.id === userId) {
          updateUserRole(userId, newRole);
        }
      } else {
        setUserError(result.error);
      }
    } catch (err) {
      console.error("Error al actualizar rol:", err);
      setUserError('Error al actualizar el rol. Intenta de nuevo.');
    }
  };

  const handleDeleteUser = (userId, userEmail) => {
    if (window.confirm(`Estas seguro de que quieres eliminar al usuario "${userEmail}"?`)) {
      setUserError('');
      setUserMessage('');
      try {
        const result = deleteExistingUser(userId);
        if (result.success) {
          loadUsers();
          setUserMessage(result.message);
          if (user && user.id === userId) {
            logout();
          }
        } else {
          setUserError(result.error);
        }
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        setUserError('Error al eliminar el usuario. Intenta de nuevo.');
      }
    }
  };

  if (loading || usersLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-gray-600">
          {loading ? "Verificando permisos..." : "Cargando usuarios..."}
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-red-600">Acceso denegado.</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
        Gestion de Usuarios
      </h1>
      <p className="text-center text-lg text-gray-700 mb-8">
        Aqui puedes ver y gestionar las cuentas de usuario.
      </p>

      {userError && <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">{userError}</p>}
      {userMessage && <p className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">{userMessage}</p>}

      {users.length === 0 && !usersLoading ? (
        <p className="text-gray-500">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-8 rounded-lg shadow-xl border-l-8 border-blue-500">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID (Simulado)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={u.role}
                      onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      disabled={user && u.id === user.id}
                    >
                      <option value="client">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 break-all">
                    {u.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(u.id, u.email)}
                      className="text-red-600 hover:text-red-900"
                      disabled={user && u.id === user.id}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {user && user.id && (
          <div className="mt-12 p-6 bg-gray-100 rounded-lg shadow-inner text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Detalles de tu Sesion Actual:</h3>
            <p className="text-gray-600">Email: <span className="font-mono text-blue-700">{user.email}</span></p>
            <p className="text-gray-600">Rol: <span className="font-mono text-purple-700">{user.role}</span></p>
            <p className="text-gray-600 text-sm mt-1">ID: <span className="font-mono text-xs text-gray-500 break-all">{user.id}</span></p>
          </div>
        )}
    </main>
  );
}
