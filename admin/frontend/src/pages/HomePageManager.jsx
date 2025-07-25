import React, { useState, useEffect } from "react";
import {
  Home,
  Star,
  Crown,
  Zap,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Save
} from "lucide-react";
import { productAPI } from "../utils/api";
import axios from 'axios';

const HomePageManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homePageData, setHomePageData] = useState({
    featured: [],
    famous: [],
    new: []
  });
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerUploading, setBannerUploading] = useState(false);

  // Add category state
  const [categories, setCategories] = useState([
    // Example initial category
    // { name: 'Bracelets', image: '', products: [] }
  ]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '', products: [] });

  // Helper to generate slug from name
  const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/homepage/categories');
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch (err) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchBannerUrl();
    fetchHomePageData();
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

  const fetchBannerUrl = async () => {
    try {
      const res = await fetch('/api/admin/homepage/banner', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBannerUrl(data.bannerUrl || "");
      }
    } catch (err) {
      // ignore
    }
  };

  const fetchHomePageData = async () => {
    try {
      const res = await fetch('/api/admin/homepage', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHomePageData({
          featured: data.featured || [],
          famous: data.famous || [],
          new: data.new || []
        });
      }
    } catch (err) {
      // ignore
    }
  };

  const handleBannerFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleBannerUpload = async () => {
    if (!bannerFile) return;
    setBannerUploading(true);
    const formData = new FormData();
    formData.append('banner', bannerFile);
    try {
      const res = await axios.post('/api/admin/homepage/upload-banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setBannerUrl(res.data.url);
      setBannerFile(null);
      alert('Banner uploaded successfully!');
    } catch (err) {
      alert('Failed to upload banner');
    } finally {
      setBannerUploading(false);
    }
  };

  const addToSection = (section, product) => {
    setHomePageData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...product, order: prev[section].length }]
    }));
  };

  const removeFromSection = (section, productId) => {
    setHomePageData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item._id !== productId)
    }));
  };

  const moveItem = (section, index, direction) => {
    setHomePageData(prev => {
      const newSection = [...prev[section]];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex >= 0 && newIndex < newSection.length) {
        [newSection[index], newSection[newIndex]] = [newSection[newIndex], newSection[index]];
        newSection[index].order = index;
        newSection[newIndex].order = newIndex;
      }
      
      return {
        ...prev,
        [section]: newSection
      };
    });
  };

  const saveHomePageData = async () => {
    try {
      // Note: This endpoint might need to be implemented in the backend
      const response = await fetch('http://localhost:5000/api/admin/products/homepage/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(homePageData)
      });
      
      if (response.ok) {
        alert("Home page data saved successfully!");
      } else {
        alert("Failed to save home page data");
      }
    } catch (error) {
      console.error("Error saving home page data:", error);
      alert("Failed to save home page data");
    }
  };

  // Category handlers
  const handleAddCategory = async () => {
    try {
      const payload = { ...categoryForm, slug: slugify(categoryForm.name) };
      await axios.post('http://localhost:5000/api/homepage/categories', payload);
      setCategoryForm({ name: '', image: '', products: [] });
      setCategoryImageFile(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to add category');
    }
  };
  const handleEditCategory = (idx) => {
    setEditingCategory(idx);
    setCategoryForm(categories[idx]);
    setCategoryImageFile(null);
  };
  const handleUpdateCategory = async () => {
    try {
      const cat = categories[editingCategory];
      const payload = { ...categoryForm, slug: slugify(categoryForm.name) };
      await axios.put(`http://localhost:5000/api/homepage/categories/${cat._id}`, payload);
      setEditingCategory(null);
      setCategoryForm({ name: '', image: '', products: [] });
      setCategoryImageFile(null);
      fetchCategories();
    } catch (err) {
      alert('Failed to update category');
    }
  };
  const handleRemoveCategory = async (idx) => {
    try {
      const cat = categories[idx];
      await axios.delete(`http://localhost:5000/api/homepage/categories/${cat._id}`);
      fetchCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  // Image upload for category
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCategoryImageFile(file);
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/products/upload-image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        },
      });
      const { url } = res.data;
      setCategoryForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      alert('Image upload failed');
    }
  };

  const getSectionIcon = (section) => {
    switch (section) {
      case 'featured': return <Star className="text-gold" />;
      case 'famous': return <Crown className="text-gold" />;
      case 'new': return <Zap className="text-gold" />;
      default: return <Home className="text-gold" />;
    }
  };

  const getSectionTitle = (section) => {
    switch (section) {
      case 'featured': return 'Featured Items';
      case 'famous': return 'Famous Items';
      case 'new': return 'New Items';
      default: return section;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '16px', color: '#FFD700' }}>
      {/* Banner Upload Section */}
      <div style={{ background: '#000', border: '2px solid #FFD700', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Home style={{ color: '#FFD700' }} /> Homepage Banner
        </h2>
        {bannerUrl && (
          <div style={{ marginBottom: '16px' }}>
            {bannerUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={bannerUrl} controls style={{ width: '100%', maxHeight: '256px', borderRadius: '8px', border: '2px solid #FFD700' }} />
            ) : (
              <img src={bannerUrl} alt="Homepage Banner" style={{ width: '100%', maxHeight: '256px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #FFD700' }} />
            )}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'stretch', width: '100%' }}>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleBannerFileChange}
            style={{ border: '2px solid #FFD700', borderRadius: '8px', padding: '12px', background: '#000', color: '#FFD700' }}
          />
          <button
            onClick={handleBannerUpload}
            disabled={!bannerFile || bannerUploading}
            style={{ background: '#FFD700', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #FFD700', width: 'fit-content', alignSelf: 'flex-start' }}
          >
            {bannerUploading ? 'Uploading...' : 'Upload Banner'}
          </button>
        </div>
        {bannerFile && (
          <div style={{ marginTop: '16px' }}>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Preview:</span>
            {bannerFile.type.startsWith('video') ? (
              <video src={URL.createObjectURL(bannerFile)} controls style={{ width: '100%', maxHeight: '256px', borderRadius: '8px', border: '2px solid #FFD700', marginTop: '8px' }} />
            ) : (
              <img src={URL.createObjectURL(bannerFile)} alt="Preview" style={{ width: '100%', maxHeight: '256px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #FFD700', marginTop: '8px' }} />
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#FFD700', fontSize: '2rem', fontWeight: 'bold' }}>Home Page Manager</h1>
        <button
          onClick={saveHomePageData}
          style={{ background: '#FFD700', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #FFD700', width: 'fit-content', alignSelf: 'center' }}
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', lg: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {/* Featured Items */}
        <div style={{ background: '#000', border: '2px solid #FFD700', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            {getSectionIcon('featured')}
            <h2 style={{ color: '#FFD700', fontSize: '1.5rem', fontWeight: 'semibold' }}>{getSectionTitle('featured')}</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {homePageData.featured.map((item, index) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#1a1a1a', border: '2px solid #FFD700', borderRadius: '8px' }}>
                <img 
                  src={item.images?.[0]?.url || '/placeholder.jpg'} 
                  alt={item.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div style={{ flex: 1, minWidth: '0' }}>
                  <p style={{ color: '#FFD700', fontSize: '0.875rem', fontWeight: 'medium', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ color: '#FFD700', fontSize: '0.75rem' }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => moveItem('featured', index, 'up')}
                    disabled={index === 0}
                    style={{ padding: '4px', color: '#FFD700', cursor: 'pointer', opacity: index === 0 ? '0.5' : '1' }}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveItem('featured', index, 'down')}
                    disabled={index === homePageData.featured.length - 1}
                    style={{ padding: '4px', color: '#FFD700', cursor: 'pointer', opacity: index === homePageData.featured.length - 1 ? '0.5' : '1' }}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => removeFromSection('featured', item._id)}
                    style={{ padding: '4px', color: '#FFD700', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #FFD700', paddingTop: '16px' }}>
            <h3 style={{ color: '#FFD700', fontSize: '0.875rem', fontWeight: 'medium', marginBottom: '8px' }}>Add Product</h3>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const product = products.find(p => p._id === e.target.value);
                  if (product) addToSection('featured', product);
                  e.target.value = '';
                }
              }}
              style={{ width: '100%', padding: '12px', border: '2px solid #FFD700', borderRadius: '8px', background: '#000', color: '#FFD700' }}
            >
              <option value="">Select a product...</option>
              {products
                .filter(p => !homePageData.featured.find(f => f._id === p._id))
                .map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Famous Items */}
        <div style={{ background: '#000', border: '2px solid #FFD700', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            {getSectionIcon('famous')}
            <h2 style={{ color: '#FFD700', fontSize: '1.5rem', fontWeight: 'semibold' }}>{getSectionTitle('famous')}</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {homePageData.famous.map((item, index) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#1a1a1a', border: '2px solid #FFD700', borderRadius: '8px' }}>
                <img 
                  src={item.images?.[0]?.url || '/placeholder.jpg'} 
                  alt={item.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div style={{ flex: 1, minWidth: '0' }}>
                  <p style={{ color: '#FFD700', fontSize: '0.875rem', fontWeight: 'medium', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ color: '#FFD700', fontSize: '0.75rem' }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => moveItem('famous', index, 'up')}
                    disabled={index === 0}
                    style={{ padding: '4px', color: '#FFD700', cursor: 'pointer', opacity: index === 0 ? '0.5' : '1' }}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveItem('famous', index, 'down')}
                    disabled={index === homePageData.famous.length - 1}
                    style={{ padding: '4px', color: '#FFD700', cursor: 'pointer', opacity: index === homePageData.famous.length - 1 ? '0.5' : '1' }}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => removeFromSection('famous', item._id)}
                    style={{ padding: '4px', color: '#FFD700', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #FFD700', paddingTop: '16px' }}>
            <h3 style={{ color: '#FFD700', fontSize: '0.875rem', fontWeight: 'medium', marginBottom: '8px' }}>Add Product</h3>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const product = products.find(p => p._id === e.target.value);
                  if (product) addToSection('famous', product);
                  e.target.value = '';
                }
              }}
              style={{ width: '100%', padding: '12px', border: '2px solid #FFD700', borderRadius: '8px', background: '#000', color: '#FFD700' }}
            >
              <option value="">Select a product...</option>
              {products
                .filter(p => !homePageData.famous.find(f => f._id === p._id))
                .map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Category Section (was New Items) */}
        <div style={{ background: '#000', border: '2px solid #FFD700', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Home className="text-gold" />
            <h2 style={{ color: '#FFD700', fontSize: '1.5rem', fontWeight: 'semibold' }}>Categories</h2>
          </div>

          {/* Category List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {categories.map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#1a1a1a', border: '2px solid #FFD700', borderRadius: '8px' }}>
                {cat.image && <img src={cat.image} alt={cat.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />}
                <div style={{ flex: 1, minWidth: '0' }}>
                  <p style={{ color: '#FFD700', fontSize: '0.875rem', fontWeight: 'medium', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</p>
                </div>
                <button onClick={() => handleEditCategory(idx)} style={{ color: '#FFD700', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleRemoveCategory(idx)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>

          {/* Add/Edit Category Form */}
          <div style={{ borderTop: '2px solid #FFD700', paddingTop: '16px' }}>
            <h3 style={{ color: '#FFD700', fontSize: '0.875rem', fontWeight: 'medium', marginBottom: '8px' }}>{editingCategory !== null ? 'Edit Category' : 'Add Category'}</h3>
            <input
              type="text"
              placeholder="Category Name (e.g. Pendants, Kada, Bracelet)"
              value={categoryForm.name}
              onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
              style={{ width: '100%', padding: '12px', border: '2px solid #FFD700', borderRadius: '8px', background: '#000', color: '#FFD700', marginBottom: '8px' }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleCategoryImageUpload}
              style={{ width: '100%', marginBottom: '8px', color: '#FFD700' }}
            />
            {categoryForm.image && (
              <img src={categoryForm.image} alt="Category Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px', border: '2px solid #FFD700' }} />
            )}
            {editingCategory !== null ? (
              <button
                onClick={handleUpdateCategory}
                disabled={!categoryForm.name || !categoryForm.image}
                style={{ background: '#FFD700', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #FFD700', width: 'fit-content', marginRight: '8px', opacity: (!categoryForm.name || !categoryForm.image) ? 0.5 : 1, cursor: (!categoryForm.name || !categoryForm.image) ? 'not-allowed' : 'pointer' }}
              >
                Update Category
              </button>
            ) : (
              <button
                onClick={handleAddCategory}
                disabled={!categoryForm.name || !categoryForm.image}
                style={{ background: '#FFD700', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #FFD700', width: 'fit-content', marginRight: '8px', opacity: (!categoryForm.name || !categoryForm.image) ? 0.5 : 1, cursor: (!categoryForm.name || !categoryForm.image) ? 'not-allowed' : 'pointer' }}
              >
                Add Category
              </button>
            )}
            {editingCategory !== null && (
              <button onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', image: '', products: [] }); setCategoryImageFile(null); fetchCategories(); }} style={{ background: '#888', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #888', width: 'fit-content' }}>Cancel</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageManager; 