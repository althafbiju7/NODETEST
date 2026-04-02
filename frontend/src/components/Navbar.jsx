import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHeart, FiUser, FiLogOut, FiShoppingCart, FiSearch, FiArrowLeft, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {(location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup' || location.search.includes('search=')) && (
          <button 
            onClick={() => {
              setSearchTerm('');
              navigate('/');
            }} 
            className="btn btn-white" 
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '4px' }}
          >
            <FiArrowLeft size={18} /> Back to Home
          </button>
        )}
        <Link to="/" className="nav-brand">
          <h3 style={{ margin: 0, fontWeight: 500, letterSpacing: '1px' }}>SHOP4U</h3>
        </Link>
      </div>

      {location.pathname === '/' && (
        <form className="nav-search-container" onSubmit={handleSearch} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Searching for products..."
            className="nav-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <FiX 
              size={18} 
              style={{ position: 'absolute', right: '110px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-light)' }} 
              onClick={() => {
                setSearchTerm('');
                navigate('/');
              }}
            />
          )}
          <button type="submit" className="nav-search-btn">
            <FiSearch size={18} style={{ marginRight: '6px' }} /> Search
          </button>
        </form>
      )}

      <div className="nav-links" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/wishlist" className="nav-link" title="Wishlist" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiHeart size={20} /> <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Wishlist</span>
            </Link>
            <Link to="#" className="nav-link" title="Cart">
              <FiShoppingCart size={22} />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px' }}>
              <FiUser size={18} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <FiLogOut size={20} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ fontWeight: 600 }}>Login</Link>
            <Link to="/signup" className="btn btn-accent">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
