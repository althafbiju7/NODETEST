const Product = require('../models/Product');

/**
 * @desc    Create a new product with filtered variants
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
    try {
        const { name, subCategory, variants, images } = req.body;
        
        // Filter out empty variants
        const filteredVariants = (variants || []).filter(v => v.ram && v.ram.trim() !== '');
        
        const product = await Product.create({ 
            name, 
            subCategory, 
            variants: filteredVariants, 
            images 
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get all products with searching, filtering, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.search
            ? {
                  name: {
                      $regex: req.query.search,
                      $options: 'i',
                  },
              }
            : {};

        const subCategoryFilter = req.query.subCategoryId ? { subCategory: req.query.subCategoryId } : {};

        const count = await Product.countDocuments({ ...keyword, ...subCategoryFilter });
        const products = await Product.find({ ...keyword, ...subCategoryFilter })
            .populate('subCategory', 'name category')
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('subCategory');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update a product by ID
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
    try {
        const { name, subCategory, variants, images } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.subCategory = subCategory || product.subCategory;
            
            if (variants) {
                // Filter out empty variants
                product.variants = variants.filter(v => v.ram && v.ram.trim() !== '');
            }
            
            if(images) product.images = images;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
