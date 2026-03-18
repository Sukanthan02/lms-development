const { v4: uuidv4 } = require('uuid');
const db = require('../models');
const {
  Course, Category, SubCategory, CourseDifficulty,
  CourseLearn, CourseRequirement, CourseSection, CourseLecture,
  CourseMetric, CourseReview
} = db;

// ─── Create Course ───────────────────────────────────────────────────────────
exports.createCourse = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const {
      courseName,
      description,
      briefDescription,
      price,
      discount,
      instructorName,
      categorytoken,
      subcategorytoken,
      difficultyId,
      learningPoints,   // Array of strings
      requirements,     // Array of strings
      sections,         // Array of { title, lectures: [{ title, videoUrl, duration, isPreview }] }
      language,         // Array of strings
      subtitles,        // Array of strings
      banner            // String
    } = req.body;

    // ── Validate required fields ──
    if (!courseName || !price || !instructorName || !categorytoken) {
      return res.status(400).json({
        status: 'error',
        message: 'courseName, price, instructorName, and categorytoken are required'
      });
    }

    // ── Resolve category ──
    const category = await Category.findOne({ where: { categorytoken } });
    if (!category) {
      return res.status(404).json({ status: 'error', message: 'Category not found' });
    }

    // ── Resolve subcategory (optional) ──
    let subCategoryId = null;
    if (subcategorytoken) {
      const subCategory = await SubCategory.findOne({ where: { subcategorytoken } });
      if (!subCategory) {
        return res.status(404).json({ status: 'error', message: 'Subcategory not found' });
      }
      subCategoryId = subCategory.id;
    }

    // ── 1. Create the Course ──
    const course = await Course.create({
      coursetoken: uuidv4(),
      courseName,
      description: description || '',
      briefDescription: briefDescription || '',
      price,
      discount: discount || 0.00,
      instructorName,
      categoryId: category.id,
      subCategoryId,
      difficultyId: difficultyId || null,
      language: language || [],
      subtitles: subtitles || [],
      banner: banner || '',
      activeInd: true
    }, { transaction });

    // ── 2. Create Learning Points (JSON) ──
    if (learningPoints && Array.isArray(learningPoints) && learningPoints.length > 0) {
      await CourseLearn.create({
        courseId: course.id,
        items: learningPoints
      }, { transaction });
    }

    // ── 3. Create Requirements (JSON) ──
    if (requirements && Array.isArray(requirements) && requirements.length > 0) {
      await CourseRequirement.create({
        courseId: course.id,
        items: requirements
      }, { transaction });
    }

    // ── 4. Create Sections & Lectures ──
    if (sections && Array.isArray(sections) && sections.length > 0) {
      for (let i = 0; i < sections.length; i++) {
        const sectionData = sections[i];

        const section = await CourseSection.create({
          courseId: course.id,
          title: sectionData.title,
          order: i
        }, { transaction });

        if (sectionData.lectures && Array.isArray(sectionData.lectures)) {
          for (let j = 0; j < sectionData.lectures.length; j++) {
            const lecture = sectionData.lectures[j];
            await CourseLecture.create({
              sectionId: section.id,
              title: lecture.title,
              videoUrl: lecture.videoUrl || '',
              duration: lecture.duration || '',
              isPreview: lecture.isPreview || false,
              order: j
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    // ── Fetch the full course with all relations ──
    const fullCourse = await Course.findByPk(course.id, {
      include: [
        { model: Category, as: 'category', attributes: ['name', 'categorytoken'] },
        { model: SubCategory, as: 'subCategory', attributes: ['name', 'subcategorytoken'] },
        { model: CourseDifficulty, as: 'difficulty', attributes: ['name'] },
        { model: CourseLearn, as: 'learningPoints', attributes: ['items'] },
        { model: CourseRequirement, as: 'requirements', attributes: ['items'] },
        {
          model: CourseSection, as: 'sections',
          include: [{ model: CourseLecture, as: 'lectures' }]
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      data: fullCourse
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ─── Get All Courses (with filters and ratings) ─────────────────────────────
exports.getAllCourses = async (req, res) => {
  try {
    const { categorytoken, subcategorytoken, difficulty } = req.query;
    const whereClause = { activeInd: true };
    const activeFilters = {};

    // Filter by Category Token
    if (categorytoken) {
      const category = await Category.findOne({ where: { categorytoken } });
      if (category) {
        whereClause.categoryId = category.id;
        activeFilters.category = category.name;
      } else {
        return res.status(404).json({ status: 'error', message: 'Category not found' });
      }
    }

    // Filter by SubCategory Token
    if (subcategorytoken) {
      const subCategory = await SubCategory.findOne({ where: { subcategorytoken } });
      if (subCategory) {
        whereClause.subCategoryId = subCategory.id;
        activeFilters.subcategory = subCategory.name;
      } else {
        return res.status(404).json({ status: 'error', message: 'Subcategory not found' });
      }
    }

    // Filter by Difficulty Name
    if (difficulty) {
      const difficultyRecord = await CourseDifficulty.findOne({ where: { name: difficulty } });
      if (difficultyRecord) {
        whereClause.difficultyId = difficultyRecord.id;
        activeFilters.difficulty = difficultyRecord.name;
      } else {
        // Fallback or ignore if not found
        console.warn(`Difficulty level not found: ${difficulty}`);
      }
    }

    const courses = await Course.findAll({
      where: whereClause,
      attributes: [
        'courseName',
        'coursetoken',
        'price',
        'instructorName',
        [db.sequelize.fn('COUNT', db.sequelize.col('reviews.id')), 'reviewCount'],
        [db.sequelize.fn('AVG', db.sequelize.col('reviews.rating')), 'averageRating']
      ],
      include: [
        {
          model: db.CourseReview,
          as: 'reviews',
          attributes: [],
          required: false
        }
      ],
      group: ['Course.id'],
      subQuery: false
    });

    res.status(200).json({
      status: 'success',
      data: courses.map(course => {
        const plain = course.get({ plain: true });
        return {
          courseName: plain.courseName,
          coursetoken: plain.coursetoken,
          price: plain.price,
          instructorName: plain.instructorName,
          rating: plain.averageRating ? parseFloat(plain.averageRating).toFixed(1) : "0.0",
          reviewCount: parseInt(plain.reviewCount) || 0
        };
      }),
      activeFilters
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ─── Get Course By Token ─────────────────────────────────────────────────────
exports.getCourseByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const course = await Course.findOne({
      where: { coursetoken: token },
      include: [
        { model: Category, as: 'category', attributes: ['name', 'categorytoken'] },
        { model: SubCategory, as: 'subCategory', attributes: ['name', 'subcategorytoken'] },
        { model: CourseDifficulty, as: 'difficulty', attributes: ['name'] },
        { model: CourseLearn, as: 'learningPoints', attributes: ['items'] },
        { model: CourseRequirement, as: 'requirements', attributes: ['items'] },
        {
          model: CourseSection,
          as: 'sections',
          include: [{ model: CourseLecture, as: 'lectures' }]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: course
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ─── Get Course Details ──────────────────────────────────────────────────────
exports.getCourseDetails = async (req, res) => {
  try {
    const { token } = req.params;

    const course = await Course.findOne({
      where: { coursetoken: token },
      include: [
        { model: Category, as: 'category', attributes: ['name'] },
        { model: SubCategory, as: 'subCategory', attributes: ['name'] },
        { model: CourseDifficulty, as: 'difficulty', attributes: ['name'] },
        { model: CourseLearn, as: 'learningPoints', attributes: ['items'] },
        { model: CourseRequirement, as: 'requirements', attributes: ['items'] },
        { model: CourseMetric, as: 'metrics' },
        {
          model: CourseSection,
          as: 'sections',
          separate: true,
          order: [['order', 'ASC']],
          include: [
            {
              model: CourseLecture,
              as: 'lectures',
              separate: true,
              order: [['order', 'ASC']]
            }
          ]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    const plain = course.get({ plain: true });

    // Format the response as requested
    const responseData = {
      categoryName: plain.category ? plain.category.name : null,
      subcategoryName: plain.subCategory ? plain.subCategory.name : null,
      courseName: plain.courseName,
      description: plain.description,
      briefDescription: plain.briefDescription,
      rating: plain.metrics ? parseFloat(plain.metrics.ratingAverage).toFixed(1) : "0.0",
      reviewCount: plain.metrics ? parseInt(plain.metrics.reviewCount) : 0,
      instructorName: plain.instructorName,
      subtitles: plain.subtitles || [],
      language: plain.language || [],
      banner: plain.banner,
      sections: plain.sections.map(s => ({
        title: s.title,
        lectures: s.lectures.map(l => ({
          title: l.title,
          duration: l.duration,
          isPreview: l.isPreview
        }))
      })),
      learningPoints: plain.learningPoints ? plain.learningPoints.items : [],
      requirements: plain.requirements ? plain.requirements.items : []
    };

    return res.status(200).json({
      status: 'success',
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ─── Get Course Reviews ──────────────────────────────────────────────────────
exports.getCourseReviews = async (req, res) => {
  try {
    const { token } = req.params;

    const course = await Course.findOne({
      where: { coursetoken: token },
      attributes: ['id']
    });

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Fetch reviews with user info
    const reviews = await db.CourseReview.findAll({
      where: { courseId: course.id, activeInd: true },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['fullName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate distribution
    const totalReviews = reviews.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sumRating = 0;

    reviews.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      sumRating += r.rating;
    });

    const averageRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : "0.0";

    const responseData = {
      averageRating,
      totalReviews,
      ratingDistribution: distribution,
      reviews: reviews.map(r => ({
        userName: r.user ? r.user.fullName : 'Anonymous',
        rating: r.rating,
        reviewMessage: r.reviewText,
        commentedDate: r.createdAt
      }))
    };

    return res.status(200).json({
      status: 'success',
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ─── Homepage APIs ──────────────────────────────────────────────────────────

// Helper for formatting courses with metrics for homepage
const formatHomepageCourses = (courses) => {
  return courses.map(course => {
    const plain = course.get({ plain: true });
    const rating = plain.metrics ? plain.metrics.ratingAverage : "0.0";
    const reviews = plain.metrics ? plain.metrics.reviewCount : 0;

    return {
      courseName: plain.courseName,
      coursetoken: plain.coursetoken,
      price: plain.price,
      instructorName: plain.instructorName,
      rating: parseFloat(rating).toFixed(1),
      reviewCount: parseInt(reviews) || 0
    };
  });
};

// 1. Trending Courses (Ordered by View Count)
exports.getTrendingCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { activeInd: true },
      attributes: ['courseName', 'coursetoken', 'price', 'instructorName'],
      include: [
        {
          model: db.CourseMetric,
          as: 'metrics',
          attributes: ['ratingAverage', 'reviewCount', 'viewCount']
        }
      ],
      order: [[{ model: db.CourseMetric, as: 'metrics' }, 'viewCount', 'DESC']],
      limit: 4
    });

    res.status(200).json({ status: 'success', data: formatHomepageCourses(courses) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. Top Courses (Ordered by Rating Average)
exports.getTopCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { activeInd: true },
      attributes: ['courseName', 'coursetoken', 'price', 'instructorName'],
      include: [
        {
          model: db.CourseMetric,
          as: 'metrics',
          attributes: ['ratingAverage', 'reviewCount']
        }
      ],
      order: [[{ model: db.CourseMetric, as: 'metrics' }, 'ratingAverage', 'DESC']],
      limit: 4
    });

    res.status(200).json({ status: 'success', data: formatHomepageCourses(courses) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. Under 2 Hours Courses
exports.getShortCourses = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const courses = await Course.findAll({
      where: { activeInd: true },
      attributes: ['courseName', 'coursetoken', 'price', 'instructorName'],
      include: [
        {
          model: db.CourseMetric,
          as: 'metrics',
          attributes: ['ratingAverage', 'reviewCount', 'totalDurationSeconds'],
          where: {
            totalDurationSeconds: { [Op.lt]: 7200 } // Under 2 hours (2 * 60 * 60)
          }
        }
      ],
      order: [[{ model: db.CourseMetric, as: 'metrics' }, 'totalDurationSeconds', 'ASC']],
      limit: 4
    });

    res.status(200).json({ status: 'success', data: formatHomepageCourses(courses) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. Most Popular Courses (Ordered by Enrollment Count)
exports.getPopularCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { activeInd: true },
      attributes: ['courseName', 'coursetoken', 'price', 'instructorName'],
      include: [
        {
          model: db.CourseMetric,
          as: 'metrics',
          attributes: ['ratingAverage', 'reviewCount', 'enrollmentCount']
        }
      ],
      order: [[{ model: db.CourseMetric, as: 'metrics' }, 'enrollmentCount', 'DESC']],
      limit: 4
    });

    res.status(200).json({ status: 'success', data: formatHomepageCourses(courses) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. New Courses (Ordered by Creation Date)
exports.getNewCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { activeInd: true },
      attributes: ['courseName', 'coursetoken', 'price', 'instructorName', 'createdAt'],
      include: [
        {
          model: db.CourseMetric,
          as: 'metrics',
          attributes: ['ratingAverage', 'reviewCount']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 4
    });

    res.status(200).json({ status: 'success', data: formatHomepageCourses(courses) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 6. Intermediate and Advanced Courses
exports.getAdvancedCourses = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const courses = await Course.findAll({
      where: { activeInd: true },
      attributes: ['courseName', 'coursetoken', 'price', 'instructorName'],
      include: [
        {
          model: db.CourseDifficulty,
          as: 'difficulty',
          where: {
            name: { [Op.in]: ['Intermediate', 'Expert'] }
          },
          attributes: ['name']
        },
        {
          model: db.CourseMetric,
          as: 'metrics',
          attributes: ['ratingAverage', 'reviewCount']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 4
    });

    res.status(200).json({ status: 'success', data: formatHomepageCourses(courses) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
