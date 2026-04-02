import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiHeart, FiEdit2, FiPlus, FiX, FiStar, FiChevronRight, FiChevronDown, FiUpload, FiTrash2 } from 'react-icons/fi';
import { useLocation, Link } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSubCategories, setActiveSubCategories] = useState([]);
  
  // Filtering & Search state
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubCat, setFilterSubCat] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user, updateWishlist } = useContext(AuthContext);

  // Modal & Form state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    subCategory: '',
    imageUrl: '', // Holds the server path after upload
    variants: [{ ram: '', price: 0, qty: 0 }]
  });

  const [catFormData, setCatFormData] = useState({ name: '' });
  const [subCatFormData, setSubCatFormData] = useState({ name: '', category: '' });

  // Initial Data Load
  useEffect(() => {
    fetchCategories();
    fetchAllSubCategories();
  }, []);

  // UNIFIED FETCH EFFECT (Fixes search/filter lag)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    
    // Auto-reset category filters if search is active or URL is clean /
    if (searchParam && (filterCategory || filterSubCat)) {
      setFilterCategory('');
      setFilterSubCat('');
    }

    // Internal fetch function to ensure we use the absolute latest values from the effect closure
    const performFetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/products?search=${searchParam}&subCategoryId=${filterSubCat}&page=${page}&limit=6`);
        setProducts(data.products);
        setPages(data.pages);
      } catch (err) { console.error(err); }
      setLoading(false);
    };

    performFetch();
  }, [location.search, filterSubCat, page]);

  // Sidebar Subcategory filtering
  useEffect(() => {
    if (filterCategory) {
      const filtered = subCategories.filter(s => s.category?._id === filterCategory || s.category === filterCategory);
      setActiveSubCategories(filtered);
    } else {
      setActiveSubCategories([]);
      setFilterSubCat('');
    }
  }, [filterCategory, subCategories]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (err) { console.error(err); }
  };

  const fetchAllSubCategories = async () => {
    try {
      const { data } = await axios.get('/api/subcategories');
      setSubCategories(data);
    } catch (err) { console.error(err); }
  };

  const handleImageUpload = async (file) => {
    const submitData = new FormData();
    submitData.append('image', file);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', submitData, config);
      return data; // Returns the server path e.g. /uploads/image-123.jpg
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
      return '';
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        
        // Force refresh by triggering a state change or just calling the fetch again
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search') || '';
        const { data } = await axios.get(`/api/products?search=${searchParam}&subCategoryId=${filterSubCat}&page=${page}&limit=6`);
        setProducts(data.products);
      } catch (err) { 
        alert(err.response?.data?.message || 'Error deleting product'); 
      }
    }
  };

  const toggleWishlist = async (productId) => {
    if(!user) return alert("Please login to use wishlist");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`/api/wishlist/${productId}`, {}, config);
      if (data.wishlist) {
        updateWishlist(data.wishlist);
      }
    } catch (err) { 
      console.error(err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = formData.imageUrl;

    if (selectedFile) {
      const uploadedPath = await handleImageUpload(selectedFile);
      if (uploadedPath) finalImageUrl = uploadedPath;
    }

    // Filter out empty variants
    const filteredVariants = formData.variants.filter(v => v.ram && v.ram.trim() !== '');
    
    if (filteredVariants.length === 0) {
      return alert('Each product must have at least one valid variant (RAM/Size cannot be empty).');
    }

    const payload = {
      ...formData,
      variants: filteredVariants,
      images: finalImageUrl ? [finalImageUrl] : []
    };

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editId) {
        await axios.put(`/api/products/${editId}`, payload, config);
      } else {
        await axios.post('/api/products', payload, config);
      }
      setShowProductModal(false);
      setSelectedFile(null);
      // Force refresh by triggering a state change or just calling the fetch again
      const params = new URLSearchParams(location.search);
      const searchParam = params.get('search') || '';
      const { data } = await axios.get(`/api/products?search=${searchParam}&subCategoryId=${filterSubCat}&page=${page}&limit=6`);
      setProducts(data.products);
    } catch (err) { alert(err.response?.data?.message || 'Error saving product'); }
  };

  const openAddProductModal = () => {
    setEditId(null);
    setFormData({ name: '', subCategory: '', imageUrl: '', variants: [{ ram: '', price: 0, qty: 0 }] });
    setSelectedFile(null);
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      subCategory: product.subCategory?._id || '',
      imageUrl: product.images?.[0] || '',
      variants: product.variants
    });
    setSelectedFile(null);
    setShowProductModal(true);
  };

  return (
    <div className="container-full">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h4>Categories</h4>
        <div 
          className={`sidebar-item ${!filterCategory ? 'active' : ''}`} 
          onClick={() => { setFilterCategory(''); setFilterSubCat(''); }}
        >
          All Categories
        </div>
        
        {categories.map(cat => (
          <div key={cat._id}>
            <div 
              className={`sidebar-item ${filterCategory === cat._id ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat._id === filterCategory ? '' : cat._id)}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              {cat.name}
              {filterCategory === cat._id ? <FiChevronDown /> : <FiChevronRight />}
            </div>
            
            {filterCategory === cat._id && (
              <div style={{ marginLeft: '15px', borderLeft: '2px solid var(--accent)', paddingLeft: '10px' }}>
                {activeSubCategories.map(sub => (
                  <div 
                    key={sub._id}
                    className={`sidebar-item ${filterSubCat === sub._id ? 'active' : ''}`}
                    onClick={() => setFilterSubCat(sub._id === filterSubCat ? '' : sub._id)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    • {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="action-bar" style={{ background: 'white', padding: '20px 32px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div className="breadcrumbs" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
            <span 
              style={{ color: 'var(--text-light)', cursor: 'pointer' }} 
              onClick={() => { setFilterCategory(''); setFilterSubCat(''); setPage(1); }}
            >
              Home
            </span>
            <FiChevronRight size={16} style={{ margin: '0 8px', color: '#CBD5E1' }} />
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{filterCategory ? categories.find(c => c._id === filterCategory)?.name : 'Product Discovery'}</span>
          </div>
          {user && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-white" onClick={() => setShowCategoryModal(true)} style={{ borderRadius: '8px' }}>+ Category</button>
              <button className="btn btn-white" onClick={() => setShowSubCategoryModal(true)} style={{ borderRadius: '8px' }}>+ Sub Category</button>
              <button className="btn btn-accent" onClick={openAddProductModal} style={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(232, 159, 41, 0.2)' }}>
                <FiPlus size={18} /> Add Product
              </button>
            </div>
          )}
        </div>

        {loading ? <p>Loading Products...</p> : (
          <>
            <div className="grid-3 animate-fade-in">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <button className="wishlist-btn" onClick={() => toggleWishlist(product._id)}>
                    <FiHeart 
                      size={18} 
                      fill={user?.wishlist?.includes(product._id) ? "var(--error)" : "transparent"} 
                      color={user?.wishlist?.includes(product._id) ? "var(--error)" : "var(--text-light)"} 
                    />
                  </button>
                  <Link to={`/product/${product._id}`} className="product-image-container" style={{ textDecoration: 'none' }}>
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#aaa', fontWeight: 600 }}>NO IMAGE</span>
                    )}
                  </Link>
                  <Link to={`/product/${product._id}`} className="product-title" style={{ textDecoration: 'none', color: 'inherit' }}>{product.name}</Link>
                  <div className="product-price">${product.variants[0]?.price || '0.00'}</div>
                  <div className="star-rating">
                    <FiStar fill="#FFC107" /> <FiStar fill="#FFC107" /> <FiStar fill="#FFC107" /> <FiStar fill="#FFC107" /> <FiStar />
                  </div>
                  {user && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button className="btn btn-white" style={{ flex: 1 }} onClick={() => openEditProductModal(product)}>
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button className="btn btn-white" style={{ flex: 1, color: 'var(--error)' }} onClick={() => handleDeleteProduct(product._id)}>
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
                {[...Array(pages).keys()].map(x => (
                  <button 
                    key={x + 1} 
                    onClick={() => setPage(x + 1)}
                    className={`btn ${page === x + 1 ? 'btn-accent' : 'btn-white'}`}
                  >
                    {x + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* MODALS */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3>{editId ? 'Edit Product' : 'Add Product'}</h3>
              <FiX size={24} cursor="pointer" onClick={() => setShowProductModal(false)} />
            </div>
            <form onSubmit={handleProductSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label>Product Title</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label>Upload Image (From System)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', border: '1px dashed var(--border)', borderRadius: '4px', cursor: 'pointer' }}>
                  <FiUpload />
                  <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                </div>
                {selectedFile && <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '4px' }}>Selected: {selectedFile.name}</p>}
                {!selectedFile && formData.imageUrl && <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>Current: {formData.imageUrl}</p>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label>Sub-Category</label>
                <select required value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}>
                  <option value="">Select sub-category</option>
                  {subCategories.map(s => <option key={s._id} value={s._id}>{s.name} ({s.category?.name})</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Variants 
                  <span style={{ color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => setFormData({...formData, variants: [...formData.variants, {ram:'', price:0, qty:0}]})}>+ Add variant</span>
                </label>
                 {formData.variants.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input placeholder="RAM/Size" required value={v.ram} onChange={e => {
                      const nv = [...formData.variants]; nv[i].ram = e.target.value; setFormData({...formData, variants: nv});
                    }} style={{ flex: 2 }} />
                    <input type="number" placeholder="Price" required value={v.price} onChange={e => {
                      const nv = [...formData.variants]; nv[i].price = e.target.value; setFormData({...formData, variants: nv});
                    }} style={{ flex: 1 }} />
                    <input type="number" placeholder="Qty" required value={v.qty} onChange={e => {
                      const nv = [...formData.variants]; nv[i].qty = e.target.value; setFormData({...formData, variants: nv});
                    }} style={{ flex: 1 }} />
                    {formData.variants.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => {
                          const nv = formData.variants.filter((_, idx) => idx !== i);
                          setFormData({...formData, variants: nv});
                        }} 
                        style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '4px' }}
                      >
                        <FiX size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>{editId ? 'Save Changes' : 'Add Product'}</button>
                <button type="button" className="btn btn-white" style={{ flex: 1 }} onClick={() => setShowProductModal(false)}>Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modals omitted for brevity - assuming they stay the same */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3>Add Category</h3>
              <FiX size={24} cursor="pointer" onClick={() => setShowCategoryModal(false)} />
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post('/api/categories', catFormData, config);
                setShowCategoryModal(false);
                fetchCategories();
              } catch (err) { alert('Error adding category'); }
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label>Category Name</label>
                <input required value={catFormData.name} onChange={e => setCatFormData({name: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-accent" style={{ width: '100%' }}>ADD CATEGORY</button>
            </form>
          </div>
        </div>
      )}

      {showSubCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3>Add Sub Category</h3>
              <FiX size={24} cursor="pointer" onClick={() => setShowSubCategoryModal(false)} />
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post('/api/subcategories', subCatFormData, config);
                setShowSubCategoryModal(false);
                fetchAllSubCategories();
              } catch (err) { alert('Error adding sub-category'); }
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label>Sub Category Name</label>
                <input required value={subCatFormData.name} onChange={e => setSubCatFormData({...subCatFormData, name: e.target.value})} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label>Parent Category</label>
                <select required value={subCatFormData.category} onChange={e => setSubCatFormData({...subCatFormData, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-accent" style={{ width: '100%' }}>ADD SUB-CATEGORY</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
