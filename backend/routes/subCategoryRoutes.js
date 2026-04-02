const express = require('express');
const { createSubCategory, getSubCategories, updateSubCategory, deleteSubCategory } = require('../controllers/subCategoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createSubCategory)
    .get(getSubCategories);

router.route('/:id')
    .put(protect, updateSubCategory)
    .delete(protect, deleteSubCategory);

module.exports = router;
