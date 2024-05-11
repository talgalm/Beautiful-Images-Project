'use strict';
const { v4: uuidv4 } = require('uuid');

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
      { id: uuidv4(), email: 'user@gmail.com', nickname: "user", age: 25, country:"Israel", gender: 'female', isAdmin: false, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), email: 'user1@gmail.com', nickname: "user1", age: 25, country:"Israel", gender: 'male', isAdmin: false, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), email: 'admin@gmail.com', nickname: "admin", age: 28, country:"Israel", gender: 'male', password:"admin123", isAdmin:true, createdAt: new Date(), updatedAt: new Date() }
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
