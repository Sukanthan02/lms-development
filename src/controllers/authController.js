const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET || 'lms_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ─── Register ────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'fullName, email and password are required'
      });
    }

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Email is already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique usertoken
    const usertoken = uuidv4();

    // Create user
    const user = await User.create({
      usertoken,
      fullName,
      email,
      password: hashedPassword,
      activeInd: true
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, usertoken: user.usertoken },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Save accessToken on user record
    await user.update({ accessToken: token });

    const userData = user.toJSON();
    delete userData.password;

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      data: userData
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.activeInd) {
      return res.status(403).json({
        status: 'error',
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, usertoken: user.usertoken },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update accessToken on user record
    await user.update({ accessToken: token });

    const userData = user.toJSON();
    delete userData.password;

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      data: userData
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ─── Get Profile (Self) ──────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    // req.user is populated by protect middleware
    const user = await User.findOne({
      where: { usertoken: req.user.usertoken },
      attributes: { exclude: ['password', 'accessToken'] },
      include: [
        {
          model: db.UserDetail,
          as: 'details'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ─── Update Profile (Self) ───────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    // req.user is populated by protect middleware
    const user = await User.findOne({
      where: { usertoken: req.user.usertoken }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const {
      headline,
      biography,
      language,
      websiteUrl,
      facebookUrl,
      linkedinUrl,
      profileImage
    } = req.body;

    // Find or create UserDetail record
    let userDetail = await db.UserDetail.findOne({
      where: { userId: user.id }
    });

    if (userDetail) {
      // Update existing record
      await userDetail.update({
        headline: headline !== undefined ? headline : userDetail.headline,
        biography: biography !== undefined ? biography : userDetail.biography,
        language: language !== undefined ? language : userDetail.language,
        websiteUrl: websiteUrl !== undefined ? websiteUrl : userDetail.websiteUrl,
        facebookUrl: facebookUrl !== undefined ? facebookUrl : userDetail.facebookUrl,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : userDetail.linkedinUrl,
        profileImage: profileImage !== undefined ? profileImage : userDetail.profileImage
      });
    } else {
      // Create new record
      userDetail = await db.UserDetail.create({
        userId: user.id,
        headline,
        biography,
        language,
        websiteUrl,
        facebookUrl,
        linkedinUrl,
        profileImage
      });
    }

    // Fetch updated user with details
    const updatedUser = await User.findOne({
      where: { id: user.id },
      attributes: { exclude: ['password', 'accessToken'] },
      include: [
        {
          model: db.UserDetail,
          as: 'details'
        }
      ]
    });

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
