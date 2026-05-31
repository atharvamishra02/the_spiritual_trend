import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import HeartIcon from '../components/HeartIcon';
import { getProducts } from '../api/productAPI';

const AllProducts = () => {
  const { currency, convert } = useCurrency();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-yellow-600 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 md:pt-40 md:pb-24 text-yellow-600">
      <motion.div
        className="py-2 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold text-center mb-4">
        All Products
        </h1>
        {products.length === 0 ? (
          <div className="text-center text-gray-600 text-xl mt-10">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <motion.div
                key={item._id || item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform relative"
                whileHover={{ scale: 1.05 }}
                onClick={() =>
                  navigate(`/buyitem/${item._id || item.id}`, {
                    state: {
                      product: { ...item, quantity: 1, images: item.images },
                      currency,
                    },
                  })
                }
              >
                <div className="relative">
                  {/* Only use backend images, no static or hardcoded images */}
                  <img
                    src={item.images && item.images[0]?.url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Product+Image";
                    }}
                  />
                  <HeartIcon product={item} />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1 text-black">{item.name}</h2>
                  <p className="text-black font-bold mb-3">
                    {currency} {convert(item.price)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <motion.button
          className="mt-12 mx-auto block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg rounded-lg shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
        >
          🔙 Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AllProducts;
