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

    async fetchSessionImages(req, res) {
        const {userName} = req.body;
        try{
            const images = await ImageRepository.fetchSessionImages(userName);
            res.status(200).json({images});
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    }


    getAll(req, res) {
        fs.readdir(path.join(__dirname, '../../images/small'), (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).end('Server error');
                return;
            }

            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.avif' || ext === '.webp';
            });

            Promise.all(imageFiles.map(file => {
                return new Promise((resolve, reject) => {
                    fs.readFile(path.join(__dirname, '../../images/small', file), { encoding: 'base64' }, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve({ file, data});
                    });
                });
            }))
            .then(images => {
                
                res.json(images);
            })
            .catch(err => {
                console.error(err);
                res.status(500).end('Server error');
            });
        });
    }
    get(req, res) {
        fs.readdir(path.join(__dirname, `../../images/${req.body.size}`), (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).end('Server error');
                return;
            }
            console.log(files)
    
            const file = files.find(file => file === req.body.name);
            if (!file) {
                res.status(404).end('File not found');
                return;
            }
    
            const filePath = path.join(__dirname,`../../images/${req.body.size}`, file);
    
            fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).end('Server error');
                    return;
                }
                res.json({ file, data });
            });
        });
    }
}

module.exports = new ImageController();
