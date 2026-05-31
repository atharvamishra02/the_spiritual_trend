import { createContext, useContext, useState, useEffect } from 'react';
import { getMyCart, addToCart as apiAddToCart } from '../api/cartAPI';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Helper to fetch product image by productId
  const fetchProductImage = async (productId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/products/public/${productId}`);
      if (!res.ok) return null;
      const product = await res.json();
      return product.image || (product.images && product.images[0] && product.images[0].url) || null;
    } catch {
      return null;
    }
  };

  const loadUserCart = async () => {
    try {
      const userCart = await getMyCart();
      if (!userCart || userCart.length === 0) {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        return;
      }
      const cartWithImages = await Promise.all(userCart.map(async (item) => {
        if (!item.image) {
          const image = await fetchProductImage(item.productId);
          return { ...item, image };
        }
        return item;
      }));
      setCartItems(cartWithImages);
      localStorage.setItem('cartItems', JSON.stringify(cartWithImages));
    } catch (error) {
      const savedCart = localStorage.getItem('cartItems');
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    }
  };

  // Add to cart and sync state
  const addToCartAndSync = async (product) => {
    await apiAddToCart(product);
    await loadUserCart();
  };

  useEffect(() => {
    loadUserCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCartAndSync }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export { CartContext };