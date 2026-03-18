require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const db = require(path.join(__dirname, '../src/models/index.js'));
const { sequelize, Sequelize } = db;

// ─── Data ─────────────────────────────────────────────────────────────────────
const users = [
  {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    details: {
      headline: 'Full Stack Developer & Educator',
      biography: 'Experienced developer with 10+ years in the industry.',
      language: 'English',
      websiteUrl: 'https://johndoe.com',
      facebookUrl: 'https://facebook.com/johndoe',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      profileImage: 'https://placehold.co/400'
    }
  },
  {
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    details: {
      headline: 'UI/UX Designer',
      biography: 'Creative designer focused on user-centric products.',
      language: 'English',
      websiteUrl: 'https://janesmith.design',
      linkedinUrl: 'https://linkedin.com/in/janesmith',
      profileImage: 'https://placehold.co/400'
    }
  }
];

const difficulties = [
  { name: 'Beginner',     description: 'Introduction to the topic, no prior knowledge required.' },
  { name: 'Intermediate', description: 'Deep dive into concepts, some prior knowledge expected.' },
  { name: 'Expert',       description: 'Advanced topics and complex problem solving.' },
];

const categories = [
  { name: 'Development', description: 'Programming and Software Development' },
  { name: 'Business',    description: 'Business Skills and Entrepreneurship' },
  { name: 'Design',      description: 'UI/UX and Graphic Design' },
];

const subCategoryMap = [
  { categoryName: 'Development', name: 'Web Development',    description: 'Frontend and Backend web development' },
  { categoryName: 'Development', name: 'Mobile Development', description: 'iOS and Android app development' },
  { categoryName: 'Development', name: 'Data Science',       description: 'Machine Learning and Data Analysis' },
  { categoryName: 'Business',    name: 'Finance',            description: 'Accounting, investing and financial management' },
  { categoryName: 'Business',    name: 'Marketing',          description: 'Digital and traditional marketing strategies' },
  { categoryName: 'Design',      name: 'UI/UX Design',       description: 'User interface and experience design' },
  { categoryName: 'Design',      name: 'Graphic Design',     description: 'Visual branding and graphic design' },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Sync all models to create tables
    console.log('→ Syncing models (Resetting database)...');
    await sequelize.sync({ force: true });
    console.log('✓ Models synced\n');

    // 1. Seed Difficulties
    console.log('→ Seeding Course Difficulties...');
    for (const diff of difficulties) {
      await db.CourseDifficulty.create(diff);
      console.log(`  + Created: ${diff.name}`);
    }

    // 2. Seed Users & Details
    console.log('\n→ Seeding Users...');
    for (const userData of users) {
      const { details, ...userFields } = userData;
      const user = await db.User.create({
        ...userFields,
        usertoken: uuidv4(),
        activeInd: true
      });
      
      await db.UserDetail.create({
        ...details,
        userId: user.id
      });
      console.log(`  + Created User: ${user.fullName} (${user.email})`);
    }

    // 3. Seed Categories & SubCategories
    console.log('\n→ Seeding Categories & SubCategories...');
    for (const catData of categories) {
      const category = await db.Category.create({
        ...catData,
        categorytoken: uuidv4(),
        activeInd: true
      });
      console.log(`  + Created Category: ${category.name}`);

      const subs = subCategoryMap.filter(s => s.categoryName === catData.name);
      for (const subData of subs) {
        await db.SubCategory.create({
          name: subData.name,
          description: subData.description,
          subcategorytoken: uuidv4(),
          categoryId: category.id,
          activeInd: true
        });
        console.log(`    - Created SubCategory: ${subData.name}`);
      }
    }

    console.log('\n✓ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
