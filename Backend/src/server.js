const express = require('express');
const cors = require('cors');
const apiRouter = require('./Routes/api');
const logger = require('./logger');
const { client, connectToPostgreSQL } = require('./config/pgConfig');
const { sequelize, connectToSequelize } = require('./config/sequelizeConfig');
const ImageRepository = require('./repositories/ImageRepository');
const RatingRepository = require('./repositories/RatingRepository');

class Server {
    constructor(port) {
        this.app = express();
        this.port = port;
    }

    async start() {
        this.app.use(cors({
            exposedHeaders: ['Content-Disposition'],
          }));
        this.app.use(express.json({limit: '50mb', extended: true}));
        
        connectToPostgreSQL();
        connectToSequelize();
        logger.info('*************************************Server started*************************************');
        // Generate small images if they don't exist
        await ImageRepository.generateSmallScaleImages();
        await ImageRepository.initializeCategoryDB(); // Initialize the categories database if it doesn't exist
        await ImageRepository.initializeImagesDB(); // Initialize the images database if it doesn't exist

        setInterval(RatingRepository.saveOldRatings, 60 * 60 * 1000);

         // Mount the API router
         this.app.use('/api', apiRouter);

        this.app.listen(this.port, () => {
            console.log(`Server is listening on port ${this.port}`);
        });
    }
}

module.exports = Server;