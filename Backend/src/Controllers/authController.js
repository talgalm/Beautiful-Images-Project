const { generateAccessToken } = require("../tokens/tokens");
const UserRepository = require("../repositories/UserRepository");
const logger = require('../logger');

class AuthController {
      async login(req, res) {
        try {
          const { email } = req.body;
          logger.info(`AuthController - login request by ${email}`);
          await UserRepository.authenticateUser(email);
          const token = generateAccessToken(email);
          res.status(200).json({ message: 'Login successful', token: token });
        } catch (error) {
          res.status(200).json({ message: error.message });
          logger.error(`AuthController - login error message ${error.message}`);
        }
      }

      async adminLogin(req, res) {
        try {
          const { email, password } = req.body;
          logger.info(`AuthController - admin login request by ${email}`);
          await UserRepository.authenticateAdmin(email, password);
          const token = generateAccessToken(email);
          res.status(200).json({ message: 'Login successful', token: token });
        } catch (error) {
          res.status(200).json({ message: error.message });
          logger.error(`AuthController - login error message ${error.message}`);
        }
      }
    
      async register(req, res) {
        try {
          const {email , nickname , age , country , gender} = req.body;
          logger.info(`AuthController - register request by ${email} nickname: ${nickname} age: ${age} country: ${country} gender: ${gender}`);
          await UserRepository.registerUser(email, age, gender, country , nickname);
          res.status(200).json({ message: 'User registered successfully' });
        } catch (error) {
          res.status(200).json({ message: error.message });
          logger.error(`AuthController - register error message ${error.message}`);
        }
      }
}

module.exports = new AuthController();
