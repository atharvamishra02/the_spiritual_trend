import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './features/wishlist/wishlistSlice';
import cartReducer from './features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    cart: cartReducer,
  },
}); 