module.exports = (sequelize, DataTypes) => {
  const CourseLearn = sequelize.define(
    'CourseLearn',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      items: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Array of strings representing learning objectives'
      }
    },
    {
      tableName: 'course_learns',
      timestamps: true
    }
  );

  CourseLearn.associate = (models) => {
    CourseLearn.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return CourseLearn;
};
