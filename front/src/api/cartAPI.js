import axios from '../utils/axios';

export const getMyCart = async () => {
  const { data } = await axios.get('/api/cart/me');
  return data;
};

export const removeFromCart = async (productId) => {
  await axios.delete(`/api/cart/remove/${productId}`);
};

export const addToCart = async (product) => {
  const { data } = await axios.post('/api/cart/add', {
    productId: product.productId || product._id || product.id,  // Use the correct productId
    name: product.name,
    price: product.price,
    quantity: product.quantity || 1,
  });
  return data;
};
