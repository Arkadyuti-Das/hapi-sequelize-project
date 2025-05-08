'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // define association here
      user.hasMany(models.post, {
        foreignKey: 'userId',
        as: 'posts',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  user.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'user',
    // freezeTableName: true
  });
  return user;
};
