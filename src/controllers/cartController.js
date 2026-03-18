const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const { Cart, Course, User } = db;

// ─── Add to Cart ─────────────────────────────────────────────────────────────
exports.addToCart = async (req, res) => {
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

    const carttoken = uuidv4();

    // Create or update cart entry (handling possible duplicates via unique index)
    const [cartItem, created] = await Cart.findOrCreate({
      where: { userId: user.id, courseId: course.id },
      defaults: {
        carttoken,
        userId: user.id,
        courseId: course.id,
        quantity: 1
      }
    });

    if (!created) {
      // If already exists, we could increment quantity or just return success
      return res.status(200).json({
        status: 'success',
        message: 'Course already in cart',
        data: cartItem
      });
    }

    res.status(201).json({
      status: 'success',
      data: cartItem
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ─── Get Cart ────────────────────────────────────────────────────────────────
exports.getCart = async (req, res) => {
  try {
    const { usertoken } = req.params;

    const user = await User.findOne({ where: { usertoken } });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const cartItems = await Cart.findAll({
      where: { userId: user.id, activeInd: true },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['courseName', 'coursetoken', 'price', 'instructorName']
        }
      ]
    });

    const totalAmount = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.course?.price || 0);
      return sum + price;
    }, 0);

    res.status(200).json({
      status: 'success',
      data: {
        items: cartItems,
        totalAmount: totalAmount.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// ─── Remove from Cart ──────────────────────────────────────────────────────────
exports.removeFromCart = async (req, res) => {
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

    const cartItem = await Cart.findOne({
      where: { userId: user.id, courseId: course.id, activeInd: true }
    });

    if (!cartItem) {
      return res.status(404).json({ status: 'error', message: 'Item not found in cart' });
    }

    cartItem.activeInd = false;
    await cartItem.save();

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
