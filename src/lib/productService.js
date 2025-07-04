const PRODUCTS_KEY = 'matesPatagonicos_products';

const initialProducts = [
  {
    id: 'prod-1',
    name: 'Mate Imperial Premium',
    description: 'Un mate de calabaza forrado en cuero, con virola de alpaca cincelada a mano. La eleccion perfecta para los conocedores. Pieza unica y de gran durabilidad.',
    price: 35000,
    imageUrl: 'mate-imperial.jpg',
  },
  {
    id: 'prod-2',
    name: 'Bombilla Pico de Loro',
    description: 'Bombilla de alpaca con diseno clasico "pico de loro". Filtro removible para una limpieza facil y eficiente. Ideal para mates grandes.',
    price: 8000,
    imageUrl: 'bombilla.jpg',
  },
  {
    id: 'prod-3',
    name: 'Termo Stanley Clasico 1L',
    description: 'El iconico termo Stanley, mantiene tus bebidas calientes o frias por hasta 24 horas. Construccion robusta de acero inoxidable, garantia de por vida.',
    price: 75000,
    imageUrl: 'termo.jpeg',
  },
  {
    id: 'prod-4',
    name: 'Mate Camionero Personalizado',
    description: 'Mate de calabaza forrado en cuero grueso, ideal para el uso diario. Posibilidad de grabar iniciales o un diseno personalizado.',
    price: 28000,
    imageUrl: 'mate-camionero.jpg',
  },
  {
    id: 'prod-5',
    name: 'Yerbera y Azucarera Set',
    description: 'Elegante set de yerbera y azucarera de cuero. Perfectas para mantener tu yerba y azucar frescas y ordenadas. Incluye cuchara dosificadora.',
    price: 15000,
    imageUrl: 'yerbero-azucarero.jpg',
  },
  {
    id: 'prod-6',
    name: 'Kit Matero Completo',
    description: 'Incluye mate de madera, bombilla de acero inoxidable y un termo de 750ml. Todo lo que necesitas para empezar a materar!',
    price: 60000,
    imageUrl: 'kit-completo.png',
  },
];

export const getProducts = () => {
  if (typeof window === 'undefined') return [];
  const storedProducts = localStorage.getItem(PRODUCTS_KEY);
  if (storedProducts) {
    try {
      return JSON.parse(storedProducts);
    } catch (e) {
      console.error("Error al parsear productos de localStorage:", e);
      localStorage.removeItem(PRODUCTS_KEY);
      saveProducts(initialProducts);
      return initialProducts;
    }
  }
  saveProducts(initialProducts);
  return initialProducts;
};

export const saveProducts = (products) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (newProduct) => {
  const products = getProducts();
  const productWithId = {
    ...newProduct,
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  products.push(productWithId);
  saveProducts(products);
  return productWithId;
};

export const updateProduct = (id, updatedFields) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index > -1) {
    products[index] = { ...products[index], ...updatedFields };
    saveProducts(products);
    return products[index];
  }
  return null;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  saveProducts(filteredProducts);
  return filteredProducts;
};
