const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// GET /api/wishlist/:usertoken
router.get('/:usertoken', wishlistController.getWishlist);

// POST /api/wishlist
router.post('/', wishlistController.addToWishlist);

// POST /api/wishlist/remove
router.post('/remove', wishlistController.removeFromWishlist);

module.exports = router;
