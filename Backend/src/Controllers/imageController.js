const fs = require('fs');
const path = require('path');

const ImageRepository = require('../repositories/ImageRepository');

class ImageController {

    async fetchImages(req, res) {

        console.log(req.body);
        const {email} = req.body;
        try{
            const images = await ImageRepository.fetchImages(email);
            console.log(images);
            res.status(200).json({images: images});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async fetchImage(req, res) {
        console.log(req.body)
        const { imageId } = req.body;
        try{
            const image = await ImageRepository.fetchImage(imageId);
            res.status(200).json({image});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new ImageController();
