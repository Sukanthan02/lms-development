module.exports = (sequelize, DataTypes) => {
  const CourseDifficulty = sequelize.define(
    'CourseDifficulty',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Difficulty level name: Beginner, Intermediate, Expert'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'course_difficulties',
      timestamps: true
    }
  );

  CourseDifficulty.associate = (models) => {
    // A difficulty level can be assigned to many courses
    CourseDifficulty.hasMany(models.Course, {
      foreignKey: 'difficultyId',
      as: 'courses'
    });
  };

  return CourseDifficulty;
};
