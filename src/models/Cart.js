module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      carttoken: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique token identifier for the cart entry'
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
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },

      activeInd: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'carts',
      timestamps: true,
      // Prevent duplicate cart entries for the same user+course
      indexes: [
        {
          unique: true,
          fields: ['userId', 'courseId'],
          name: 'unique_user_course_cart'
        }
      ]
    }
  );

  Cart.associate = (models) => {
    // Cart belongs to a user
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Cart belongs to a course
    Cart.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course'
    });
  };

  return Cart;
};
