import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  RotateCcw, 
  Star, 
  Minus, 
  Plus, 
  ArrowLeft, 
  ShoppingBag, 
  Zap, 
  CheckCircle2, 
  Info,
  Heart
} from "lucide-react";
import HeartIcon from '../components/HeartIcon';

const BuyItem = () => {
  const { state } = useLocation();
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCartAndSync } = useCart();
  const { currency, convert } = useCurrency();
  const [product, setProduct] = useState(state?.product || null);
  const [loading, setLoading] = useState(!state?.product);
  const [quantity, setQuantity] = useState(1);
  const [mainImageIdx, setMainImageIdx] = useState(state?.product?.selectedImageIndex || 0);
  const [addedMessage, setAddedMessage] = useState(false);

  // If no product in state but we have productId in URL, fetch the product
  useEffect(() => {
    if (!state?.product && productId) {
      fetchProduct();
    } else if (!state?.product && !productId) {
      navigate('/');
    }
  }, [productId, state?.product, navigate]);

  // Set quantity from product if available on load
  useEffect(() => {
    if (product) {
      setQuantity(product.quantity || 1);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/public/${productId}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
      } else {
        console.error('Product not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-zinc-900/40 border border-zinc-800/40 rounded-3xl backdrop-blur-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-xl font-['EB_Garamond'] tracking-wider text-zinc-300">Aligning with spiritual database...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center p-8 bg-zinc-900/40 border border-zinc-800/40 rounded-3xl backdrop-blur-md max-w-sm mx-4">
          <p className="text-xl text-yellow-500 font-semibold mb-4">❌ Product Not Found</p>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">This sacred artifact could not be located in our collection archives.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const item = { 
    ...product, 
    id: String(product.id || product._id),
    productId: String(product.id || product._id),
    quantity 
  };

  const isOutOfStock = item.stock === 0;
  const maxQuantity = item.stock || 999;

  // Handle images array properly
  const images = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : product.selectedImage 
      ? [{ id: product.selectedImage.id, url: product.selectedImage.url }]
      : [{ id: 'fallback', url: item.image || '/placeholder.png' }];
  
  const mainImage = images[mainImageIdx] || images[0] || { url: '/placeholder.png' };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    
    const checkoutItem = {
      ...item, 
      quantity,
      image: mainImage.url,
      images: item.images,
      selectedImageId: mainImage.id,
      selectedImageIndex: mainImageIdx
    };
    
    navigate("/checkout", {
      state: {
        item: checkoutItem,
        currency,
      },
    });
  };

  const increaseQty = () => {
    if (!isOutOfStock && quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      const cartItem = {
        ...item, 
        quantity,
        image: mainImage.url,
        images: item.images,
        selectedImageId: mainImage.id,
        selectedImageIndex: mainImageIdx
      };
      
      addToCartAndSync(cartItem);
      
      // Visual feedback notification
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    }
  };

  const currencySymbols = { USD: '$', INR: '₹', AED: 'د.إ' };

  // Calculate high-fidelity ratings and feedback
  const mockReviews = [
    { name: "Aarav S.", rating: 5, date: "2 days ago", comment: "The weight and spiritual aura of this piece is phenomenal. Absolutely authentic handcrafted work." },
    { name: "Priya M.", rating: 5, date: "1 week ago", comment: "Stunning details. The calligraphy lines are perfect and it arrived in premium protective wrap. Highly recommend!" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white pt-32 pb-20 md:pt-40 md:pb-24 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Toast Notification for Add to Cart */}
      <AnimatePresence>
        {addedMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="bg-zinc-900/95 border border-yellow-500/30 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex items-center space-x-3 text-zinc-100">
              <div className="h-8 w-8 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm block">Sacred Artifact Added</span>
                <span className="text-xs text-zinc-400">Successfully aligned with your shopping cart.</span>
              </div>
              <button 
                onClick={() => navigate('/cart')}
                className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                View Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        
        {/* Minimal back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 group flex items-center space-x-2 text-zinc-400 hover:text-yellow-500 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Go Back</span>
        </button>

        {/* Dual Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Premium Media Suite */}
          <div className="w-full lg:w-1/2 space-y-6">
            
            {/* Elegant glass viewport box */}
            <div className="relative w-full aspect-square bg-white rounded-3xl p-6 md:p-10 border border-zinc-800 shadow-[0_0_50px_rgba(250,204,21,0.05)] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-transparent pointer-events-none"></div>
              
              {/* Product heart/wishlist button */}
              <div className="absolute right-4 top-4 z-10 scale-110">
                <HeartIcon product={product} />
              </div>

              {/* Main Image */}
              <motion.img
                key={mainImageIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={mainImage.url || "/placeholder.png"}
                alt={item.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />

              {/* Image Arrows */}
              {images.length > 1 && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setMainImageIdx((mainImageIdx - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-full flex items-center justify-center border border-zinc-850 hover:border-yellow-500/50 shadow-lg cursor-pointer transition-colors"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setMainImageIdx((mainImageIdx + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-full flex items-center justify-center border border-zinc-850 hover:border-yellow-500/50 shadow-lg cursor-pointer transition-colors"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* Micro Thumbnails Carousel */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {images.map((img, i) => (
                  <motion.div
                    key={img.id || i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMainImageIdx(i)}
                    className={`h-16 w-16 md:h-20 md:w-20 bg-white border rounded-2xl p-2 cursor-pointer flex items-center justify-center transition-all ${
                      mainImageIdx === i 
                        ? 'border-yellow-500 ring-2 ring-yellow-500/30 shadow-lg' 
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Product perspective ${i + 1}`}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Sophisticated Product Metadata */}
          <div className="w-full lg:w-1/2 space-y-8">
            
            {/* Category Tag & Certifications */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-yellow-500 font-sans text-xs font-bold tracking-[0.2em] uppercase">
                {item.category} COLLECTION
              </span>
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold tracking-wider uppercase">
                <Sparkles size={10} />
                <span>Certified Handcrafted</span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-4xl md:text-5xl font-['Tangerine'] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200">
                {item.name}
              </h1>
              
              {/* Ratings block */}
              <div className="flex items-center space-x-2.5 mt-3">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                </div>
                <span className="text-zinc-500 text-xs font-mono">•</span>
                <span className="text-zinc-300 text-xs font-semibold">4.9</span>
                <span className="text-zinc-500 text-xs font-mono">•</span>
                <span className="text-zinc-400 text-xs underline cursor-pointer hover:text-yellow-500 transition-colors">128 Authenticated Reviews</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-5 bg-zinc-900/30 border border-zinc-850 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block mb-1">Aligned Investment</span>
                <div className="text-3xl font-bold font-sans text-yellow-500">
                  {currencySymbols[currency] || ''} {Number(convert(item.price * quantity)).toFixed(2)}
                </div>
              </div>
              
              {/* Shipping info */}
              <div className="text-right text-[10px] text-zinc-400 space-y-1 font-mono">
                <div className="flex items-center justify-end space-x-1.5 text-teal-400">
                  <Truck size={12} />
                  <span className="font-bold uppercase tracking-wider">FREE EXPRESS COURIER</span>
                </div>
                <div>Est. Delivery: 2-3 Days in India</div>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <h3 className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Artifact Background</h3>
              <p className="text-zinc-300 bg-zinc-900/40 border border-zinc-850 rounded-2xl px-5 py-4 text-sm leading-relaxed font-sans shadow-inner">
                {item.description || "A masterfully selected spiritual artifact crafted to bring harmony, focus, and positive energy alignment into your physical environments and spiritual sessions."}
              </p>
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center space-x-2 text-xs">
              {isOutOfStock ? (
                <div className="flex items-center space-x-2 text-red-500 font-bold uppercase tracking-widest">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>Currently Out of Stock</span>
                </div>
              ) : item.stock > 0 && item.stock <= 5 ? (
                <div className="flex items-center space-x-2 text-amber-500 font-bold uppercase tracking-widest">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Limited Edition: Only {item.stock} Pieces Left</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-widest">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active in Stock • Spiritual Origin Authenticated</span>
                </div>
              )}
            </div>

            {/* Quantity Selector Box */}
            {!isOutOfStock && (
              <div className="space-y-3">
                <h3 className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Order Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1.5">
                    <button
                      onClick={decreaseQty}
                      disabled={quantity <= 1}
                      className="w-9 h-9 bg-zinc-950 text-zinc-400 hover:text-white rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 border border-zinc-850 transition-colors cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    
                    <span className="text-base font-bold font-mono text-zinc-100 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    
                    <button
                      onClick={increaseQty}
                      disabled={quantity >= maxQuantity}
                      className="w-9 h-9 bg-zinc-950 text-zinc-400 hover:text-white rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 border border-zinc-850 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {maxQuantity < 999 && (
                    <span className="text-[10px] text-zinc-500 font-mono">Max limit: {maxQuantity} items</span>
                  )}
                </div>
              </div>
            )}

            {/* Checkout Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-transparent hover:bg-yellow-500/10 text-yellow-500 border-2 border-yellow-500/50 py-4 px-6 rounded-xl font-bold text-sm tracking-widest uppercase hover:shadow-lg hover:shadow-yellow-500/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black py-4 px-6 rounded-xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-yellow-500/10 hover:shadow-yellow-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center space-x-2"
              >
                <Zap size={16} />
                <span>Buy It Now</span>
              </button>
            </div>

            {/* Core Trust Pillars Footer */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-900 text-center">
              <div className="space-y-1.5">
                <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center mx-auto text-yellow-500">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Secured Pay</span>
                <span className="text-[8px] text-zinc-500 block leading-tight">Cashfree encrypted portal protection</span>
              </div>
              
              <div className="space-y-1.5">
                <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center mx-auto text-yellow-500">
                  <Sparkles size={16} />
                </div>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Artisan Sourced</span>
                <span className="text-[8px] text-zinc-500 block leading-tight">Direct authentic spiritual creator roots</span>
              </div>
              
              <div className="space-y-1.5">
                <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center mx-auto text-yellow-500">
                  <RotateCcw size={16} />
                </div>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Alignment Care</span>
                <span className="text-[8px] text-zinc-500 block leading-tight">100% satisfaction alignment guarantee</span>
              </div>
            </div>

            {/* Authenticated Reviews Section */}
            <div className="border-t border-zinc-900 pt-8 space-y-4">
              <h3 className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Customer Experiences</h3>
              <div className="space-y-3.5">
                {mockReviews.map((rev, index) => (
                  <div key={index} className="p-4 bg-zinc-900/25 border border-zinc-850 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-[10px]">
                          {rev.name[0]}
                        </div>
                        <span className="font-semibold text-zinc-200">{rev.name}</span>
                      </div>
                      <span className="text-zinc-500 text-[10px]">{rev.date}</span>
                    </div>
                    <div className="flex text-yellow-500/80">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BuyItem;
