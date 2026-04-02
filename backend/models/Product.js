const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    },
    variants: [{
        ram: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
    }],
    images: [{ type: String }], // Optional if we plan to add images later
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
