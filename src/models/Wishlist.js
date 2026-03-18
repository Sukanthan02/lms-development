module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define(
    'Wishlist',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      wishlisttoken: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique token identifier for the wishlist entry'
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
      activeInd: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'wishlists',
      timestamps: true,
      // Prevent duplicate wishlist entries for the same user+course
      indexes: [
        {
          unique: true,
          fields: ['userId', 'courseId'],
          name: 'unique_user_course_wishlist'
        }
      ]
    }
  );

  Wishlist.associate = (models) => {
    // Wishlist belongs to a user
    Wishlist.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Wishlist belongs to a course
    Wishlist.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return Wishlist;
};
