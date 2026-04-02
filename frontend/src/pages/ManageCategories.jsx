import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiTrash2, FiGrid, FiList, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const catRes = await axios.get('/api/categories');
            const subRes = await axios.get('/api/subcategories');
            setCategories(catRes.data);
            setSubCategories(subRes.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryName) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/categories', { name: categoryName }, config);
            setCategoryName('');
            fetchData();
            alert('Category added successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add category');
        }
    };

    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        if (!subCategoryName) return alert('Please provide name');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/subcategories', { name: subCategoryName }, config);
            setSubCategoryName('');
            fetchData();
            alert('Sub-category added successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add sub-category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure? This might affect products in this category.')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/categories/${id}`, config);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    const handleDeleteSubCategory = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/subcategories/${id}`, config);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    if (!user || !user.isAdmin) {
        return (
            <div className="glass-card" style={{ textAlign: 'center', marginTop: '50px' }}>
                <FiAlertCircle size={48} color="var(--error)" />
                <h2>Access Denied</h2>
                <p>Only administrators can manage categories.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Manage Catalog</h1>
                    <p>Create and organize your product hierarchy.</p>
                </div>
                <button className="btn btn-white" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiArrowLeft /> Back to Home
                </button>
            </div>

            <div className="grid grid-cols-2">
                {/* Category Section */}
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <FiGrid size={24} color="var(--primary)" />
                        <h3>Categories</h3>
                    </div>
                    
                    <form onSubmit={handleAddCategory} style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="New Category Name (e.g. Electronics)" 
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                                <FiPlus />
                            </button>
                        </div>
                    </form>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {loading ? <p>Loading...</p> : (
                            categories.map(cat => (
                                <div key={cat._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border)' }}>
                                    <span>{cat.name}</span>
                                    <button onClick={() => handleDeleteCategory(cat._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))
                        )}
                        {categories.length === 0 && !loading && <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)' }}>No categories yet.</p>}
                    </div>
                </div>

                {/* Sub-Category Section */}
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <FiList size={24} color="var(--secondary)" />
                        <h3>Sub-Categories</h3>
                    </div>

                    <form onSubmit={handleAddSubCategory} style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    placeholder="New Sub-Category Name (e.g. Laptops)" 
                                    value={subCategoryName}
                                    onChange={(e) => setSubCategoryName(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                                    <FiPlus />
                                </button>
                            </div>
                        </div>
                    </form>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {loading ? <p>Loading...</p> : (
                            subCategories.map(sub => (
                                <div key={sub._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border)' }}>
                                    <div>
                                        <span style={{ fontWeight: '600' }}>{sub.name}</span>
                                    </div>
                                    <button onClick={() => handleDeleteSubCategory(sub._id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))
                        )}
                        {subCategories.length === 0 && !loading && <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)' }}>No sub-categories yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCategories;
