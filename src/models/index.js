const { Sequelize } = require('sequelize');
const path = require('path');

const config = require(path.join(__dirname, '../../config/database.js'));

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool
  }
);

const db = {};

// ─── Import Models Explicitly ────────────────────────────────────────────────
db.User        = require('./User')(sequelize, Sequelize.DataTypes);
db.Category    = require('./Category')(sequelize, Sequelize.DataTypes);
db.SubCategory = require('./SubCategory')(sequelize, Sequelize.DataTypes);
db.Course      = require('./Course')(sequelize, Sequelize.DataTypes);
db.CourseDifficulty = require('./CourseDifficulty')(sequelize, Sequelize.DataTypes);
db.CourseReview = require('./CourseReview')(sequelize, Sequelize.DataTypes);
db.Wishlist    = require('./Wishlist')(sequelize, Sequelize.DataTypes);
db.Cart        = require('./Cart')(sequelize, Sequelize.DataTypes);
db.CourseLearn = require('./CourseLearn')(sequelize, Sequelize.DataTypes);
db.CourseRequirement = require('./CourseRequirement')(sequelize, Sequelize.DataTypes);
db.CourseSection = require('./CourseSection')(sequelize, Sequelize.DataTypes);
db.CourseLecture = require('./CourseLecture')(sequelize, Sequelize.DataTypes);
db.CourseMetric  = require('./CourseMetric')(sequelize, Sequelize.DataTypes);
db.UserDetail    = require('./UserDetail')(sequelize, Sequelize.DataTypes);

// ─── Setup Associations ──────────────────────────────────────────────────────
// Run each model's associate() if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ─── Association Summary ─────────────────────────────────────────────────────
// User         hasMany  CourseReview  (userId)
// User         hasMany  Wishlist      (userId)
// User         hasMany  Cart          (userId)
// User         hasOne   UserDetail    (userId)
//
// UserDetail   belongsTo User        (userId)
// Category     hasMany  Course        (categoryId)
//
// SubCategory  belongsTo Category    (categoryId)
// SubCategory  hasMany  Course        (subCategoryId)
//
// Course       belongsTo Category    (categoryId)
// Course       belongsTo SubCategory (subCategoryId)
// Course       belongsTo CourseDifficulty (difficultyId)
// Course       hasOne   CourseLearn  (courseId)
// Course       hasOne   CourseRequirement (courseId)
// Course       hasMany  CourseSection (courseId)
// Course       hasMany  CourseReview  (courseId)
// Course       hasMany  Wishlist      (courseId)
// Course       hasMany  Cart          (courseId)
// Course       hasOne   CourseMetric  (courseId)
//
// CourseDifficulty hasMany Course     (difficultyId)
//
// CourseMetric     belongsTo Course   (courseId)
//
// CourseSection    belongsTo Course   (courseId)
// CourseSection    hasMany  CourseLecture (sectionId)
//
// CourseLecture    belongsTo CourseSection (sectionId)
//
// CourseLearn      belongsTo Course (courseId)
//
// CourseRequirement belongsTo Course (courseId)
//
// CourseReview belongsTo Course      (courseId)
// CourseReview belongsTo User        (userId)
//
// Wishlist     belongsTo User        (userId)
// Wishlist     belongsTo Course      (courseId)
//
// Cart         belongsTo User        (userId)
// Cart         belongsTo Course      (courseId)
// ─────────────────────────────────────────────────────────────────────────────

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
