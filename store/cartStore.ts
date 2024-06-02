import create from 'zustand';
import { Product } from '../types/productTypes';

interface CartState {
  cart: Array<{ product: Product; quantity: number }>;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  removeAllFromCart: () => void;
  removeAllOfProductFromCart: (id: number) => void;
  initializeCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (product: Product) =>
    set((state) => {
      const existingProduct = state.cart.find((item) => item.product.id === product.id);
      if (existingProduct) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        return { cart: [...state.cart, { product, quantity: 1 }] };
      }
    }),
  removeFromCart: (id: number) =>
    set((state) => {
      const productInCart = state.cart.find((item) => item.product.id === id);
      if (productInCart && productInCart.quantity > 1) {
        // Reduce the quantity by 1
        return {
          cart: state.cart.map((item) =>
            item.product.id === id ? { ...item, quantity: item.quantity - 1 } : item
          ),
        };
      } else {
        // Remove the product from cart
        return {
          cart: state.cart.filter((item) => item.product.id !== id),
        };
      }
    }),
  removeAllFromCart: () =>
    set({
      cart: [],
    }),
  removeAllOfProductFromCart: (id: number) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== id),
    })),
  initializeCart: () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    set({ cart: savedCart });
  },
}));
