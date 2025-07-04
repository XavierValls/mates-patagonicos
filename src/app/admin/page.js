'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-gray-600">Verificando permisos...</p>
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
        Panel de Administracion
      </h1>
      <p className="text-center text-lg text-gray-700 mb-8">
        Bienvenido, <span className="font-semibold text-teal-600">{user.email.split('@')[0]}</span>!
        Selecciona una opcion para gestionar tu tienda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <Link href="/admin/products" className="block bg-white rounded-lg shadow-xl p-8 text-center border-l-8 border-teal-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestion de Productos</h2>
          <p className="text-gray-600 mb-4">Anade, edita o elimina productos de tu inventario.</p>
          <span className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300">
            Ir a Productos
          </span>
        </Link>

        <Link href="/admin/users" className="block bg-white rounded-lg shadow-xl p-8 text-center border-l-8 border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestion de Usuarios</h2>
          <p className="text-gray-600 mb-4">Visualiza y gestiona las cuentas de los clientes y administradores.</p>
          <span className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300">
            Ir a Usuarios
          </span>
        </Link>
      </div>

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
