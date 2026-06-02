import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-yellow-400">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">TS</span>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400">The Spiritual Trend</h3>
            </div>
            <p className="text-yellow-300 text-sm leading-relaxed">
              Discover the divine within. We offer handcrafted murtis, sacred jewelry, and spiritual elegance 
              to enhance your spiritual journey and bring divine blessings to your life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300">
                <FaFacebook className="text-black text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300">
                <FaInstagram className="text-black text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300">
                <FaTwitter className="text-black text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300">
                <FaYoutube className="text-black text-lg" />
              </a>
            </div>
          </div>

                     {/* Quick Links */}
           <div className="space-y-4">
             <h4 className="text-xl font-bold text-yellow-400 border-b-2 border-yellow-500 pb-2">Quick Links</h4>
             <ul className="space-y-2">
               <li>
                 <Link to="/" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   Home
                 </Link>
               </li>
               <li>
                 <Link to="/about" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   About Us
                 </Link>
               </li>
               <li>
                 <Link to="/AllProducts" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   All Products
                 </Link>
               </li>
               <li>
                 <Link to="/wishlist" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   Wishlist
                 </Link>
               </li>
               <li>
                 <Link to="/cart" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   Shopping Cart
                 </Link>
               </li>
               <li>
                 <Link to="/profile" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   My Profile
                 </Link>
               </li>
             </ul>
           </div>

           {/* Customer Support */}
           <div className="space-y-4">
             <h4 className="text-xl font-bold text-yellow-400 border-b-2 border-yellow-500 pb-2">Customer Support</h4>
             <ul className="space-y-2">
               <li>
                 <Link to="/support/returns" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   Returns & Exchanges
                 </Link>
               </li>
               <li>
                 <Link to="/support/shipping-info" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   Shipping Information
                 </Link>
               </li>
               <li>
                 <Link to="/support" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   Contact Support
                 </Link>
               </li>
               <li>
                 <Link to="/support/help-center" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   Help Center
                 </Link>
               </li>
               <li>
                 <Link to="/contact" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                   Contact Us
                 </Link>
               </li>
             </ul>
           </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-yellow-400 border-b-2 border-yellow-500 pb-2">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-yellow-500 text-sm" />
                <span className="text-yellow-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-yellow-500 text-sm" />
                <span className="text-yellow-300 text-sm">info@thespritualtrends.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="text-yellow-500 text-sm" />
                <span className="text-yellow-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-yellow-500 text-sm mt-1" />
                <span className="text-yellow-300 text-sm">
                  123 Spiritual Street<br />
                  Divine City, DC 12345<br />
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-yellow-500/30">
          <div className="text-center">
            <h4 className="text-xl font-bold text-yellow-400 mb-4">Stay Connected</h4>
            <p className="text-yellow-300 text-sm mb-6">
              Subscribe to our newsletter for spiritual insights, new product updates, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-yellow-500 rounded-lg text-yellow-300 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black border-t border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-300 text-sm">© {currentYear} The Spiritual Trend. All Rights Reserved.</span>
            </div>
                         <div className="flex items-center space-x-6">
               <Link to="/support" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                 Support
               </Link>
               <Link to="/about" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                 About
               </Link>
               <Link to="/contact" className="text-yellow-300 hover:text-yellow-500 transition-colors duration-300 text-sm">
                 Contact
               </Link>
             </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-yellow-300 text-xs">
              Made with <FaHeart className="inline text-red-500" /> for spiritual seekers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
