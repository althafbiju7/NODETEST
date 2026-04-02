import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="full-center animate-fade-in" style={{ backgroundColor: '#f8fafc' }}>
      <div className="auth-wrapper">
        <div className="auth-split-container">
          {/* LEFT SIDEBAR - Welcome Back */}
          <div className="auth-sidebar">
            <div className="shape shape-square"></div>
            <div className="shape shape-circle"></div>
            <div className="shape shape-triangle"></div>
            
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="btn-outline-white" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>

          {/* RIGHT FORM - Create Account */}
          <div className="auth-form-panel">
            <h2>Create Account</h2>
            
            {error && (
              <div style={{ color: 'var(--error)', padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="input-icon-group">
                <FiUser size={20} />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Name"
                  required
                />
              </div>

              <div className="input-icon-group">
                <FiMail size={20} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email"
                  required
                />
              </div>
              
              <div className="input-icon-group">
                <FiLock size={20} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password"
                  required
                />
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="btn-auth-submit">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
