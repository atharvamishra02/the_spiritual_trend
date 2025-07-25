import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PageManager = () => {
  const [categories, setCategories] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [form, setForm] = useState({ video: '', description: '', productImages: [] });
  const [videoFile, setVideoFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/homepage/categories');
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch (err) {
      setCategories([]);
    }
  };

  const handleEdit = (idx) => {
    setEditingIdx(idx);
    setForm({
      video: categories[idx].video || '',
      description: categories[idx].description || '',
      productImages: categories[idx].productImages || [],
    });
    setVideoFile(null);
    setImageFiles([]);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file); // Use same endpoint as product images
    try {
      const res = await axios.post('http://localhost:5000/api/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
      });
      setForm((prev) => ({ ...prev, video: res.data.url }));
    } catch (err) {
      alert('Video upload failed');
    }
    setUploading(false);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(files);
    setUploading(true);
    let uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await axios.post('http://localhost:5000/api/products/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + localStorage.getItem('adminToken') },
        });
        uploaded.push(res.data.url);
      } catch (err) {
        alert('Image upload failed');
      }
    }
    setForm((prev) => ({ ...prev, productImages: [...(prev.productImages || []), ...uploaded] }));
    setUploading(false);
  };

  const handleRemoveImage = (idx) => {
    setForm((prev) => {
      const imgs = [...(prev.productImages || [])];
      imgs.splice(idx, 1);
      return { ...prev, productImages: imgs };
    });
  };

  const handleSave = async () => {
    if (editingIdx === null) return;
    const cat = categories[editingIdx];
    try {
      await axios.put(`http://localhost:5000/api/homepage/categories/${cat._id}`, {
        ...cat,
        video: form.video,
        description: form.description,
        productImages: form.productImages,
      });
      setEditingIdx(null);
      setForm({ video: '', description: '', productImages: [] });
      setVideoFile(null);
      setImageFiles([]);
      fetchCategories();
    } catch (err) {
      alert('Failed to update page info');
    }
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px', color: '#FFD700' }}>
      <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '2rem', marginBottom: '24px' }}>Page Manager</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {categories.map((cat, idx) => (
          <div key={cat._id} style={{ background: '#181818', border: '2px solid #FFD700', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={cat.image} alt={cat.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #FFD700' }} />
              <div>
                <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.25rem' }}>{cat.name}</h2>
                <p style={{ color: '#FFD700', opacity: 0.7 }}>{cat.slug}</p>
              </div>
            </div>
            {editingIdx === idx ? (
              <div style={{ marginTop: '16px' }}>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ width: '100%', marginBottom: '8px', color: '#FFD700' }}
                  disabled={uploading}
                />
                {form.video && (
                  <div style={{ marginBottom: '8px' }}>
                    <b>Video Preview:</b><br />
                    <video src={form.video} controls style={{ width: '100%', maxHeight: '180px', borderRadius: '8px', border: '2px solid #FFD700' }} />
                  </div>
                )}
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '2px solid #FFD700', borderRadius: '8px', background: '#000', color: '#FFD700', marginBottom: '8px', minHeight: '60px' }}
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ width: '100%', marginBottom: '8px', color: '#FFD700' }}
                  disabled={uploading}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {(form.productImages || []).map((img, i) => (
                    <div key={img} style={{ position: 'relative' }}>
                      <img src={img} alt={`Product ${i + 1}`} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #FFD700' }} />
                      <button onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} style={{ background: '#FFD700', color: '#000', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #FFD700', marginRight: '8px' }} disabled={uploading}>Save</button>
                <button onClick={() => { setEditingIdx(null); setForm({ video: '', description: '', productImages: [] }); setVideoFile(null); setImageFiles([]); }} style={{ background: '#888', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #888' }} disabled={uploading}>Cancel</button>
              </div>
            ) : (
              <div style={{ marginTop: '16px' }}>
                <div style={{ color: '#FFD700', marginBottom: '8px' }}><b>Video:</b> {cat.video ? <a href={cat.video} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'underline' }}>{cat.video}</a> : 'No video set'}</div>
                <div style={{ color: '#FFD700', marginBottom: '8px' }}><b>Description:</b> {cat.description || 'No description set'}</div>
                <div style={{ color: '#FFD700', marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <b>Product Images:</b>
                  {(cat.productImages || []).length === 0 ? ' No images set' : cat.productImages.map((img, i) => (
                    <img key={img} src={img} alt={`Product ${i + 1}`} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #FFD700', marginLeft: '8px' }} />
                  ))}
                </div>
                <button onClick={() => handleEdit(idx)} style={{ background: '#FFD700', color: '#000', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', border: '2px solid #FFD700' }}>Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageManager; 