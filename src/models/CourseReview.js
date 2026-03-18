module.exports = (sequelize, DataTypes) => {
  const CourseReview = sequelize.define(
    'CourseReview',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reviewtoken: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique token identifier for the review'
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        },
        comment: 'Rating from 1 to 5'
      },
      reviewText: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      activeInd: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'course_reviews',
      timestamps: true
    }
  );

  CourseReview.associate = (models) => {
    // Review belongs to a course
    CourseReview.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });

    // Review belongs to a user
    CourseReview.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return CourseReview;
};
