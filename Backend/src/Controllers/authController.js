const { generateAccessToken } = require("../Tokens/tokens");
const UserRepository = require("../repositories/UserRepository");

class AuthController {
      async login(req, res) {
        const { email } = req.body;
        const token = generateAccessToken(email);
        res.status(200).json({token: token})
        try {
          const user = await UserRepository.authenticateUser(email);
          res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
          res.status(401).json({ message: error.message });
        }
      }
    
      async register(req, res) {
        const { email, age, gender } = req.body;
        try {
          await UserRepository.registerUser(email, age, gender);
          res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
}

module.exports = new AuthController();
