const User = require('../models/User');

const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const productIndex = user.wishlist.findIndex(id => id.toString() === productId);

        if (productIndex !== -1) {
            // Remove from wishlist
            user.wishlist.splice(productIndex, 1);
            await user.save();
            return res.json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
        } else {
            // Add to wishlist
            user.wishlist.push(productId);
            await user.save();
            return res.status(201).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            populate: {
                path: 'subCategory',
                select: 'name category'
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { toggleWishlist, getWishlist };
