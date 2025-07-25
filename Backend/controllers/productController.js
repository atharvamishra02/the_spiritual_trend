import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products for home page sections
export const getHomePageProducts = async (req, res) => {
  try {
    const { section } = req.params;
    const products = await Product.find({
      showOnHomePage: true,
      homePageSection: section,
      isActive: true
    }).sort({ homePageOrder: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get new products
export const getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isNew: true,
      isActive: true
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({
      category: { $regex: category, $options: 'i' },
      isActive: true
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    
    // If page generation is enabled, create the page
    if (savedProduct.generatePage && savedProduct.pageSlug) {
      await generateProductPage(savedProduct);
    }
    
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If page generation is enabled, update the page
    if (product.generatePage && product.pageSlug) {
      await generateProductPage(product);
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If page was generated, delete it
    if (product.pageSlug) {
      await deleteProductPage(product.pageSlug);
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update homepage sections
export const updateHomepageSections = async (req, res) => {
  try {
    const { featured = [], famous = [], new: newItems = [] } = req.body;

    // Helper to update a section
    const updateSection = async (products, sectionName) => {
      for (let i = 0; i < products.length; i++) {
        const id = products[i]._id || products[i];
        await Product.findByIdAndUpdate(id, {
          showOnHomePage: true,
          homePageSection: sectionName,
          homePageOrder: i
        });
      }
    };

    // Clear all products' homepage fields first
    await Product.updateMany({}, { showOnHomePage: false, homePageSection: 'none', homePageOrder: 0 });

    // Update each section
    await updateSection(featured, 'featured');
    await updateSection(famous, 'famous');
    await updateSection(newItems, 'new');

    res.json({ message: 'Homepage sections updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility endpoint to update all product image URLs to full backend URLs
export const fixProductImageUrls = async (req, res) => {
  try {
    const backendUrl = req.protocol + '://' + req.get('host');
    const products = await Product.find();
    let updatedCount = 0;
    for (const product of products) {
      let changed = false;
      // Fix main image
      if (product.image && product.image.startsWith('/uploads/')) {
        product.image = backendUrl + product.image;
        changed = true;
      }
      // Fix images array
      if (Array.isArray(product.images)) {
        for (let img of product.images) {
          if (img.url && img.url.startsWith('/uploads/')) {
            img.url = backendUrl + img.url;
            changed = true;
          }
        }
      }
      if (changed) {
        await product.save();
        updatedCount++;
      }
    }
    res.json({ message: `Updated ${updatedCount} products with full image URLs.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility endpoint to set default image for all products missing an image
export const setDefaultProductImages = async (req, res) => {
  try {
    const defaultImage = '/uploads/product-placeholder.png';
    const products = await Product.find();
    let updatedCount = 0;
    for (const product of products) {
      let changed = false;
      // Set main image if missing
      if (!product.image) {
        product.image = defaultImage;
        changed = true;
      }
      // Set images array if missing or empty
      if (!Array.isArray(product.images) || product.images.length === 0) {
        product.images = [{ url: defaultImage }];
        changed = true;
      }
      // If images array exists but all entries are missing url, add default
      if (Array.isArray(product.images) && product.images.every(img => !img.url)) {
        product.images = [{ url: defaultImage }];
        changed = true;
      }
      if (changed) {
        await product.save();
        updatedCount++;
      }
    }
    res.json({ message: `Updated ${updatedCount} products with default images.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate product page
const generateProductPage = async (product) => {
  try {
    const pageTemplate = `import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import HeartIcon from '../components/HeartIcon';

import ${product.pageSlug}Video from "../assets/${product.pageVideo}";
import { imageIds } from '../assets/imageIds';
import { getImageUrl } from '../utils/imageUtils';

const ${product.pageName.replace(/\s+/g, '')} = () => {
  const { currency, convert } = useCurrency();
  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState("");
  const [showSort, setShowSort] = useState(false);

  // Add carousel index tracker for each product
  const [imageIndexMap, setImageIndexMap] = useState({});
  const intervalsRef = useRef({});

  // Fetch products for this category
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(\`/api/products/category/${product.category.toLowerCase()}\`);
      const data = await response.json();
      setProducts(data);
      
      // Initialize image index map
      const initialIndexMap = {};
      data.forEach(product => {
        initialIndexMap[product._id] = 0;
      });
      setImageIndexMap(initialIndexMap);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  let filteredProducts = [...products];

  // Sort
  if (sortOption === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // --- Slider Handlers ---
  const startAutoSlide = (productId, totalImages) => {
    if (intervalsRef.current[productId]) return;
    intervalsRef.current[productId] = setInterval(() => {
      setImageIndexMap((prev) => ({
        ...prev,
        [productId]: (prev[productId] + 1) % totalImages,
      }));
    }, 2000);
  };
  
  const stopAutoSlide = (productId) => {
    if (intervalsRef.current[productId]) {
      clearInterval(intervalsRef.current[productId]);
      delete intervalsRef.current[productId];
    }
  };

  // Clean up intervals on unmount
  React.useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* 🎥 Background Video */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        <video
          src={${product.pageSlug}Video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/3 w-full text-center px-4"
        >
          <h1 className="text-black text-4xl sm:text-6xl font-extrabold drop-shadow-lg tracking-wider mb-4">
            ${product.pageTitle}
          </h1>
          <p className="text-black text-lg sm:text-xl font-bold max-w-xl mx-auto">
            ${product.pageDescription}
          </p>
        </motion.div>
      </div>

      {/* 🔍 Sort Controls */}
      <div className="flex flex-row justify-center items-center my-6 gap-4">
        <div className="relative">
          <button
            onClick={() => setShowSort((prev) => !prev)}
            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md shadow hover:bg-yellow-600"
          >
            Sort By
          </button>
          {showSort && (
            <div className="absolute top-full mt-2 bg-white text-black rounded-md shadow-lg z-50 w-48">
              <div
                onClick={() => {
                  setSortOption("lowToHigh");
                  setShowSort(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Price: Low to High
              </div>
              <div
                onClick={() => {
                  setSortOption("highToLow");
                  setShowSort(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Price: High to Low
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🧿 Product Grid */}
      <motion.div
        className="py-2 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredProducts.map((item) => (
            <motion.div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer flex flex-col relative"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                const currentImageIndex = imageIndexMap[item._id] || 0;
                const selectedImage = item.images && item.images[currentImageIndex];
                navigate("/buyitem", {
                  state: {
                    product: { 
                      ...item, 
                      quantity: 1, 
                      selectedImage: selectedImage,
                      selectedImageIndex: currentImageIndex
                    },
                    currency,
                  },
                });
              }}
            >
              <div className="w-full aspect-square flex items-center justify-center bg-white relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-contain w-full h-full"
                  style={{ display: 'block' }}
                />
                <HeartIcon product={item} />
              </div>
              <div className="p-4 text-black">
                <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
                <p className="text-yellow-600 font-bold">
                  {currency} {convert(item.price)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🔙 Back Button */}
        <motion.button
          className="mt-12 px-6 py-3 bg-black hover:bg-gray-700 text-white font-semibold text-lg rounded-lg shadow-lg"
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

export default ${product.pageName.replace(/\s+/g, '')};
`;

    const frontendPagesDir = path.join(process.cwd(), '../frontend/src/pages');
    const pagePath = path.join(frontendPagesDir, `${product.pageName.replace(/\s+/g, '')}.jsx`);
    
    fs.writeFileSync(pagePath, pageTemplate);
    console.log(`Generated page: ${pagePath}`);
    
  } catch (error) {
    console.error('Error generating product page:', error);
  }
};

// Delete product page
const deleteProductPage = async (pageSlug) => {
  try {
    const frontendPagesDir = path.join(process.cwd(), '../frontend/src/pages');
    const pagePath = path.join(frontendPagesDir, `${pageSlug}.jsx`);
    
    if (fs.existsSync(pagePath)) {
      fs.unlinkSync(pagePath);
      console.log(`Deleted page: ${pagePath}`);
    }
  } catch (error) {
    console.error('Error deleting product page:', error);
  }
};