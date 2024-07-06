const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const ImageRepository = require('../repositories/ImageRepository');

class ImageController {

    async fetchImages(req, res) {

        const {email} = req.body;
        logger.info(`ImageController - fetchImages request by ${email}`);
        try{
            const images = await ImageRepository.fetchImages(email);
            res.status(200).json({images: images});
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`ImageController - fetchImages error message ${error}`);
        }
    }

    async fetchImage(req, res) {
     
        const { imageId } = req.body;
        logger.info(`ImageController - fetchImages request for imageid ${imageId}`);
        try{
            const image = await ImageRepository.fetchImage(imageId);
            res.status(200).json({image});
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`ImageController - fetchImage error message ${error}`);
        }
    }

    async fetchCategories(req, res) {
        logger.info(`ImageController - fetchCategories request`);
        try{
            const categories = await ImageRepository.fetchCategories();
            res.status(200).json({categories});
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`ImageController - fetchCategories error message ${error}`);
        }
    }

    async createImage(req, res) {
        const {email, imageName, categoryName, imageData} = req.body;
        logger.info(`ImageController - createImage request by ${email}`);
        try{
            const image = await ImageRepository.createImage(email, imageName, categoryName, imageData);
            res.status(200).json({image});
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`ImageController - createImage error message ${error}`);
        }
    }

    async deleteImage(req, res) {
        const {email, imageId} = req.body;
        logger.info(`ImageController - deleteImage request by ${email}`);
        try{
            const image = await ImageRepository.deleteImage(imageId);
            res.status(200).json({image});
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`ImageController - deleteImage error message ${error}`);
        }
    }

    async updateImage(req, res) {
        const {email, imageId, imageName, categoryName} = req.body;
        logger.info(`ImageController - updateImage request by ${email}`);
        try{
            const image = await ImageRepository.updateImage(imageId, imageName, categoryName);
            res.status(200).json({image});
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`ImageController - updateImage error message ${error}`);
        }
    }

    async getImageRatingsDistribution(req, res) {
        const {email, imageId} = req.body;
        logger.info(`ImageController - getImageRatingsDistribution request by ${email}`);
        try{
            const ratings = await ImageRepository.getImageRatingsDistribution(imageId);
            res.status(200).json({ratings});
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`ImageController - getImageRatingsDistribution error message ${error}`);
        }
    }

}

module.exports = new ImageController();
