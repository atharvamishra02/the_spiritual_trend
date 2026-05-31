import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedProducts, getFamousProducts, getCategories } from '../api/productAPI';
import { useCurrency } from "../context/CurrencyContext";
import HeartIcon from '../components/HeartIcon';

const Slider = ({ items, renderItem, title }) => {
  const sliderRef = useRef();
  return (
    <div className="w-full max-w-7xl mx-auto my-10">
      <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">{title}</h2>
      <div className="relative">
        <div
          ref={sliderRef}
          className="slider-scroll flex gap-6 overflow-x-auto pb-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map(renderItem)}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { currency, convert } = useCurrency();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [famous, setFamous] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  
  // Currency symbols mapping
  const currencySymbols = { USD: '$', INR: '₹', AED: 'د.إ' };

  // Add floating animation styles
  const floatingStyles = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }
  `;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFeaturedProducts(),
      getFamousProducts()
    ]).then(([featuredData, famousData]) => {
      setFeatured(featuredData);
      setFamous(famousData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCatLoading(true);
    getCategories().then((data) => {
      setCategories(data);
      setCatLoading(false);
    }).catch(() => setCatLoading(false));
  }, []);

  return (
    <>
      <style>{floatingStyles}</style>
      <div className="w-full min-h-screen bg-black text-yellow-500 flex flex-col items-center justify-start">
      {/* Hero section: video as background with overlayed content */}
      <div className="w-full relative flex items-center justify-center" style={{ height: '90vh', minHeight: '90vh', maxHeight: '100vh', overflow: 'hidden', marginTop: 0, paddingTop: 0 }}>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src="/bg3.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          controls={false}
        />
        {/* Overlay for readability and content */}
        <div className="absolute inset-0 bg-opacity-40 z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-5xl font-extrabold mb-4 text-center text-yellow-400 drop-shadow-lg">The Spiritual Trend</h1>
          <p className="text-lg text-yellow-300 mb-2 text-center max-w-2xl">
            Discover the divine within. Explore handcrafted murtis, sacred jewelry, and spiritual elegance – all in one place.
          </p>
        </div>
      </div>
       {/* Shop Now Button before Category Slider */}
       <div className="w-full flex justify-center my-8">
         <a href="/AllProducts" className="px-8 py-4 bg-yellow-500 text-black rounded-lg font-bold text-xl shadow-lg hover:bg-yellow-600 transition">Shop Now</a>
       </div>
       
       {/* Floating Image Section */}
       <div className="w-full flex justify-center my-12 md:my-16">
         <div className="relative">
           <img
             src="/s8.webp"
             alt="Floating Collection Image"
             className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl"
             style={{
               filter: 'drop-shadow(0 10px 20px rgba(255, 193, 7, 0.3))',
               animation: 'float 3s ease-in-out infinite'
             }}
           />
         </div>
       </div>
       
       {/* Category Slider */}
       {catLoading ? (
         <div className="text-yellow-400 text-2xl my-10">Loading categories...</div>
       ) : (
         <Slider
           title="Shop by Category"
           items={categories}
           renderItem={cat => (
             <div
               key={cat._id || cat.slug || cat.name}
               className="bg-yellow-100 rounded-2xl shadow-lg overflow-hidden cursor-pointer flex flex-col items-center p-6 min-w-[240px] max-w-[260px] hover:scale-105 transition border-2 border-yellow-300"
               onClick={() => navigate(`/category/${cat.slug || cat.name}`)}
             >
               <img
                 src={cat.image || "https://via.placeholder.com/180x180?text=Category"}
                 alt={cat.name}
                 className="w-36 h-36 object-cover rounded-full mb-4 border-2 border-yellow-400 bg-white"
                 onError={e => { e.target.src = "https://via.placeholder.com/180x180?text=Category"; }}
               />
               <div className="text-black font-bold text-xl text-center tracking-wide">{cat.name}</div>
             </div>
           )}
         />
       )}
      {/* Featured and Famous Sliders */}
      {loading ? (
        <div className="text-yellow-400 text-2xl my-10">Loading featured & famous products...</div>
      ) : (
        <>
          <Slider
            title="Featured Items"
            items={featured}
            renderItem={item => (
              <div
                key={item._id || item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform relative min-w-[240px] max-w-[260px] h-80"
                onClick={() => navigate(`/buyitem/${item._id || item.id}`, { state: { product: item, currency } })}
              >
                <div className="relative">
                  <img
                    src={item.images && item.images[0]?.url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={e => { e.target.src = "https://via.placeholder.com/300x200?text=Product+Image"; }}
                  />
                  <HeartIcon product={item} />
                </div>
                <div className="p-4 h-32 flex flex-col justify-between">
                  <h3 className="text-sm font-semibold text-black line-clamp-2">{item.name}</h3>
                  <p className="text-black font-bold text-sm">{currencySymbols[currency]} {convert(item.price)}</p>
                </div>
              </div>
            )}
          />
          <Slider
            title="Famous Items"
            items={famous}
            renderItem={item => (
              <div
                key={item._id || item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform relative min-w-[240px] max-w-[260px] h-80"
                onClick={() => navigate(`/buyitem/${item._id || item.id}`, { state: { product: item, currency } })}
              >
                <div className="relative">
                  <img
                    src={item.images && item.images[0]?.url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                    onError={e => { e.target.src = "https://via.placeholder.com/300x200?text=Product+Image"; }}
                  />
                  <HeartIcon product={item} />
                </div>
                <div className="p-4 h-32 flex flex-col justify-between">
                  <h3 className="text-sm font-semibold text-black line-clamp-2">{item.name}</h3>
                  <p className="text-black font-bold text-sm">{currencySymbols[currency]} {convert(item.price)}</p>
                </div>
              </div>
            )}
          />
          {/* Customer Reviews Section */}
          <div className="w-full max-w-7xl mx-auto my-16 px-4">
            <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">What Our Customers Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-black/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-yellow-400">
                <h4 className="font-bold text-lg text-yellow-400 mb-2">Aarohi S.</h4>
                <p className="text-yellow-300 italic">"Absolutely stunning craftsmanship! The kada I bought is even more beautiful in person. Fast delivery and lovely packaging."</p>
              </div>
              <div className="bg-black/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-yellow-400">
                <h4 className="font-bold text-lg text-yellow-400 mb-2">Rohan M.</h4>
                <p className="text-yellow-300 italic">"I ordered a pendant for my mother's birthday. She loved it! The quality is top-notch and the design is unique."</p>
              </div>
              <div className="bg-black/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-yellow-400">
                <h4 className="font-bold text-lg text-yellow-400 mb-2">Priya K.</h4>
                <p className="text-yellow-300 italic">"The bracelet fits perfectly and looks so elegant. I get compliments every time I wear it. Will shop again!"</p>
              </div>
              <div className="bg-black/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-yellow-400">
                <h4 className="font-bold text-lg text-yellow-400 mb-2">Vikram D.</h4>
                <p className="text-yellow-300 italic">"Great service and beautiful jewelry. The spiritual touch in every piece is truly special. Highly recommended!"</p>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default Home; 