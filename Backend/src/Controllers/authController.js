const { generateAccessToken } = require("../Tokens/tokens");
const UserRepository = require("../repositories/UserRepository");

class AuthController {
      async login(req, res) {
        try {
          const { email } = req.body;
          await UserRepository.authenticateUser(email);
          const token = generateAccessToken(email);
          res.status(200).json({ message: 'Login successful', token: token });
        } catch (error) {
          res.status(200).json({ message: error.message });
        }
      }
    
      async register(req, res) {
        try {
          const {email , nickname , age , country , gender} = req.body;
          await UserRepository.registerUser(email, age, gender);
          res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
}

module.exports = new AuthController();
