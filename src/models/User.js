module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usertoken: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique token identifier for the user'
      },
      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      activeInd: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Active indicator: true = active, false = inactive'
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'JWT or session access token'
      }
    },
    {
      tableName: 'users',
      timestamps: true
    }
  );

  User.associate = (models) => {
    // Extended profile info
    User.hasOne(models.UserDetail, {
      foreignKey: 'userId',
      as: 'details'
    });

    // A user can have many course reviews
    User.hasMany(models.CourseReview, {
      foreignKey: 'userId',
      as: 'reviews'
    });

    // A user can have many wishlist items
    User.hasMany(models.Wishlist, {
      foreignKey: 'userId',
      as: 'wishlist'
    });

    // A user can have many cart items
    User.hasMany(models.Cart, {
      foreignKey: 'userId',
      as: 'cart'
    });
  };

  return User;
};
