module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      categorytoken: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique token identifier for the category'
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      activeInd: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'categories',
      timestamps: true
    }
  );

  Category.associate = (models) => {
    // A category (level 1) has many sub-categories (level 2)
    Category.hasMany(models.SubCategory, {
      foreignKey: 'categoryId',
      as: 'subCategories'
    });

    // A category can have many courses directly
    Category.hasMany(models.Course, {
      foreignKey: 'categoryId',
      as: 'courses'
    });
  };

  return Category;
};
