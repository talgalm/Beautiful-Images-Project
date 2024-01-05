const fs = require('fs');
const path = require('path');

class FileHandler {
    sendImages(res) {
        fs.readdir(path.join(__dirname, '../images'), (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).end('Server error');
                return;
            }

            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif';
            });

            Promise.all(imageFiles.map(file => {
                return new Promise((resolve, reject) => {
                    fs.readFile(path.join(__dirname, '../images', file), { encoding: 'base64' }, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve({ file, data });
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
}

module.exports = FileHandler;