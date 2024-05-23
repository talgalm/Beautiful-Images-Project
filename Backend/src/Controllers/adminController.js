const { generateAccessToken } = require("../tokens/tokens");
const UserRepository = require("../repositories/UserRepository");
const logger = require('../logger');
const RatingRepository = require("../repositories/RatingRepository");
const ImageRepository = require("../repositories/ImageRepository");

class AdminController {
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

  async allRatings(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AuthController - allRatings request by ${email}`);
      const ratings = await RatingRepository.getAllRatings();
      res.status(200).json({ ratings });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AuthController - allRatings error message ${error.message}`);
    }
  }

  async userRatings(req, res) {
    try {
      const { email, userId } = req.body;
      logger.info(`AuthController - userRatings request by ${email} of user ${userId}`);
      const ratings = await RatingRepository.getUserRatings(userId);
      res.status(200).json({ ratings });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AuthController - userRatings error message ${error.message}`);
    }
  }

  async imageRatings(req, res) {
    try {
      const { email, imageId } = req.body;
      logger.info(`AuthController - imageRatings request by ${email} of image ${imageId}`);
      const ratings = await RatingRepository.getImageRatings(imageId);
      res.status(200).json({ ratings });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AuthController - imageRatings error message ${error.message}`);
    }
  }

  async getAllImages(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AuthController - getAllImages request by ${email}`);
      const images = await ImageRepository.getAllImages();
      res.status(200).json({ images });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AuthController - getAllImages error message ${error.message}`);
    }
  }
}

module.exports = new AdminController();
