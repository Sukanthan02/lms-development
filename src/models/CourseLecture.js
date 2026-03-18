module.exports = (sequelize, DataTypes) => {
  const CourseLecture = sequelize.define(
    'CourseLecture',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'course_sections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      videoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      duration: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      isPreview: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      tableName: 'course_lectures',
      timestamps: true
    }
  );

  CourseLecture.associate = (models) => {
    CourseLecture.belongsTo(models.CourseSection, {
      foreignKey: 'sectionId',
      as: 'section'
    });
  };

  return CourseLecture;
};
