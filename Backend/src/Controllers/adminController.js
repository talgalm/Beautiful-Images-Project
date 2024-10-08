const { generateAccessToken } = require("../Tokens/tokens");
const UserRepository = require("../repositories/UserRepository");
const RatingRepository = require("../repositories/RatingRepository");
const ImageRepository = require("../repositories/ImageRepository");
const AdminRepository = require("../repositories/AdminRepository");
const logger = require('../logger');
const path = require('path');


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

  async allRatingsPaginated(req, res) {
    try {
      const { email, page, limit } = req.body;
      logger.info(`AdminController - allRatingsPaginated request by ${email}`);
      const {ratings, count} = await RatingRepository.getAllRatingsPaginated(page, limit);
      res.status(200).json({ ratings, count });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - allRatingsPaginated error message ${error.message}`);
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

  async getAllImagesPaginated(req, res) {
    try {
      const { email, page, limit } = req.body;
      logger.info(`AdminController - getAllImagesPaginated request by ${email}`);
      const {images, count} = await ImageRepository.getAllImagesPaginated(page, limit);
      res.status(200).json({ images, count });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - getAllImagesPaginated error message ${error.message}`);
    }
  }

  async generateAndFetchPdfReport(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - generatePdfReport request by ${email}`);
      const filePath = await AdminRepository.generatePdfReport(email);
      setTimeout(() => {
        // must wait for pdf to close itself before sending it
        
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
        res.setHeader('Content-Type', 'application/pdf');
        
        console.log(filePath);
        
        res.download(filePath, path.basename(filePath), (err) => {
          if (err) {
            res.status(500).json({ message: 'Error downloading file' });
            logger.error(`AdminController - generateAndFetchPdfReport error message ${err.message}`);
          }
        });
      }, 100);
    } catch (error) {
      res.status(500).json({ message: error.message }); // Changed to status 500 for error response
      logger.error(`AdminController - generateAndFetchPdfReport error message ${error.message}`);
    }
  }

  async generateAndFetchCsvRatings(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - generateCsvReport request by ${email}`);
      const csvFilePath = await AdminRepository.generateCsvRatings(email);

      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(csvFilePath)}"`);
      res.setHeader('Content-Type', 'text/csv');

      res.download(csvFilePath, path.basename(csvFilePath), (err) => {
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
      const csvFilePath = await AdminRepository.generateCsvImages(email);

      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(csvFilePath)}"`);
      res.setHeader('Content-Type', 'text/csv');

      res.download(csvFilePath, path.basename(csvFilePath), (err) => {
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
      const csvFilePath = await AdminRepository.generateCsvUsers(email);

      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(csvFilePath)}"`);
      res.setHeader('Content-Type', 'text/csv');

      res.download(csvFilePath, path.basename(csvFilePath), (err) => {
        if (err) {
          res.status(500).json({ message: 'Error downloading file' });
          logger.error(`AdminController - generateCsvUsers error message ${err.message}`);
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      logger.error(`AdminController - generateCsvUsers error message ${error.message}`);
    }
  }
  
  async generateAndFetchCsvCategories(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - generateCsvCategories request by ${email}`);
      const csvFilePath = await AdminRepository.generateCsvCategories(email);

      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(csvFilePath)}"`);
      res.setHeader('Content-Type', 'text/csv');

      res.download(csvFilePath, path.basename(csvFilePath), (err) => {
        if (err) {
          res.status(500).json({ message: 'Error downloading file' });
          logger.error(`AdminController - generateCsvCategories error message ${err.message}`);
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      logger.error(`AdminController - generateCsvCategories error message ${error.message}`);
    }
  }

  async participantsData(req, res) {
    try {
      const { email } = req.body;
      logger.info(`AdminController - participantsData request by ${email}`);
      const participants = await AdminRepository.getParticipantsData();
      res.status(200).json({ participants });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - participantsData error message ${error.message}`);
    }
  }

  async createImage(req, res) {
    try {
      const { email, imageName, categoryName, imageData } = req.body;
      logger.info(`AdminController - createImage request by ${email}`);
      const image = await ImageRepository.createImage(email, imageName, categoryName, imageData);
      res.status(200).json({ image });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - createImage error message ${error.message}`);
    }
  }

  async deleteImage(req, res) {
    try {
      const { email, imageId } = req.body;
      logger.info(`AdminController - deleteImage request by ${email}`);
      const image = await ImageRepository.deleteImage(email, imageId);
      res.status(200).json({ image });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - deleteImage error message ${error.message}`);
    }
  }

  async updateImage(req, res) {
    try {
      const { email, imageId, imageName, categoryName } = req.body;
      logger.info(`AdminController - updateImage request by ${email}`);
      const image = await ImageRepository.updateImage(email, imageId, imageName, categoryName);
      res.status(200).json({ image });
    } catch (error) {
      res.status(200).json({ message: error.message });
      logger.error(`AdminController - updateImage error message ${error.message}`);
    }
  }
}

module.exports = new AdminController();
