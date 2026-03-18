module.exports = (sequelize, DataTypes) => {
  const CourseRequirement = sequelize.define(
    'CourseRequirement',
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
        comment: 'Array of strings representing requirements'
      }
    },
    {
      tableName: 'course_requirements',
      timestamps: true
    }
  );

  CourseRequirement.associate = (models) => {
    CourseRequirement.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return CourseRequirement;
};
