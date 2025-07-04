'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { getProducts } from '../../lib/productService';

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = () => {
      setDataLoading(true);
      setError('');
      try {
        const fetchedProducts = getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setDataLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleViewProductClick = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProduct(null);
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
        Explora Nuestra Coleccion
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={product.imageUrl}
            onClick={() => handleViewProductClick(product)}
          />
        ))}
        {products.length === 0 && (
          <p className="col-span-full text-center text-gray-500 text-lg">No hay productos disponibles.</p>
        )}
      </div>

      <ProductModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        productData={selectedProduct}
        mode="view"
      />
    </main>
  );
}
