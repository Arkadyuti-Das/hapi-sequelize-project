'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    static associate(models) {
      // Post belongs to User
      post.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  post.init({
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'post',
    tableName: 'posts',
    timestamps: true,
    paranoid: true
  });

  return post;
};
