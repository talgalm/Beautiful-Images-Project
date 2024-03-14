const express = require('express');
const cors = require('cors');
//const Routes = require('./routes');
const apiRouter = require('./Routes/api');

const { client, connectToPostgreSQL } = require('./config/pgConfig');
const { sequelize, connectToSequelize } = require('./config/sequelizeConfig');
const ImageRepository = require('./repositories/ImageRepository');
const UserRepository = require('./repositories/UserRepository');
const RatingRepository = require('./repositories/RatingRepository');

class Server {
    constructor(port) {
        this.app = express();
        this.port = port;
        //this.routes = new Routes();
    }

    async start() {
        this.app.use(cors());
        this.app.use(express.json());
        //this.app.use('/', this.routes.router);
        
        connectToPostgreSQL();
        connectToSequelize();

        await ImageRepository.generateSmalllImages(); // Generate small images if they don't exist
        await ImageRepository.initializeImagesDB(); // Initialize the images database if it doesn't exist

        setInterval(RatingRepository.saveOldRatings, 60 * 60 * 1000);

        //await ImageRepository.fetchImages('gil@gmail.com');

        //RatingRepository.saveOldRatings();
        //await UserRepository.registerUser({email: 'gil@gmail.com'});
        //RatingRepository.changeRating('gil@gmail.com', '2bLAu4liFh', 0, 2);


        //await RatingRepository.saveRatings('gil@gmail.com');

         // Mount the API router
         this.app.use('/api', apiRouter);

        this.app.listen(this.port, () => {
            console.log(`Server is listening on port ${this.port}`);
        });
    }
}

module.exports = Server;