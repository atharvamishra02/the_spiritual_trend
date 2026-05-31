import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [newSearchQuery, setNewSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query") || "";
    setQuery(q);
    if (q) {
      setLoading(true);
      // Fetch products from backend and filter by query
      fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/products/public`)
        .then((res) => res.json())
        .then((allProducts) => {
          const searchResults = allProducts.filter(product =>
            product.name.toLowerCase().includes(q.toLowerCase()) ||
            product.category.toLowerCase().includes(q.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(q.toLowerCase()))
          );
          setProducts(searchResults);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
          setProducts([]);
          setLoading(false);
        });
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-yellow-400 text-2xl">Searching...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 md:pt-40 md:pb-24 text-white">
      <div className="py-2 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/search')}
          className="mb-6 flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Search</span>
        </button>

        <motion.h1 
          className="text-4xl font-bold text-center mb-4 text-yellow-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🔍 Search Results for "{query}"
        </motion.h1>

        {/* New Search Bar */}
        <motion.div 
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            if (newSearchQuery.trim()) {
              navigate(`/search-results?query=${encodeURIComponent(newSearchQuery.trim())}`);
            }
          }}>
            <div className="relative">
              <input
                type="text"
                value={newSearchQuery}
                onChange={(e) => setNewSearchQuery(e.target.value)}
                placeholder="Search for something else..."
                className="w-full px-4 py-2 bg-gray-900 border-2 border-yellow-400 rounded-lg focus:outline-none focus:border-yellow-300 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black p-2 rounded-lg hover:bg-yellow-300 transition-colors"
                disabled={!newSearchQuery.trim()}
              >
                <FaSearch />
              </button>
            </div>
          </form>
        </motion.div>
        
        {/* Results Count */}
        {products.length > 0 && (
          <motion.p 
            className="text-center text-gray-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Found {products.length} product{products.length !== 1 ? 's' : ''}
          </motion.p>
        )}
        
        {products.length === 0 ? (
          <motion.div 
            className="text-center text-gray-400 text-xl mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="mb-4">No results found for "{query}"</p>
            <p className="text-sm text-gray-500">Try different keywords or check the spelling</p>
            <button
              onClick={() => navigate('/search')}
              className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Try Another Search
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {products.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform relative h-64"
                onClick={() =>
                  navigate(`/buyitem/${item._id}`, {
                    state: {
                      product: { ...item, quantity: 1, images: item.images },
                    },
                  })
                }
              >
                <div className="relative border-b border-gray-200">
                  <img
                    src={item.images && item.images[0]?.url ? item.images[0].url : "/src/assets/user.png"}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = "/src/assets/user.png";
                    }}
                  />
                </div>
                <div className="p-3 h-24 flex flex-col justify-between">
                  <h2 className="text-sm font-semibold text-black line-clamp-2">{item.name}</h2>
                  <p className="text-gray-600 text-xs">{item.category}</p>
                  <p className="text-black font-bold text-sm">
                    ₹ {item.price}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
        <motion.button
          className="mt-12 mx-auto block px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-lg rounded-lg shadow-lg transition-colors"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔙 Back to Home
        </motion.button>
      </div>
    </div>
  );
};

export default SearchResults; 