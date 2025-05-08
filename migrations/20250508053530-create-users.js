'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable("users", {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
      },
      username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [6, 10],
            msg: 'Username must be within 6 to 10 characters'
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4, 10],
            msg: 'Password must be between 4 to 10 characters'
          }
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      }
     })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
  }
};
