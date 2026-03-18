module.exports = (sequelize, DataTypes) => {
  const CourseSection = sequelize.define(
    'CourseSection',
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
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      tableName: 'course_sections',
      timestamps: true
    }
  );

  CourseSection.associate = (models) => {
    CourseSection.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
    CourseSection.hasMany(models.CourseLecture, {
      foreignKey: 'sectionId',
      as: 'lectures'
    });
  };

  return CourseSection;
};
