import { create } from 'zustand';
import { Product } from '../types/product';

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  initializeCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: JSON.parse(localStorage.getItem('cart') || '[]'), // Load initial state from localStorage
  addToCart: (product) => set((state) => {
    const updatedCart = [...state.cart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart to localStorage
    return { cart: updatedCart };
  }),
  removeFromCart: (productId) => set((state) => {
    const updatedCart = state.cart.filter((product) => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart to localStorage
    return { cart: updatedCart };
  }),
  initializeCart: () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      set({ cart: JSON.parse(storedCart) });
    }
  },
}));
