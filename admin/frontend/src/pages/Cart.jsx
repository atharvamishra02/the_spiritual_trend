import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { BACKEND_URL, API_BASE_URL } from '../utils/config.js';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        };
        const { data } = await axios.get(`${API_BASE_URL}/cart`, config);
        console.log('Cart data:', data); // Debug: check if data is an array
        setCartItems(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        toast.error(err.response?.data?.message || 'Failed to fetch cart items');
      }
    };

    fetchCartItems();

    // --- Real-time updates with Socket.IO ---
    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
      withCredentials: true
    });
    socket.on('notification', (msg) => {
      if (msg.type === 'cart_update') {
        fetchCartItems();
      }
    });
    return () => socket.disconnect();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading cart items...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-yellow-500 p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-yellow-400 drop-shadow-lg">User Carts</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-4 text-yellow-300">No cart items found.</div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((cart) => (
            <div key={cart._id} className="bg-gradient-to-br from-yellow-900 via-black to-black shadow-lg rounded-xl p-6 border-2 border-yellow-700">
              <h2 className="text-2xl font-bold mb-3 text-yellow-300">User: <span className="text-white">{cart.user ? cart.user.name : 'N/A'}</span> <span className="text-yellow-500">({cart.user ? cart.user.email : 'N/A'})</span></h2>
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full bg-black text-yellow-200 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-yellow-700">Product</th>
                      <th className="py-2 px-4 border-b border-yellow-700">Quantity</th>
                      <th className="py-2 px-4 border-b border-yellow-700">Price</th>
                      <th className="py-2 px-4 border-b border-yellow-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => (
                      <tr key={item._id} className="hover:bg-yellow-950 transition">
                        <td className="py-2 px-4 border-b border-yellow-800 font-semibold text-yellow-400">
                          {item.product ? item.product.name : item.name || 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b border-yellow-800">{item.quantity}</td>
                        <td className="py-2 px-4 border-b border-yellow-800">${item.price?.toFixed(2)}</td>
                        <td className="py-2 px-4 border-b border-yellow-800">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right mt-4 text-2xl font-extrabold text-yellow-400">
                Cart Total: <span className="text-yellow-300">${cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;