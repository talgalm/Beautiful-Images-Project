const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('beautiful-images-db', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres', // Specify the dialect (postgres for PostgreSQL)
});

// Test the connection
async function connectToSequelize() {
    try {
        await sequelize.authenticate();
        console.log('Connected to Sequelize');
    } catch (error) {
        console.error('Error connecting to Sequelize:', error);
    }
}

module.exports = {
    sequelize,
    connectToSequelize
};
