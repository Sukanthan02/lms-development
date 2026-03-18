const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/sub-categories/:categorytoken
router.get('/:categorytoken', categoryController.getSubCategoriesByCategoryId);

// POST /api/sub-categories
router.post('/', categoryController.createSubCategory);

module.exports = router;
