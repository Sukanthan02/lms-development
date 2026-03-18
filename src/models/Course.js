module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      coursetoken: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique token identifier for the course'
      },
      courseName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      briefDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'High-level summary of the course'
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      discount: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.00,
        comment: 'Discount percentage e.g. 10.00 means 10%'
      },
      instructorName: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Name of the instructor (denormalized for display)'
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'sub_categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      activeInd: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      difficultyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'course_difficulties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    },
    {
      tableName: 'courses',
      timestamps: true
    }
  );

  Course.associate = (models) => {
    // Course belongs to a top-level Category
    Course.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // Course belongs to a SubCategory
    Course.belongsTo(models.SubCategory, {
      foreignKey: 'subCategoryId',
      as: 'subCategory'
    });

    // Course belongs to a Difficulty level
    Course.belongsTo(models.CourseDifficulty, {
      foreignKey: 'difficultyId',
      as: 'difficulty'
    });

    // Course has many reviews
    Course.hasMany(models.CourseReview, {
      foreignKey: 'courseId',
      as: 'reviews'
    });

    // Detailed Course Info
    Course.hasOne(models.CourseLearn, {
      foreignKey: 'courseId',
      as: 'learningPoints'
    });

    Course.hasOne(models.CourseRequirement, {
      foreignKey: 'courseId',
      as: 'requirements'
    });

    Course.hasMany(models.CourseSection, {
      foreignKey: 'courseId',
      as: 'sections'
    });

    Course.hasOne(models.CourseMetric, {
      foreignKey: 'courseId',
      as: 'metrics'
    });

    // Course can appear in many wishlists
    Course.hasMany(models.Wishlist, {
      foreignKey: 'courseId',
      as: 'wishlists'
    });

    // Course can appear in many carts
    Course.hasMany(models.Cart, {
      foreignKey: 'courseId',
      as: 'carts'
    });
  };

  return Course;
};
