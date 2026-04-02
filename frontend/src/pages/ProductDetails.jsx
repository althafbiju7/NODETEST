import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiHeart, FiEdit2, FiChevronRight, FiShoppingBag, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateWishlist } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Product not found');
    }
    setLoading(false);
  };

  const toggleWishlist = async () => {
    if(!user) return alert("Please login to use wishlist");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`/api/wishlist/${product._id}`, {}, config);
      if (data.wishlist) {
        updateWishlist(data.wishlist);
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h3>Loading Product Details...</h3></div>;
  if (error) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h3 style={{ color: 'var(--error)' }}>{error}</h3><Link to="/" className="btn btn-accent">Back to Home</Link></div>;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      {/* Breadcrumbs */}
      <div className="breadcrumbs" style={{ marginBottom: '32px' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> 
        <FiChevronRight size={14} style={{ margin: '0 8px' }} /> 
        <span style={{ color: 'var(--text-light)' }}>{product.subCategory?.name || 'Uncategorized'}</span>
        <FiChevronRight size={14} style={{ margin: '0 8px' }} /> 
        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{product.name}</span>
      </div>

      <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start' }}>
        {/* Left: Product Image */}
        <div style={{ flex: '1', background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} style={{ maxWidth: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain' }} />
          ) : (
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>NO IMAGE AVAILABLE</div>
          )}
        </div>

        {/* Right: Product Info */}
        <div style={{ flex: '1.2' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span className="badge badge-category">{product.subCategory?.category?.name || 'Category'}</span>
              <span className="badge badge-stock" style={{ background: '#D1FAE5', color: '#065F46' }}>
                <FiCheckCircle style={{ marginRight: '4px' }} /> In Stock
              </span>
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>{product.name}</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Premium specification {product.subCategory?.name} designed for peak performance.</p>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '32px', height: '2px', background: 'var(--accent)' }}></span>
              Technical Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {product.variants.map((v, idx) => (
                <div key={idx} style={{ padding: '20px', borderRadius: '12px', background: 'white', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' }}></div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{v.ram}</div>
                  <div style={{ fontSize: '1.4rem', color: 'var(--accent)', fontWeight: 800, margin: '8px 0' }}>${v.price}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Stock: <span style={{ fontWeight: 700, color: '#333' }}>{v.qty} units</span></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-accent" onClick={toggleWishlist} style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiHeart fill={user?.wishlist?.includes(product._id) ? "var(--error)" : "transparent"} color={user?.wishlist?.includes(product._id) ? "var(--error)" : "white"} /> 
              Save to Wishlist
            </button>
            <button className="btn btn-white" onClick={() => navigate('/')} style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiArrowLeft /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
