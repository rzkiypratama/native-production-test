import { create } from 'zustand';
import axios from 'axios';
import { Product } from '../types/productTypes';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/products');
      set({ products: response.data });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      set({ isLoading: false });
    }
  },
 addProduct: async (newProduct) => {
  try {
    const response = await axios.post('https://api.escuelajs.co/api/v1/products', newProduct);
    const createdProduct: Product = response.data;
    set((state) => ({ products: [createdProduct, ...state.products] }));
  } catch (error) {
    console.error('Failed to add product:', error);
  }
},
editProduct: async (product: Product) => {
    try {
      const { id, title, description, price } = product;
      const response = await axios.put(`https://api.escuelajs.co/api/v1/products/${id}`, {
        title,
        description,
        price,
      });

      if (!response.status) {
        console.error('Failed to update product:', response.data);
        throw new Error(`Failed to update product: ${response.data.message}`);
      }

      const updatedProduct: Product = response.data;
      set((state) => ({
        products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
      }));
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  },
}));
