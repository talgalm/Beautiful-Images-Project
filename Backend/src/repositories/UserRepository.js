const { User } = require("../Models");


class UserRepository {
  
    static async registerUser(props) {
      console.log("registering user: " + props.email);
      const { email, nickname, age, country, gender } = props;
      // Check if a user with the provided email already exists
      const existingUser = await User.findOne({ where: { email: email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
  
      // Create a new user record in the database
      return User.create({ email, nickname, age, country, gender });
    }
  
    static async authenticateUser(email) {
      console.log("authentication user: " + props.email);

      // Verify user credentials
      const user = await User.find({ email: email });
      if (!user) {
        console.log(`${email} not exist you can not login!!!!`)
        throw new Error('Invalid email');
      }
      else{
        console.log(`${email} exists you can login!!!!`)
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
  