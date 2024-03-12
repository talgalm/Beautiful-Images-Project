const express = require('express');
const cors = require('cors');
//const Routes = require('./routes');
const apiRouter = require('./Routes/api');

const { client, connectToPostgreSQL } = require('./config/pgConfig');
const { sequelize, connectToSequelize } = require('./config/sequelizeConfig');
const ImageRepository = require('./repositories/ImageRepository');
const UserRepository = require('./repositories/UserRepository');

class Server {
    constructor(port) {
        this.app = express();
        this.port = port;
        //this.routes = new Routes();
    }

    start() {
        this.app.use(cors());
        this.app.use(express.json());
        //this.app.use('/', this.routes.router);
        
        connectToPostgreSQL();
        connectToSequelize();

        ImageRepository.initializeImagesDB(); // Initialize the images database

         // Mount the API router
         this.app.use('/api', apiRouter);

        this.app.listen(this.port, () => {
            console.log(`Server is listening on port ${this.port}`);
        });
    }
}

module.exports = Server;