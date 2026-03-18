const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// GET /api/courses
router.get('/', courseController.getAllCourses);

// Homepage APIs (must be above /:token)
router.get('/home/trending', courseController.getTrendingCourses);
router.get('/home/top', courseController.getTopCourses);
router.get('/home/short', courseController.getShortCourses);
router.get('/home/popular', courseController.getPopularCourses);
router.get('/home/new', courseController.getNewCourses);
router.get('/home/advanced', courseController.getAdvancedCourses);

// Detailed routes
router.get('/details/:token', courseController.getCourseDetails);
router.get('/reviews/:token', courseController.getCourseReviews);

// GET /api/courses/:token
router.get('/:token', courseController.getCourseByToken);

// POST /api/courses
router.post('/', courseController.createCourse);

module.exports = router;
