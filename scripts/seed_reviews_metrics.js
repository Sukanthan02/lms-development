/**
 * Seed Course Reviews (13 per course) and Course Metrics
 * Run: node scripts/seed_reviews_metrics.js
 */
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require(path.join(__dirname, '../src/models/index.js'));

const reviewTexts = [
  'Excellent course! Very well structured and easy to follow.',
  'Great content, learned a lot. Highly recommend to anyone starting out.',
  'The instructor explains complex concepts very clearly.',
  'Good course overall but could use more practical examples.',
  'Amazing value for the price. Exceeded my expectations.',
  'Very comprehensive and detailed. Worth every penny.',
  'Helped me land my first job in this field. Thank you!',
  'Some sections are a bit slow but overall a solid course.',
  'Best course I have taken on this topic. Five stars!',
  'Well-paced and the projects are very relevant to real-world scenarios.',
  'I wish there were more advanced topics covered, but great for beginners.',
  'The instructor is very engaging and knowledgeable.',
  'Completed the course in two weeks. Very practical and hands-on.',
];

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Get all courses
    const courses = await db.Course.findAll({ attributes: ['id', 'courseName'] });
    console.log(`Found ${courses.length} courses\n`);

    // Get all users (we'll cycle through them for reviews)
    const users = await db.User.findAll({ attributes: ['id', 'fullName'] });
    if (users.length === 0) {
      console.log('✗ No users found. Please seed users first.');
      process.exit(1);
    }

    // ── Seed Reviews ──
    console.log('→ Seeding Course Reviews (13 per course)...');
    for (const course of courses) {
      // Check if reviews already exist
      const existingCount = await db.CourseReview.count({ where: { courseId: course.id } });
      if (existingCount >= 13) {
        console.log(`  = ${course.courseName}: Already has ${existingCount} reviews`);
        continue;
      }

      const reviewsToCreate = 13 - existingCount;
      let totalRating = 0;

      for (let i = 0; i < reviewsToCreate; i++) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars mostly
        totalRating += rating;
        const userId = users[i % users.length].id;

        await db.CourseReview.create({
          reviewtoken: uuidv4(),
          courseId: course.id,
          userId: userId,
          rating: rating,
          reviewText: reviewTexts[i % reviewTexts.length],
          activeInd: true
        });
      }
      console.log(`  + ${course.courseName}: Added ${reviewsToCreate} reviews`);
    }

    // ── Seed Course Metrics ──
    console.log('\n→ Seeding Course Metrics...');
    for (const course of courses) {
      const existing = await db.CourseMetric.findOne({ where: { courseId: course.id } });

      // Calculate actual review stats
      const reviews = await db.CourseReview.findAll({ where: { courseId: course.id }, attributes: ['rating'] });
      const reviewCount = reviews.length;
      const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
      const ratingAverage = reviewCount > 0 ? (ratingSum / reviewCount).toFixed(2) : 0;

      const enrollments = 500 + Math.floor(Math.random() * 49500);
      const views = enrollments + Math.floor(Math.random() * 100000);
      const duration = 3600 + Math.floor(Math.random() * 20000);
      const popScore = (enrollments * 0.6 + views * 0.2 + ratingAverage * 100).toFixed(2);

      const metricData = {
        enrollmentCount: enrollments,
        viewCount: views,
        ratingAverage: ratingAverage,
        reviewCount: reviewCount,
        totalDurationSeconds: duration,
        popularityScore: popScore
      };

      if (existing) {
        await db.CourseMetric.update(metricData, { where: { courseId: course.id } });
        console.log(`  ~ Updated metrics: ${course.courseName}`);
      } else {
        await db.CourseMetric.create({ courseId: course.id, ...metricData });
        console.log(`  + Created metrics: ${course.courseName}`);
      }
    }

    console.log('\n✓ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Seeding failed:', error.message);
    process.exit(1);
  }
})();
