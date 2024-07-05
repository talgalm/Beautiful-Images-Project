const { v4: uuidv4 } = require('uuid');
const { User } = require("../models");
const logger = require('../logger');

class UserRepository {
  
    static async registerUser(email, age, gender, country, nickname) {
      // Check if a user with the provided email already exists
      const existingUser = await User.findOne({ where: { email: email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      // Create a new user record in the database

      return User.create({ id: uuidv4(), email, nickname, age, country, gender });
    }
  
    static async authenticateUser(email) {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        throw new Error('Email does not exist');
      }
      return user;
    }

    static async authenticateAdmin(email, password) {
      const user = await User.findOne({ where: { email, password, isAdmin: true } });
      if (!user) {
        throw new Error('Email does not exist');
      }
      return user;
    }

    static async getUserId(email) {
      logger.info(`UserRepository - getUserId request by ${email}`);
      const user = await User.findOne({ where: { email } });
      if (!user) {
        logger.error(`UserRepository - getUserId request by ${email} error: User with this email does not exist`);
        throw new Error('Invalid email');
      }
      logger.info(`UserRepository - getUserId request by ${email} returned successfully`);
      return user.id;
    }

    static async getAllUsers() {
      return User.findAll();
    }

  }
  
  module.exports = UserRepository;
  