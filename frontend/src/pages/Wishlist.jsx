import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiHeart, FiTrash2, FiStar, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/wishlist', config);
      setWishlist(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (productId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`/api/wishlist/${productId}`, {}, config);
      // Remove from UI immediately for better UX
      setWishlist(wishlist.filter(p => p._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="main-content"><p>Loading wishlist...</p></div>;

  return (
    <div className="main-content animate-fade-in" style={{ padding: '40px' }}>
      <div className="breadcrumbs" style={{ marginBottom: '24px' }}>
        Home <FiChevronRight size={14} /> <span>My Wishlist</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, color: 'var(--primary)', fontWeight: 800 }}>MY WISHLIST</h1>
        <span style={{ background: 'var(--accent)', color: 'white', padding: '2px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
          {wishlist.length} ITEMS
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <FiHeart size={64} color="#eee" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: 'var(--text)', marginBottom: '12px' }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>Looks like you haven't added anything to your wishlist yet.</p>
          <Link to="/" className="btn btn-accent">Explore Products</Link>
        </div>
      ) : (
        <div className="grid-3">
          {wishlist.map(product => (
            <div key={product._id} className="product-card">
              <button 
                onClick={() => removeFromWishlist(product._id)} 
                className="wishlist-btn"
                title="Remove from wishlist"
              >
                <FiHeart size={18} fill="var(--error)" color="var(--error)" />
              </button>
              
              <Link to={`/product/${product._id}`} className="product-image-container" style={{ textDecoration: 'none' }}>
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#aaa', fontWeight: 600 }}>NO IMAGE</span>
                )}
              </Link>

              <Link to={`/product/${product._id}`} className="product-title" style={{ textDecoration: 'none', color: 'inherit' }}>{product.name}</Link>
              <div className="product-price">
                ${product.variants?.[0]?.price || '0.00'}
              </div>
              
              <div className="star-rating">
                <FiStar fill="#FFC107" /> <FiStar fill="#FFC107" /> <FiStar fill="#FFC107" /> <FiStar fill="#FFC107" /> <FiStar />
                <span style={{ color: '#777', fontSize: '0.8rem', marginLeft: '6px' }}>(4.5)</span>
              </div>

              <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '8px' }}>
                {product.subCategory?.name || 'Uncategorized'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
