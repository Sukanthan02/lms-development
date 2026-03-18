const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const { Category, SubCategory } = db;

// ─── Category Controllers ────────────────────────────────────────────────────

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Category name is required' });
    }

    const categorytoken = uuidv4();
    const category = await Category.create({
      categorytoken,
      name,
      description
    });

    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['name', 'categorytoken']
    });
    res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ─── Sub-Category Controllers ─────────────────────────────────────────────────

exports.createSubCategory = async (req, res) => {
  try {
    const { categoryId, name, description } = req.body;
    if (!categoryId || !name) {
      return res.status(400).json({ status: 'error', message: 'categoryId and name are required' });
    }

    // Verify category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Parent Category not found' });
    }

    const subcategorytoken = uuidv4();
    const subCategory = await SubCategory.create({
      subcategorytoken,
      categoryId,
      name,
      description
    });

    res.status(201).json({
      status: 'success',
      data: subCategory
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getSubCategoriesByCategoryId = async (req, res) => {
  try {
    const { categorytoken } = req.params;

    // First, find the category to get its ID
    const category = await Category.findOne({ where: { categorytoken } });
    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }

    const subCategories = await SubCategory.findAll({
      where: { categoryId: category.id },
      attributes: ['name', 'subcategorytoken', 'description', 'activeInd']
    });

    res.status(200).json({
      status: 'success',
      data: subCategories
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
