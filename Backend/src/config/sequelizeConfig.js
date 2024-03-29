const { Sequelize } = require('sequelize');
const logger = require('../logger');
// Create a new Sequelize instance
const sequelize = new Sequelize('beautiful-images-db', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres', 
});

// Test the connection
async function connectToSequelize() {
    try {
        await sequelize.authenticate();
    } catch (error) {
        logger.error('Error connecting to Sequelize:', error);
        console.error('Error connecting to Sequelize:', error);
    }
}

module.exports = {
    sequelize,
    connectToSequelize
};
