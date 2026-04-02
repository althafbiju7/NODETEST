const SubCategory = require('../models/SubCategory');

const createSubCategory = async (req, res) => {
    try {
        const { name, category } = req.body;
        const subCategoryExists = await SubCategory.findOne({ name });

        if (subCategoryExists) return res.status(400).json({ message: 'Subcategory already exists' });

        const subCategory = await SubCategory.create({ name, category });
        res.status(201).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSubCategories = async (req, res) => {
    try {
        const query = req.query.category ? { category: req.query.category } : {};
        const subCategories = await SubCategory.find(query).populate('category', 'name');
        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (subCategory) {
            subCategory.name = req.body.name || subCategory.name;
            subCategory.category = req.body.category || subCategory.category;
            const updatedSubCategory = await subCategory.save();
            res.json(updatedSubCategory);
        } else {
            res.status(404).json({ message: 'SubCategory not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (subCategory) {
            await subCategory.deleteOne();
            res.json({ message: 'SubCategory removed' });
        } else {
            res.status(404).json({ message: 'SubCategory not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSubCategory, getSubCategories, updateSubCategory, deleteSubCategory };
