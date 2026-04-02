import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="full-center animate-fade-in" style={{ backgroundColor: '#f8fafc' }}>
      <div className="auth-wrapper">
        <div className="auth-split-container">
          {/* FORM PANEL - Welcome Back */}
          <div className="auth-form-panel">
            <h2>Welcome Back!</h2>
            
            {error && (
              <div style={{ color: 'var(--error)', padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
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
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="btn-auth-submit">
                  Sign In
                </button>
              </div>
            </form>
          </div>

          {/* SIDEBAR PANEL - Hello Friend */}
          <div className="auth-sidebar" style={{ background: 'linear-gradient(135deg, #f0a500 0%, #d18f24 100%)' }}>
            <div className="shape shape-square"></div>
            <div className="shape shape-circle"></div>
            <div className="shape shape-triangle"></div>
            
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="btn-outline-white" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
