'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../../lib/productService';
import ProductModal from '../../components/ProductModal';
import Image from 'next/image';

export default function AdminProductsPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [productMessage, setProductMessage] = useState('');
  const [productError, setProductError] = useState('');
  const [productsLoading, setProductsLoading] = useState(false);

  const LOCAL_PLACEHOLDER_IMAGE_PATH = '/images/placeholder.png';
  const blurDataUrlBase64 = "data:image/png;base64,iVBORw0KGgoAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/login');
      } else {
        loadProducts();
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  const loadProducts = () => {
    setProductsLoading(true);
    try {
      const fetchedProducts = getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setProductError("No se pudieron cargar los productos.");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
    setProductError('');
    setProductMessage('');
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
    setProductError('');
    setProductMessage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setModalMode('add');
  };

  const handleProductSubmit = (formData) => {
    setProductError('');
    setProductMessage('');

    try {
      if (editingProduct) {
        const updated = updateProduct(editingProduct.id, { ...formData, price: parseFloat(formData.price) });
        if (updated) {
          loadProducts();
          setProductMessage(`Producto "${updated.name}" actualizado con exito.`);
        } else {
          setProductError('Error al actualizar el producto.');
        }
      } else {
        const addedProduct = addProduct({ ...formData, price: parseFloat(formData.price) });
        loadProducts();
        setProductMessage(`Producto "${addedProduct.name}" anadido con exito.`);
      }
    } catch (err) {
      console.error("Error al enviar formulario de producto:", err);
      setProductError('Error al guardar el producto. Por favor, intentalo de nuevo.');
    }
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Estas seguro de que quieres eliminar "${name}"?`)) {
      setProductError('');
      setProductMessage('');
      try {
        deleteProduct(id);
        loadProducts();
        setProductMessage(`Producto "${name}" eliminado con exito.`);
      } catch (err) {
        console.error("Error al eliminar producto:", err);
        setProductError('Error al eliminar el producto. Por favor, intentalo de nuevo.');
      }
    }
  };

  if (loading || productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-gray-600">
          {loading ? "Verificando permisos..." : "Cargando productos..."}
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
    <main className="container mx-auto p-8 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-10 tracking-tight">
        Gestion de Productos
      </h1>
      <p className="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
        Aqui puedes anadir, editar y eliminar productos de tu inventario.
      </p>

      {productError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Error!</p>
          <p>{productError}</p>
        </div>
      )}
      {productMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Exito!</p>
          <p>{productMessage}</p>
        </div>
      )}

      <div className="text-center mb-12">
        <button
          onClick={handleAddClick}
          className="px-8 py-3 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105"
        >
          Anadir Nuevo Producto
        </button>
      </div>

      <section className="bg-white p-8 rounded-xl shadow-2xl border-t-8 border-teal-600">
        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Lista de Productos</h3>
        {products.length === 0 && !productsLoading ? (
          <div className="text-center py-10 text-gray-500 text-xl">
            <p>No hay productos para mostrar aun.</p>
            <p className="mt-2">Anade un nuevo producto usando el boton de arriba!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre y Descripcion
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product) => {
                  const displayImageSrc = product.imageUrl ? `/images/${product.imageUrl}` : LOCAL_PLACEHOLDER_IMAGE_PATH;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-16 w-16 relative rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={displayImageSrc}
                            alt={product.name}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-lg"
                            placeholder="blur"
                            blurDataURL={blurDataUrlBase64}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-base font-medium text-gray-900 mb-1">{product.name}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-800">
                        ${product.price.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold p-2 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="text-red-600 hover:text-red-900 font-semibold p-2 rounded-md hover:bg-red-50 transition-colors duration-200"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productData={editingProduct}
        onSubmit={handleProductSubmit}
        mode={modalMode}
      />
    </main>
  );
}
