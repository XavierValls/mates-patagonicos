'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductModal({ isOpen, onClose, productData, onSubmit, mode = 'view' }) {
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '', 
  });
  const [error, setError] = useState('');
  const [addToCartMessage, setAddToCartMessage] = useState('');

  const LOCAL_PLACEHOLDER_IMAGE_PATH = '/images/placeholder.png'; 

  useEffect(() => {
    if (isOpen) {
      if (productData) {
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price ? productData.price.toString() : '',
          imageUrl: productData.imageUrl || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          imageUrl: '',
        });
      }
      setError('');
      setAddToCartMessage('');
    }
  }, [isOpen, productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode !== 'view') {
      if (!formData.name || !formData.price) {
        setError('Nombre y precio son obligatorios.');
        return;
      }
      onSubmit({ ...formData }); 
    }
    onClose();
  };

  const handleAddToCart = () => {
    if (authLoading) {
      alert('Verificando tu estado de sesion. Por favor, intentalo de nuevo en un momento.');
      return;
    }

    if (!user) { 
      alert('Debes iniciar sesion para agregar productos al carrito.'); 
      router.push('/login'); 
      return; 
    }

    if (productData) {
      addToCart(productData);
      setAddToCartMessage(`"${productData.name}" agregado al carrito!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  const isEditable = mode === 'add' || mode === 'edit';

  const displayImageSrc = formData.imageUrl ? `/images/${formData.imageUrl}` : LOCAL_PLACEHOLDER_IMAGE_PATH;
  const blurDataUrlBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative transform transition-all duration-300 scale-100 opacity-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {mode === 'add' ? 'Anadir Nuevo Producto' : mode === 'edit' ? 'Editar Producto' : 'Detalles del Producto'}
        </h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
            <p className="font-bold">Error!</p>
            <p>{error}</p>
          </div>
        )}

        {isEditable ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md mb-6">
              <Image
                src={displayImageSrc}
                alt={formData.name || "Producto"}
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-300 hover:scale-105"
                placeholder="blur"
                blurDataURL={blurDataUrlBase64}
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Nombre de Archivo de Imagen (ej: mate.jpg)</label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-900 transition-colors duration-200"
                placeholder="Ej: mate_imperial.jpg"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-900 transition-colors duration-200"
                placeholder="Ej: Mate Imperial"
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-900 transition-colors duration-200"
                step="0.01"
                placeholder="Ej: 35000.00"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-gray-900 transition-colors duration-200"
                placeholder="Una descripcion detallada del producto..."
              ></textarea>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button
                type="submit"
                className="px-8 py-3 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105"
              >
                {mode === 'edit' ? 'Actualizar Producto' : 'Anadir Producto'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 border border-gray-300 text-lg font-semibold rounded-full shadow-lg text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            {addToCartMessage && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded-md shadow-sm text-base font-medium">
                {addToCartMessage}
              </div>
            )}
            <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg mx-auto mb-6">
              <Image
                src={displayImageSrc}
                alt={formData.name || "Producto"}
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-300 hover:scale-105"
                placeholder="blur"
                blurDataURL={blurDataUrlBase64}
              />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{formData.name}</h3>
            <p className="text-3xl font-bold text-red-600 mb-4">${parseFloat(formData.price).toLocaleString('es-AR')}</p>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap px-4">{formData.description}</p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
              <button
                onClick={handleAddToCart}
                className="px-8 py-3 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
              >
                Agregar al Carrito
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 border border-gray-300 text-lg font-semibold rounded-full shadow-lg text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
