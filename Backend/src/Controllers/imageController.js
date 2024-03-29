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
            console.log(images);
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

}

module.exports = new ImageController();
