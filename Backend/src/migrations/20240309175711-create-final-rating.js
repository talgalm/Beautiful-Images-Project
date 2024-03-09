'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FinalRatings', {
      imageId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      userName: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FinalRatings');
  }
};