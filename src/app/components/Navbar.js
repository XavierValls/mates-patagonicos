'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ logoTransparentSrc }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {logoTransparentSrc && (
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src={logoTransparentSrc}
                alt="Mates Patagonicos Logo"
                width={70}
                height={70}
                priority
                className="hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
          )}
        </div>

        <div className="space-x-6 flex items-center">
          <Link href="/productos" className="text-white text-lg font-medium hover:text-teal-100 transition-colors duration-300">
            Productos
          </Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link href="/admin" className="text-white text-lg font-medium hover:text-teal-100 transition-colors duration-300">
                  Admin
                </Link>
              )}
              <Link href="/cart" className="text-white text-lg font-medium hover:text-teal-100 transition-colors duration-300 relative">
                Carrito ({cartItemCount})
              </Link>
              <button
                onClick={logout}
                className="bg-white text-teal-600 px-4 py-2 rounded-full text-lg font-semibold hover:bg-teal-50 hover:text-teal-700 transition-colors duration-300 shadow-md"
              >
                Cerrar Sesion ({user?.email.split('@')[0]})
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white text-lg font-medium hover:text-teal-100 transition-colors duration-300">
                Iniciar Sesion
              </Link>
              <Link href="/register" className="bg-white text-teal-600 px-4 py-2 rounded-full text-lg font-semibold hover:bg-teal-50 hover:text-teal-700 transition-colors duration-300 shadow-md">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
