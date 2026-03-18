module.exports = (sequelize, DataTypes) => {
  const CourseMetric = sequelize.define(
    'CourseMetric',
    {
      courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'courses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      enrollmentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Total students enrolled - for "Most Popular"'
      },
      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Total views - for "Trending"'
      },
      ratingAverage: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00,
        comment: 'Average rating - for "Top Courses"'
      },
      reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Total reviews - for "Top Courses"'
      },
      totalDurationSeconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Total duration in seconds - for "Under 2 Hours"'
      },
      popularityScore: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        comment: 'Calculated score for trending algorithms'
      }
    },
    {
      tableName: 'course_metrics',
      timestamps: true
    }
  );

  CourseMetric.associate = (models) => {
    CourseMetric.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return CourseMetric;
};
