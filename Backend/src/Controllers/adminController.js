const { generateAccessToken } = require("../tokens/tokens");
const UserRepository = require("../repositories/UserRepository");
const RatingRepository = require("../repositories/RatingRepository");
const ImageRepository = require("../repositories/ImageRepository");
const AdminRepository = require("../repositories/AdminRepository");
const logger = require('../logger');


class AdminController {
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;
      logger.info(`AdminController - admin login request by ${email}`);
      await UserRepository.authenticateAdmin(email, password);
      const token = generateAccessToken(email);
      res.status(200).json({ message: 'Login successful', token: token });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - login error message ${error.message}`);
    }
  }

  async allRatings(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - allRatings request by ${email}`);
      const ratings = await RatingRepository.getAllRatings();
      res.status(200).json({ ratings });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - allRatings error message ${error.message}`);
    }
  }

  async userRatings(req, res) {
    try {
      const { email, userId } = req.body;
      logger.info(`AdminController - userRatings request by ${email} of user ${userId}`);
      const ratings = await RatingRepository.getUserRatings(userId);
      res.status(200).json({ ratings });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - userRatings error message ${error.message}`);
    }
  }

  async imageRatings(req, res) {
    try {
      const { email, imageId } = req.body;
      logger.info(`AdminController - imageRatings request by ${email} of image ${imageId}`);
      const ratings = await RatingRepository.getImageRatings(imageId);
      res.status(200).json({ ratings });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - imageRatings error message ${error.message}`);
    }
  }

  async getAllImages(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - getAllImages request by ${email}`);
      const images = await ImageRepository.getAllImages();
      res.status(200).json({ images });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - getAllImages error message ${error.message}`);
    }
  }

  async generateAndFetchPdfReport(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - generatePdfReport request by ${email}`);
      await AdminRepository.generatePdfReport(email);

      res.status(200).json({ message: 'Report generated successfully' });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - generatePdfReport error message ${error.message}`);
    }
  }

  async generateAndFetchCsvRatings(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - generateCsvReport request by ${email}`);
      const csvFilePaths = await AdminRepository.generateCsvRatings(email);

      res.download(csvFilePaths, (err) => {
        if (err) {
          res.status(500).json({ message: 'Error downloading file' });
          logger.error(`AdminController - generateCsvReport error message ${err.message}`);
        }
      });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - generateCsvReport error message ${error.message}`);
    }
  }

  async generateAndFetchCsvImages(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - generateCsvImages request by ${email}`);
      const csvFilePaths = await AdminRepository.generateCsvImages(email);

      res.download(csvFilePaths, (err) => {
        if (err) {
          res.status(500).json({ message: 'Error downloading file' });
          logger.error(`AdminController - generateCsvImages error message ${err.message}`);
        }
      });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - generateCsvImages error message ${error.message}`);
    }
  }

  async generateAndFetchCsvUsers(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - generateCsvUsers request by ${email}`);
      const csvFilePaths = await AdminRepository.generateCsvUsers(email);

      res.download(csvFilePaths, (err) => {
        if (err) {
          res.status(500).json({ message: 'Error downloading file' });
          logger.error(`AdminController - generateCsvUsers error message ${err.message}`);
        }
      });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - generateCsvUsers error message ${error.message}`);
    }
  }
}

module.exports = new AdminController();
