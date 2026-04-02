import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import ManageCategories from './pages/ManageCategories';
import ProductDetails from './pages/ProductDetails';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/signup';
  const isSignupPage = location.pathname === '/signup';

  return (
    <div className="app-container">
      {!isSignupPage && <Navbar />}
      <main className={isSignupPage ? "auth-main" : "container animate-fade-in"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manage-categories" 
            element={
              <ProtectedRoute>
                <ManageCategories />
              </ProtectedRoute>
            } 
          />
          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
