const { User } = require("../Models");


class UserRepository {
  
    static async registerUser(email, age, gender) {
      console.log("registering user: " + email);
      // Check if a user with the provided email already exists
      const existingUser = await User.findOne({ where: { email: email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
  
      // Create a new user record in the database
      return User.create({ email, nickname: 'nickname', age, country : 'country', gender });
    }
  
    static async authenticateUser(email) {
      console.log("authentication user: " + email);
    
      // Verify user credentials
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        console.log(`${email} does not exist. You cannot log in!`);
        throw new Error('Email does not exist');
      } else {
        console.log(`${email} exists. You can log in!`);
      }
      return user;
    }
    

    static async getUser(email) {
      console.log("get user: " + email);
      // Verify user credentials
      const user = await User.find({ where: { email: email } });
      if (!user) {
        throw new Error('Invalid email');
      }
      return user;
    }

  }
  
  module.exports = UserRepository;
  