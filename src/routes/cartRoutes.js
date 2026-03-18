const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart/:usertoken
router.get('/:usertoken', cartController.getCart);

// POST /api/cart
router.post('/', cartController.addToCart);

// POST /api/cart/remove
router.post('/remove', cartController.removeFromCart);

module.exports = router;
