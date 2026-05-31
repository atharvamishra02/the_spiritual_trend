import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 md:pt-40 md:pb-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
          </div>

          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-yellow-400 mb-4">
              Search Products
            </h1>
            <p className="text-gray-400 text-lg">
              Find your perfect spiritual jewelry and accessories
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for products, categories, or keywords..."
                className="w-full px-6 py-4 text-lg bg-gray-900 border-2 border-yellow-400 rounded-lg focus:outline-none focus:border-yellow-300 text-white placeholder-gray-400"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black p-3 rounded-lg hover:bg-yellow-300 transition-colors"
                disabled={!searchQuery.trim()}
              >
                <FaSearch className="text-xl" />
              </button>
            </div>
          </form>

          {/* Search Suggestions */}
          <div className="text-left">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">
              Popular Searches
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Rings",
                "Necklaces",
                "Bracelets",
                "Earrings",
                "Pendants",
                "Chains",
                "Spiritual",
                "Religious",
                "Traditional",
                "Modern",
                "Gold",
                "Silver"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    navigate(`/search-results?query=${encodeURIComponent(suggestion)}`);
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className="mt-8 text-left">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">
              Search Tips
            </h3>
            <ul className="text-gray-400 space-y-2">
              <li>• Try searching by product type (rings, necklaces, etc.)</li>
              <li>• Search by material (gold, silver, etc.)</li>
              <li>• Use keywords like "spiritual", "religious", "traditional"</li>
              <li>• Search by category or style</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Search; 