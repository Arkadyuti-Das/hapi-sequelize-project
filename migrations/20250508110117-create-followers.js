'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('follows', {
      followerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
        followedBy: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
        }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('follows');
  }
};
