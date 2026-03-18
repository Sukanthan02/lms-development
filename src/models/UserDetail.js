module.exports = (sequelize, DataTypes) => {
  const UserDetail = sequelize.define(
    'UserDetail',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      headline: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      biography: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      language: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      websiteUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      facebookUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      linkedinUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      profileImage: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'user_details',
      timestamps: true
    }
  );

  UserDetail.associate = (models) => {
    UserDetail.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UserDetail;
};
