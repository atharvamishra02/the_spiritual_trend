import React, { useEffect, useState } from 'react';
import { productAPI, apiCall } from '../utils/api.js';
import { Plus, Edit, Trash2, Eye, EyeOff, Package, DollarSign, Users, TrendingUp } from 'lucide-react';

const SECTION_OPTIONS = ['featured', 'famous', 'new', 'none'];

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    
    const result = await apiCall(productAPI.getAll);
    
    if (result.success) {
      setProducts(result.data);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await apiCall(productAPI.delete, id);
    
    if (result.success) {
      fetchProducts();
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleUpdate = async (id) => {
    const newName = prompt("Enter new product name:");
    if (!newName) return;

    setLoading(true);
    setError('');
    
    const result = await apiCall(productAPI.update, id, { name: newName });
    
    if (result.success) {
      fetchProducts();
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const toggleActive = async (id, currentStatus) => {
    setLoading(true);
    setError('');
    
    const result = await apiCall(productAPI.update, id, { isActive: !currentStatus });
    
    if (result.success) {
      fetchProducts();
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Filtered products by section
  const filteredProducts = sectionFilter === 'all'
    ? products
    : products.filter(p => p.homePageSection === sectionFilter);

  return (
    <div style={{ background: '#000', color: '#FFD700', padding: '24px', borderRadius: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div>
          <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.5rem' }}>Products</h1>
          <p style={{ color: '#FFD700', opacity: 0.7 }}>Manage your product inventory and homepage sections</p>
        </div>
        {/* Removed Add Product button */}
      </div>
      {/* Section Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <button onClick={() => setSectionFilter('all')} style={{ padding: '8px 16px', borderRadius: '6px', background: sectionFilter==='all' ? '#FFD700' : '#000', color: sectionFilter==='all' ? '#000' : '#FFD700', border: '2px solid #FFD700', fontWeight: 'bold' }}>All</button>
        {SECTION_OPTIONS.filter(s=>s!=='none').map(section => (
          <button key={section} onClick={() => setSectionFilter(section)} style={{ padding: '8px 16px', borderRadius: '6px', background: sectionFilter===section ? '#FFD700' : '#000', color: sectionFilter===section ? '#000' : '#FFD700', border: '2px solid #FFD700', fontWeight: 'bold' }}>{section.charAt(0).toUpperCase()+section.slice(1)}</button>
        ))}
      </div>
      {/* Stats Cards - vertical on mobile, grid on md+ */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6 mb-6">
        <div className="bg-black text-yellow-500 p-6 rounded-xl border-2 border-yellow-500 shadow-md flex items-center">
          <div className="p-2 bg-yellow-500 rounded-lg text-black"><Package size={20} /></div>
          <div className="ml-4">
            <p className="text-yellow-500 opacity-70 text-base">Total Products</p>
            <p className="text-yellow-500 font-bold text-xl">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-black text-yellow-500 p-6 rounded-xl border-2 border-yellow-500 shadow-md flex items-center">
          <div className="p-2 bg-yellow-500 rounded-lg text-black"><Eye size={20} /></div>
          <div className="ml-4">
            <p className="text-yellow-500 opacity-70 text-base">Active Products</p>
            <p className="text-yellow-500 font-bold text-xl">{activeProducts}</p>
          </div>
        </div>
        <div className="bg-black text-yellow-500 p-6 rounded-xl border-2 border-yellow-500 shadow-md flex items-center">
          <div className="p-2 bg-yellow-500 rounded-lg text-black"><DollarSign size={20} /></div>
          <div className="ml-4">
            <p className="text-yellow-500 opacity-70 text-base">Total Value</p>
            <p className="text-yellow-500 font-bold text-xl">₹{totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <div style={{ background: '#FFD700', color: '#000', border: '2px solid #FFD700', padding: '16px', borderRadius: '8px', fontWeight: 'bold' }}>
          {error}
        </div>
      )}
      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="border-4 border-yellow-500 rounded-full w-8 h-8 border-b-4 border-black animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="text-yellow-500 mb-4 mx-auto" />
          <h3 className="text-yellow-500 font-bold text-lg mb-2">No products found in this section</h3>
          <p className="text-yellow-500 opacity-70">Get started by adding your first product to this section.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {/* Mobile: vertical cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {filteredProducts.map(product => (
              <div key={product._id} className="bg-black border-2 border-yellow-500 rounded-xl p-4 flex flex-col gap-2 text-yellow-500 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg truncate">{product.name}</span>
                  <span className="text-yellow-400 text-sm">{product.category}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>₹{product.price}</span>
                  <span>Section: {product.homePageSection}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>On Home: {product.showOnHomePage ? 'Yes' : 'No'}</span>
                  <span>Order: {product.homePageOrder}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Status: <span className={product.isActive ? 'text-green-400' : 'text-red-400'}>{product.isActive ? 'Active' : 'Inactive'}</span></span>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(product._id)} className="text-yellow-500 bg-black border border-yellow-500 rounded p-1"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(product._id)} className="text-yellow-500 bg-black border border-yellow-500 rounded p-1"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-black text-yellow-500 rounded-xl border-2 border-yellow-500 shadow-md">
              <thead>
                <tr>
                  <th className="p-3 border-b-2 border-yellow-500 font-bold">Name</th>
                  <th className="p-3 border-b-2 border-yellow-500 font-bold">Category</th>
                  <th className="p-3 border-b-2 border-yellow-500 font-bold">Price</th>
                  <th className="p-3 border-b-2 border-yellow-500 font-bold">Section</th>
                  <th className="p-3 border-b-2 border-yellow-500 font-bold">On Home?</th>
                  <th className="p-3 border-b-2 border-yellow-500 font-bold">Order</th>
                  <th className="p-3 border-b-2 border-yellow-500 font-bold">Active</th>
                  <th className="p-3 border-b-2 border-yellow-500 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id} className="text-center border-b border-yellow-500">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3">{product.homePageSection}</td>
                    <td className="p-3">{product.showOnHomePage ? 'Yes' : 'No'}</td>
                    <td className="p-3">{product.homePageOrder}</td>
                    <td className="p-3">
                      <button onClick={() => toggleActive(product._id, product.isActive)} className={`px-3 py-1 rounded ${product.isActive ? 'bg-yellow-500 text-black' : 'bg-black text-yellow-500'} border-2 border-yellow-500 font-bold`}>{product.isActive ? 'Active' : 'Inactive'}</button>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleUpdate(product._id)} className="text-yellow-500 bg-black border border-yellow-500 rounded p-1"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(product._id)} className="text-yellow-500 bg-black border border-yellow-500 rounded p-1"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
