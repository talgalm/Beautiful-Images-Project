const User = require('../Models/user');

class UserRepository {
  
    static async registerUser(email) {
      // Check if a user with the provided email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
  
      // Create a new user record in the database
      return User.create({ email, age, gender });
    }
  
    static async authenticateUser(email) {
      // Verify user credentials
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log(`${email} not exist you can not login!!!!`)
        throw new Error('Invalid email');
      }
      else{
        console.log(`${email} exists you can login!!!!`)
      }
      return user;
    }
  }
  
  module.exports = UserRepository;
  