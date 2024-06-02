import { create } from 'zustand';
import { Product } from '../types/product';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      const data: Product[] = await response.json();
      set({ products: data });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      set({ isLoading: false });
    }
  },
 addProduct: async (newProduct) => {
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });
    const createdProduct: Product = await response.json();
    set((state) => ({ products: [createdProduct, ...state.products] }));
  } catch (error) {
    console.error('Failed to add product:', error);
  }
},
editProduct: async (product: Product) => {
  try {
    const response = await fetch(`https://api.escuelajs.co/api/v1/products/${product.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    const updatedProduct = await response.json();
    set((state) => ({
      products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    }));
  } catch (error) {
    console.error('Failed to update product:', error);
  }
},
}));
