const express = require('express');
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createCategory)
    .get(getCategories);

router.route('/:id')
    .put(protect, updateCategory)
    .delete(protect, deleteCategory);

module.exports = router;
