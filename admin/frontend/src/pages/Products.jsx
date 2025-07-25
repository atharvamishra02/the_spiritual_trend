// src/pages/Products.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Star,
  Home,
  Zap,
  Crown
} from "lucide-react";
import { productAPI } from "../utils/api";
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    stock: "",
    isFeatured: false,
    isFamous: false,
    homePageSection: "featured", // add default section
    isActive: true, // add isActive field
    generatePage: false,
    pageName: ""
  });

  const categories = [
    "all",
    "kada",
    "pendants",
    "bracelets",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        showOnHomePage: formData.showOnHomePage,
        homePageSection: formData.homePageSection,
        isActive: formData.isActive
      };
      if (editingProduct) {
        await productAPI.update(editingProduct._id, payload);
      } else {
        await productAPI.create(payload);
      }
      setShowCreateForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [],
        stock: "",
        isFeatured: false,
        isFamous: false,
        homePageSection: "featured",
        isActive: true,
        generatePage: false,
        pageName: ""
      });
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.delete(productId);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const images = Array.isArray(product.images) 
      ? product.images.map(img => {
          if (typeof img === 'string') {
            return { id: `img-${Date.now()}-${Math.random()}`, url: img, name: 'image' };
          }
          return img;
        })
      : [];
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: images,
      stock: product.stock,
      isFeatured: product.isFeatured || false,
      isFamous: product.isFamous || false,
      homePageSection: product.homePageSection || "featured",
      isActive: product.isActive !== undefined ? product.isActive : true,
      generatePage: product.generatePage || false,
      pageName: product.pageName || ""
    });
    setShowCreateForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/products/upload-image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { url, filename } = res.data;
      setFormData((prev) => {
        const newImages = [...prev.images, { id: filename, url, name: file.name }];
        return {
          ...prev,
          images: newImages,
          image: newImages.length > 0 ? newImages[0].url : '',
        };
      });
    } catch (err) {
      alert('Image upload failed');
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== idx);
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0].url : '',
      };
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSendToFeatured = async (product) => {
    try {
      await productAPI.update(product._id, { isFeatured: true, homePageSection: 'featured', showOnHomePage: true });
      fetchProducts();
    } catch (error) {
      alert('Failed to send to Featured');
    }
  };
  const handleSendToFavourite = async (product) => {
    try {
      await productAPI.update(product._id, { isFamous: true, homePageSection: 'famous', showOnHomePage: true });
      fetchProducts();
    } catch (error) {
      alert('Failed to send to Favourite');
    }
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '16px', color: '#FFD700' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
        <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '2rem' }}>Products Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{ background: '#FFD700', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #FFD700', width: 'fit-content' }}
        >
          <Plus size={20} style={{ color: '#000', marginRight: '8px' }} />
          Add Product
        </button>
      </div>
      {/* Search and Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#FFD700' }} size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 40px', border: '2px solid #FFD700', borderRadius: '8px', background: '#000', color: '#FFD700', fontSize: '1rem' }}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '12px', border: '2px solid #FFD700', borderRadius: '8px', background: '#000', color: '#FFD700', fontSize: '1rem' }}
        >
          {categories.map(category => (
            <option key={category} value={category} style={{ color: '#000' }}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Create New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== "all").map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;
                    for (const file of files) {
                      const formDataUpload = new FormData();
                      formDataUpload.append('image', file);
                      try {
                        const res = await axios.post('http://localhost:5000/api/products/upload-image', formDataUpload, {
                          headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        const { url, filename } = res.data;
                        setFormData((prev) => {
                          const newImages = [...prev.images, { id: filename, url, name: file.name }];
                          return {
                            ...prev,
                            images: newImages,
                            image: newImages.length > 0 ? newImages[0].url : '',
                          };
                        });
                      } catch (err) {
                        alert('Image upload failed');
                      }
                    }
                  }}
                  className="mb-2"
                />
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.images.map((img, idx) => (
                    <div key={img.url} className="relative group">
                      <img src={img.url} alt={img.name} className="w-16 h-16 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded images will appear above. You can still manually add image URLs below if needed.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (Format: imageId|imageUrl, imageId|imageUrl)
                </label>
                <textarea
                  value={formData.images.map(img => `${img.id || ''}|${img.url || ''}`).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(line => line.trim());
                    const images = lines.map(line => {
                      const [id, url] = line.split('|').map(s => s.trim());
                      return { id, url, name: id || 'image' };
                    });
                    setFormData({...formData, images});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="ob1|https://example.com/ob1.png&#10;ob2|https://example.com/ob2.png&#10;ob3|https://example.com/ob3.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter each image on a new line. Format: imageId|imageUrl
                  <br />
                  Example: ob1|https://example.com/ob1.png
                  <br />
                  <strong>Common Image IDs:</strong> ob1, ob2, ob3, js1, js2, js3, r1, r2, r3, pc1, pc2, pc3, hk1, hk2, hk3, ok1, ok2, ok3
                </p>
              </div>

              {/* Advanced Options */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Advanced Options</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Featured Product</span>
                    <Star size={16} className="text-yellow-500" />
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isFamous}
                      onChange={(e) => setFormData({...formData, isFamous: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Famous Product</span>
                    <Crown size={16} className="text-purple-500" />
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Homepage Section</label>
                    <select
                      value={formData.homePageSection}
                      onChange={e => setFormData({...formData, homePageSection: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="none">None</option>
                      <option value="featured">Featured</option>
                      <option value="famous">Famous</option>
                      <option value="new">New</option>
                      {/* Add more sections as needed */}
                    </select>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.generatePage}
                      onChange={(e) => setFormData({...formData, generatePage: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Generate Page</span>
                    <Zap size={16} className="text-green-500" />
                  </label>
                </div>

                {formData.generatePage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Name (for URL)
                    </label>
                    <input
                      type="text"
                      value={formData.pageName}
                      onChange={(e) => setFormData({...formData, pageName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., custom-jewellery"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingProduct(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      category: "",
                      images: [],
                      stock: "",
                      isFeatured: false,
                      isFamous: false,
                      homePageSection: "featured",
                      isActive: true,
                      generatePage: false,
                      pageName: ""
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table and Cards: update all backgrounds, borders, text, and buttons to black/gold inline styles */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', background: '#000', color: '#FFD700', borderRadius: '16px', border: '2px solid #FFD700', boxShadow: '0 2px 8px #FFD70033' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', borderBottom: '2px solid #FFD700', color: '#FFD700', fontWeight: 'bold' }}>Name</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #FFD700', color: '#FFD700', fontWeight: 'bold' }}>Category</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #FFD700', color: '#FFD700', fontWeight: 'bold' }}>Price</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #FFD700', color: '#FFD700', fontWeight: 'bold' }}>Stock</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #FFD700', color: '#FFD700', fontWeight: 'bold' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id} style={{ textAlign: 'center', borderBottom: '1px solid #FFD700' }}>
                <td style={{ padding: '12px' }}>{product.name}</td>
                <td style={{ padding: '12px' }}>{product.category}</td>
                <td style={{ padding: '12px' }}>₹{product.price}</td>
                <td style={{ padding: '12px' }}>{product.stock}</td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => handleEdit(product)} style={{ color: '#FFD700', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(product._id)} style={{ color: '#FFD700', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
};

export default Products;
