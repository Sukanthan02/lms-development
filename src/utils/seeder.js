const db = require('../models');

const seedDatabase = async () => {
  try {
    // Check if users already exist
    const userCount = await db.User.count();
    
    if (userCount > 0) {
      console.log('Database already seeded');
      return;
    }

    // Create sample users
    const users = await db.User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@lms.com',
        password: 'admin123', // In production, hash passwords!
        role: 'admin',
        isActive: true
      },
      {
        name: 'John Instructor',
        email: 'john@lms.com',
        password: 'instructor123',
        role: 'instructor',
        isActive: true
      },
      {
        name: 'Jane Student',
        email: 'jane@lms.com',
        password: 'student123',
        role: 'student',
        isActive: true
      }
    ]);

    console.log(`${users.length} users seeded successfully`);

    // Create sample courses
    const instructorId = users.find(u => u.role === 'instructor').id;
    
    const courses = await db.Course.bulkCreate([
      {
        title: 'Introduction to Node.js',
        description: 'Learn the basics of Node.js development',
        instructorId: instructorId,
        duration: 20,
        maxStudents: 30,
        isActive: true
      },
      {
        title: 'Advanced Express.js',
        description: 'Master Express.js framework',
        instructorId: instructorId,
        duration: 30,
        maxStudents: 25,
        isActive: true
      }
    ]);

    console.log(`${courses.length} courses seeded successfully`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
