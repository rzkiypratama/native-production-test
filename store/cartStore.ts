import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/productTypes';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.cart.find(item => item.product.id === action.payload.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cart.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productInCart = state.cart.find(item => item.product.id === action.payload);
      if (productInCart && productInCart.quantity > 1) {
        productInCart.quantity -= 1;
      } else {
        state.cart = state.cart.filter(item => item.product.id !== action.payload);
      }
    },
    removeAllFromCart: (state) => {
      state.cart = [];
    },
    removeAllOfProductFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    initializeCart: (state) => {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      state.cart = savedCart;
    }
  },
});

export const { addToCart, removeFromCart, removeAllFromCart, removeAllOfProductFromCart, initializeCart } = cartSlice.actions;
export default cartSlice.reducer;
