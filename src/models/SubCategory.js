module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define(
    'SubCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      subcategorytoken: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique token identifier for the sub-category'
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      tableName: 'sub_categories',
      timestamps: true
    }
  );

  SubCategory.associate = (models) => {
    // A sub-category belongs to a parent category
    SubCategory.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // A sub-category can have many courses
    SubCategory.hasMany(models.Course, {
      foreignKey: 'subCategoryId',
      as: 'courses'
    });
  };

  return SubCategory;
};
