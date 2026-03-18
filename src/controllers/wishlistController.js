const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const { Wishlist, Course, User } = db;

// ─── Add to Wishlist ──────────────────────────────────────────────────────────
exports.addToWishlist = async (req, res) => {
  try {
    const { coursetoken, usertoken } = req.body;

    if (!coursetoken || !usertoken) {
      return res.status(400).json({
        status: 'error',
        message: 'coursetoken and usertoken are required'
      });
    }

    // Resolve User
    const user = await User.findOne({ where: { usertoken } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Resolve Course
    const course = await Course.findOne({ where: { coursetoken } });
    if (!course) {
      return res.status(404).json({ status: 'error', message: 'Course not found' });
    }

    const wishlisttoken = uuidv4();

    const [wishlistItem, created] = await Wishlist.findOrCreate({
      where: { userId: user.id, courseId: course.id },
      defaults: {
        wishlisttoken,
        userId: user.id,
        courseId: course.id
      }
    });

    if (!created) {
      return res.status(200).json({
        status: 'success',
        message: 'Course already in wishlist',
        data: wishlistItem
      });
    }

    res.status(201).json({
      status: 'success',
      data: wishlistItem
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ─── Get Wishlist ────────────────────────────────────────────────────────────
exports.getWishlist = async (req, res) => {
  try {
    const { usertoken } = req.params;

    const user = await User.findOne({ where: { usertoken } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const wishlistItems = await Wishlist.findAll({
      where: { userId: user.id, activeInd: true },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['courseName', 'coursetoken', 'price', 'instructorName']
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      data: wishlistItems
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// ─── Remove from Wishlist ──────────────────────────────────────────────────────
exports.removeFromWishlist = async (req, res) => {
  try {
    const { coursetoken, usertoken } = req.body;

    const user = await User.findOne({ where: { usertoken } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const course = await Course.findOne({ where: { coursetoken } });
    if (!course) {
      return res.status(404).json({ status: 'error', message: 'Course not found' });
    }

    const wishlistItem = await Wishlist.findOne({
      where: { userId: user.id, courseId: course.id, activeInd: true }
    });

    if (!wishlistItem) {
      return res.status(404).json({ status: 'error', message: 'Item not found in wishlist' });
    }

    wishlistItem.activeInd = false;
    await wishlistItem.save();

    res.status(200).json({
      status: 'success',
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
