const fs = require('fs');
const path = require('path');

const ImageRepository = require('../repositories/ImageRepository');

class ImageController {

    async fetchImages(req, res) {

        console.log(req.body);
        const {email} = req.body;
        try{
            const images = await ImageRepository.fetchNewImages(email);
            console.log(images);
            res.status(200).json({images: images});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

    async fetchImage(req, res) {
        const {userName, imageId} = req.body;
        try{
            const image = await ImageRepository.fetchImage(userName, imageId);
            res.status(200).json({image});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }

}

module.exports = new ImageController();
