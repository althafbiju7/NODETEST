const express = require('express');
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getWishlist);

router.route('/:productId')
    .post(protect, toggleWishlist);

module.exports = router;
