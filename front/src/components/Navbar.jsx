import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaShoppingCart, FaHeart, FaSearch, FaBars, FaChevronDown } from "react-icons/fa";
import { getCategories } from '../api/productAPI';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isHomePage = location.pathname === "/";
  const isLightPage = !isHomePage && (
    location.pathname.includes("/category/") || 
    location.pathname.includes("/support")
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [jewelleryOpen, setJewelleryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const navBgClass = isScrolled
    ? 'bg-black shadow-md border-b border-yellow-500/10'
    : 'bg-transparent';

  const textColorClass = isScrolled
    ? 'text-yellow-500'
    : isLightPage
      ? 'text-zinc-950 [text-shadow:_0_1px_2px_rgba(255,255,255,0.7)] font-semibold'
      : 'text-yellow-500 [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)]';

  // Calculate total cart items (count unique items, not quantities)
  const cartItemCount = cartItems.length;
  const wishlistItemCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    }).catch(() => {
      setCategories([]);
    });
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOpen && !event.target.closest('.search-dropdown')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass} ${textColorClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single navbar section - Logo, Navigation, and Icons */}
        <div className="flex items-center justify-between h-20 md:h-28">
          {/* Left side - Logo (Desktop) */}
          <div className="flex items-center">
            <Link to="/" className="hidden md:block text-2xl font-bold">
              The Spiritual Trend
            </Link>
          </div>

          {/* Center - Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-lg font-semibold transition-colors ${
              isScrolled ? 'hover:text-yellow-300' : 'hover:text-yellow-300'
            }`}>Home</Link>
            <Link to="/about" className={`text-lg font-semibold transition-colors ${
              isScrolled ? 'hover:text-yellow-300' : 'hover:text-yellow-300'
            }`}>About</Link>
            {/* Jewellery Dropdown Desktop */}
            <div className="relative group">
              <button className={`text-lg font-semibold flex items-center gap-1 bg-transparent border-none outline-none focus:outline-none transition-colors ${
                isScrolled ? 'hover:text-yellow-300' : 'hover:text-yellow-300'
              }`}>
                Jewellery <FaChevronDown className="mt-1" />
              </button>
              <div className="absolute left-0 top-full pt-2 w-40 z-50 flex flex-col opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                <div className="bg-black/95 backdrop-blur-md border border-yellow-500/20 rounded-xl shadow-2xl flex flex-col py-1.5 overflow-hidden">
                  {categories.map(cat => (
                    <Link
                      key={cat._id || cat.slug || cat.name}
                      to={`/category/${cat.slug || cat.name}`}
                      className="px-4 py-2 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-200 text-sm font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* Help Dropdown Desktop */}
            <div className="relative group">
              <button className={`text-lg font-semibold flex items-center gap-1 bg-transparent border-none outline-none focus:outline-none transition-colors ${
                isScrolled ? 'hover:text-yellow-300' : 'hover:text-yellow-300'
              }`}>
                Help <FaChevronDown className="mt-1" />
              </button>
              <div className="absolute left-0 top-full pt-2 w-32 z-50 flex flex-col opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
                <div className="bg-black/95 backdrop-blur-md border border-yellow-500/20 rounded-xl shadow-2xl flex flex-col py-1.5 overflow-hidden">
                  <Link to="/support/returns" className="px-4 py-2 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-200 text-sm font-medium">Returns</Link>
                  <Link to="/support/shipping-info" className="px-4 py-2 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-200 text-sm font-medium">Shipping</Link>
                  <Link to="/support" className="px-4 py-2 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-200 text-sm font-medium">Support</Link>
                  <Link to="/support/help-center" className="px-4 py-2 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-200 text-sm font-medium">Help Center</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-0 bg-transparent border-none outline-none focus:outline-none hover:scale-110 transition-transform"
                style={{ boxShadow: 'none' }}
              >
                <FaSearch className="text-xl" />
              </button>
              
              {/* Search Dropdown */}
              {searchOpen && (
                <div className="search-dropdown absolute right-0 top-12 w-80 bg-black border border-yellow-400 rounded-lg shadow-lg z-50 p-4">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      setSearchOpen(false);
                      navigate(`/search-results?query=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-4 py-2 bg-gray-900 border border-yellow-400 rounded-lg focus:outline-none focus:border-yellow-300 text-white placeholder-gray-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black p-1 rounded hover:bg-yellow-300 transition-colors"
                        disabled={!searchQuery.trim()}
                      >
                        <FaSearch className="text-sm" />
                      </button>
                    </div>
                  </form>
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <Link to="/wishlist" className={`relative transition-colors ${
              isScrolled ? 'hover:text-red-400' : 'hover:text-red-400'
            }`}>
              <FaHeart className={`text-xl ${isScrolled ? 'text-red-500' : 'text-red-500'}`} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className={`relative transition-colors ${
              isScrolled ? 'hover:text-yellow-300' : 'hover:text-yellow-300'
            }`}>
              <FaShoppingCart className="text-xl" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => navigate("/profile")}
              className="p-0 bg-transparent border-none outline-none focus:outline-none hover:scale-110 transition-transform"
              style={{ boxShadow: 'none' }}
            >
              {user && user.profileImage ? (
                <img 
                  src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${user.profileImage}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <FaUser className={`${user && user.profileImage ? 'hidden' : 'block'} w-10 h-10 p-2 bg-yellow-400/20 rounded-full border border-yellow-400`} />
            </button>
          </div>

          {/* Mobile: Hamburger + Logo + Right Icons */}
          <div className="w-full flex items-center justify-between md:hidden mt-2">
            {/* Hamburger for mobile */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mr-2 p-0 bg-transparent border-none outline-none focus:outline-none"
                style={{ boxShadow: 'none' }}
              >
                <FaBars size={20} />
              </button>
              <Link to="/" className="text-lg font-bold tracking-wide text-yellow-400 whitespace-nowrap">
                The Spiritual Trend
              </Link>
            </div>
            {/* Mobile right icons */}
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/search")}
                className="p-0 bg-transparent border-none outline-none focus:outline-none relative"
                style={{ boxShadow: 'none' }}>
                <FaSearch />
              </button>
              <button onClick={() => navigate("/wishlist")}
                className="p-0 bg-transparent border-none outline-none focus:outline-none relative"
                style={{ boxShadow: 'none' }}>
                <FaHeart className="text-red-500" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                  </span>
                )}
              </button>
              <button onClick={() => navigate("/cart")}
                className="p-0 bg-transparent border-none outline-none focus:outline-none relative"
                style={{ boxShadow: 'none' }}>
                <FaShoppingCart />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
              <button onClick={() => navigate("/profile")}
                className="p-0 bg-transparent border-none outline-none focus:outline-none hover:scale-110 transition-transform"
                style={{ boxShadow: 'none' }}
              >
                {user && user.profileImage ? (
                  <img 
                    src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${user.profileImage}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <FaUser className={`${user && user.profileImage ? 'hidden' : 'block'} w-8 h-8 p-1 bg-yellow-400/20 rounded-full border border-yellow-400`} />
              </button>
            </div>
          </div>
        </div>



        {/* Hamburger Menu Drawer for mobile */}
        {mobileMenuOpen && (
          <div className={`absolute left-2 top-full mt-2 w-60 rounded-lg shadow-lg z-50 flex flex-col py-2 animate-fade-in md:hidden ${
            isScrolled ? 'bg-black border border-yellow-400' : 'bg-black border border-yellow-400'
          }`}>
            <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-yellow-400/20 hover:text-yellow-300`} onClick={() => setMobileMenuOpen(false)}><span>Home</span></Link>
            <Link to="/about" className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-yellow-400/20 hover:text-yellow-300`} onClick={() => setMobileMenuOpen(false)}><span>About</span></Link>
            {/* Jewellery Dropdown */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded w-full text-left bg-transparent border-none outline-none focus:outline-none hover:bg-yellow-400/20 hover:text-yellow-300`}
              onClick={() => setJewelleryOpen((prev) => !prev)}
            >
              <span>Jewellery</span>
              <FaChevronDown className={`transition-transform ${jewelleryOpen ? 'rotate-180' : ''}`} />
            </button>
            {jewelleryOpen && (
              <div className="ml-6 flex flex-col gap-1">
                {categories.map(cat => (
                  <Link
                    key={cat._id || cat.slug || cat.name}
                    to={`/category/${cat.slug || cat.name}`}
                    className={`px-4 py-2 rounded hover:bg-yellow-400/20 hover:text-yellow-300`}
                    onClick={() => { setMobileMenuOpen(false); setJewelleryOpen(false); }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
            {/* Help Dropdown */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded w-full text-left bg-transparent border-none outline-none focus:outline-none hover:bg-yellow-400/20 hover:text-yellow-300`}
              onClick={() => setHelpOpen((prev) => !prev)}
            >
              <span>Help</span>
              <FaChevronDown className={`transition-transform ${helpOpen ? 'rotate-180' : ''}`} />
            </button>
            {helpOpen && (
              <div className="ml-6 flex flex-col gap-1">
                <Link to="/support/returns" className={`px-4 py-2 rounded hover:bg-yellow-400/20 hover:text-yellow-300`} onClick={() => { setMobileMenuOpen(false); setHelpOpen(false); }}>Returns</Link>
                <Link to="/support/shipping-info" className={`px-4 py-2 rounded hover:bg-yellow-400/20 hover:text-yellow-300`} onClick={() => { setMobileMenuOpen(false); setHelpOpen(false); }}>Shipping</Link>
                <Link to="/support" className={`px-4 py-2 rounded hover:bg-yellow-400/20 hover:text-yellow-300`} onClick={() => { setMobileMenuOpen(false); setHelpOpen(false); }}>Support</Link>
                <Link to="/support/help-center" className={`px-4 py-2 rounded hover:bg-yellow-400/20 hover:text-yellow-300`} onClick={() => { setMobileMenuOpen(false); setHelpOpen(false); }}>Help Center</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
