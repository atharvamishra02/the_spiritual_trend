import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CurrencyConverter from '../components/CurrencyConverter';
import { useCurrency } from '../context/CurrencyContext';
import HeartIcon from '../components/HeartIcon';

const placeholderImg = 'https://via.placeholder.com/300';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('');
  const sortedProducts = [...products];
  if (sortOption === 'lowToHigh') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'highToLow') {
    sortedProducts.sort((a, b) => b.price - a.price);
  }
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const { currency, convert } = useCurrency();
  const currencySymbols = { USD: '$', INR: '₹', AED: 'د.إ' };

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // Fetch category info
        const catRes = await fetch('/api/homepage/categories');
        const catData = await catRes.json();
        const found = Array.isArray(catData) ? catData.find(c => c.slug === slug) : null;
        setCategory(found);
        // Fetch products for this category (by category name, case-insensitive)
        if (found) {
          const prodRes = await fetch(`/api/products/public/category/${encodeURIComponent(found.name)}`);
          const prodData = await prodRes.json();
          setProducts(Array.isArray(prodData) ? prodData : prodData.products || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-yellow-600 text-xl">Loading...</div>;
  }
  if (!category) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-yellow-500 relative overflow-x-hidden">
      <CurrencyConverter />
      {category.video ? (
        <div className="w-full h-[90vh] overflow-hidden">
          <video
            src={category.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ background: '#000' }}
          />
        </div>
      ) : null}
      <div className={`px-4 ${category.video ? 'py-8' : 'pt-32 pb-20 md:pt-40 md:pb-24'}`}>
        <div className="flex flex-col items-center mb-10"></div>
        {/* Sort Button Dropdown */}
        <div className="flex justify-center mb-6 relative">
          <button
            className="px-6 py-2 rounded-lg font-semibold border border-yellow-500 bg-black text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors duration-200"
            onClick={() => setShowSortDropdown((prev) => !prev)}
          >
            Sort By
          </button>
          {showSortDropdown && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-yellow-500 z-20 min-w-[180px]">
              <button
                className={`block w-full text-left px-4 py-2 rounded-t-lg font-medium transition-colors duration-150 ${sortOption === 'lowToHigh' ? 'bg-yellow-500 text-black' : 'text-stone-900 hover:bg-yellow-100'}`}
                onClick={() => { setSortOption('lowToHigh'); setShowSortDropdown(false); }}
              >
                Price: Low to High
              </button>
              <button
                className={`block w-full text-left px-4 py-2 rounded-b-lg font-medium transition-colors duration-150 ${sortOption === 'highToLow' ? 'bg-yellow-500 text-black' : 'text-stone-900 hover:bg-yellow-100'}`}
                onClick={() => { setSortOption('highToLow'); setShowSortDropdown(false); }}
              >
                Price: High to Low
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {sortedProducts.length === 0 ? (
            <div className="col-span-full text-center text-yellow-400 text-lg py-8">No products found in this category.</div>
          ) : (
            sortedProducts.map(product => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform overflow-hidden relative h-64"
                onClick={() => navigate(`/buyitem/${product._id}`, { state: { product } })}
              >
                <div className="h-40 flex items-center justify-center bg-gray-50 relative border-b border-gray-200">
                  <img
                    src={product.images?.[0]?.url || product.image || placeholderImg}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <HeartIcon product={product} />
                </div>
                <div className="p-3 h-24 flex flex-col justify-between">
                  <div
                    className="text-black font-semibold text-sm text-center line-clamp-2"
                    title={product.name}
                  >
                    {product.name}
                  </div>
                  <div className="text-black font-bold text-sm text-center">
                    {currencySymbols[currency]} {convert(product.price)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Back to Home Button */}
        <div className="flex justify-center mt-10 mb-8">
          <button
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-base sm:text-lg rounded-lg shadow-lg transition-all duration-200"
            onClick={() => navigate("/")}
          >
            🔙 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 