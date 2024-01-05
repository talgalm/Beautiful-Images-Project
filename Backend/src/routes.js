const express = require('express');
const FileHandler = require('./fileHandler');

class Routes {
    constructor() {
        this.router = express.Router();
        this.fileHandler = new FileHandler();
        this.router.post('/', (req, res) => this.handlePost(req, res));
    }

    handlePost(req, res) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(body);
            this.fileHandler.sendImages(res);
        });
    }
}

module.exports = Routes;