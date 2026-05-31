import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [stats, setStats] = useState({ customers: 0, years: 0, stores: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        customers: prev.customers < 5000 ? prev.customers + 100 : 5000,
        years: prev.years < 10 ? prev.years + 1 : 10,
        stores: prev.stores < 50 ? prev.stores + 1 : 50,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black pt-32 pb-20 md:pt-40 md:pb-24 text-white min-h-screen">
      
      <motion.div
        className="max-w-5xl mx-auto p-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-5xl font-bold mb-6 text-yellow-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h2>
        <motion.p
          className="text-lg text-yellow-500 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Welcome to <b>The Spiritual Trend</b>, where passion meets craftsmanship! We are dedicated
          to bringing you **sacred, elegantly crafted, and high-quality spiritual jewelry**
          for your daily spiritual journey. Whether you’re a devotee, a trendsetter, or seeking
          inner peace, we have the perfect piece for you.
        </motion.p>

      
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          
        </motion.div>
      </motion.div>

    
      <motion.div
        className="max-w-4xl mx-auto bg-yellow-500 p-8 rounded-lg text-center shadow-lg mt-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h3 className="text-3xl font-bold text-black mb-3">Our Mission</h3>
        <p className="text-black">
          Our goal is simple: **To revolutionize the way you experience spiritual expression**. We focus on
          **devotion, craftsmanship, and pure materials**, ensuring top-notch quality.
          Every piece is designed for unmatched comfort and spiritual grace.
        </p>
      </motion.div>

      
      <div className="py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-10 text-yellow-500">Our Journey</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
          {[
            { title: "Happy Customers", value: stats.customers },
            { title: "Years in Business", value: stats.years },
            { title: "Worldwide Stores", value: stats.stores },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="p-6 bg-black rounded-lg shadow-lg w-full max-w-60 mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-4xl font-bold text-yellow-500">{stat.value}+</h3>
              <p className="text-yellow-500">{stat.title}</p>
            </motion.div>
          ))}
        </div>
      </div>

      
      <div className="py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-10 text-yellow-500">What Our Customers Say</h2>
        <motion.div
          className="max-w-4xl mx-auto bg-black p-6 rounded-lg shadow-lg text-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-gray-300 italic">"Absolutely love the craftsmanship and spiritual energy of The Spiritual Trend! These Kadas are a true blessing. 🙏"</p>
          <p className="text-yellow-500 mt-4">- Aarav Sharma</p>
        </motion.div>
      </div>

    
      <motion.div
        className="text-center mt-8 pb-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <motion.button
          className="bg-yellow-500 text-black px-8 py-3 rounded-full font-extrabold hover:bg-yellow-600 transition-all shadow-md shadow-yellow-500/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/AllProducts")}
        >
          Explore Our Collection
        </motion.button>
      </motion.div>
    </div>
  );
};

export default About;
