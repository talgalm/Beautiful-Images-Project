'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Users', [
      { email: 'user1@example.com', age: 25, gender: 'male', createdAt: new Date(), updatedAt: new Date() },
      { email: 'user2@example.com', age: 30, gender: 'female', createdAt: new Date(), updatedAt: new Date() },
      { email: 'user3@example.com', age: 28, gender: 'male', createdAt: new Date(), updatedAt: new Date() }
      // Add more dummy users as needed
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
