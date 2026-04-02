import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="container animate-fade-in">
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
