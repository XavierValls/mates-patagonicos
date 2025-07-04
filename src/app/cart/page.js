'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const LOCAL_PLACEHOLDER_IMAGE_PATH = '/images/placeholder.png';
  const blurDataUrlBase64 = "data:image/png;base64,iVBORw0KGgoAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    setCheckoutMessage('');
    setCheckoutError('');

    if (authLoading) {
      setCheckoutError('Verificando tu estado de sesion. Por favor, intentalo de nuevo.');
      return;
    }

    if (!isAuthenticated) {
      setCheckoutError('Debes iniciar sesion para proceder con la compra.');
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError('Tu carrito esta vacio. Agrega productos antes de comprar.');
      return;
    }

    setCheckoutMessage('Procesando tu compra...');
    setTimeout(() => {
      console.log('Compra simulada:', cartItems);
      clearCart();
      setCheckoutMessage('Compra realizada con exito! Tu carrito ha sido vaciado.');
    }, 2000);
  };

  return (
    <main className="container mx-auto p-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-10 tracking-tight">
        Tu Carrito de Compras
      </h1>

      {checkoutError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Error!</p>
          <p>{checkoutError}</p>
        </div>
      )}
      {checkoutMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Exito!</p>
          <p>{checkoutMessage}</p>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-xl">
          <p>Tu carrito esta vacio.</p>
          <p className="mt-2">Explora nuestros <a href="/productos" className="text-teal-600 hover:underline">productos</a> y agrega algunos mates!</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="lg:w-2/3 bg-white p-8 rounded-xl shadow-2xl border-t-8 border-teal-600">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Articulos en tu Carrito</h2>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => {
                const displayImageSrc = item.imageUrl ? `/images/${item.imageUrl}` : LOCAL_PLACEHOLDER_IMAGE_PATH;

                return (
                  <div key={item.id} className="flex items-center py-4">
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden shadow-md mr-6">
                      <Image
                        src={displayImageSrc}
                        alt={item.name}
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                        placeholder="blur"
                        blurDataURL={blurDataUrlBase64}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.description.substring(0, 70)}...</p>
                      <span className="text-xl font-bold text-teal-600 block mt-2">${item.price.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex items-center ml-auto">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="bg-gray-100 text-gray-800 px-4 py-1 border-t border-b border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 transition-colors duration-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors duration-300 shadow-md"
              >
                Vaciar Carrito
              </button>
            </div>
          </section>

          <section className="lg:w-1/3 bg-white p-8 rounded-xl shadow-2xl border-t-8 border-blue-600 h-fit">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Resumen de Compra</h2>
            <div className="flex justify-between items-center text-xl font-semibold text-gray-700 mb-4">
              <span>Subtotal:</span>
              <span>${calculateTotal().toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-semibold text-gray-700 mb-6">
              <span>Envio:</span>
              <span>Gratis</span>
            </div>
            <div className="border-t-2 border-gray-200 pt-6 flex justify-between items-center text-3xl font-extrabold text-teal-700">
              <span>Total:</span>
              <span>${calculateTotal().toLocaleString('es-AR')}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-8 w-full bg-green-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-green-700 transition-colors duration-300 shadow-lg transform hover:scale-105"
            >
              Proceder al Pago
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
