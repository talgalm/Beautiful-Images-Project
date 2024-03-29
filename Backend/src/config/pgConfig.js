const { Client } = require('pg');
const logger = require('../logger');
// Create a new PostgreSQL client instance
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'beautiful-images-db',
    password: '123',
    port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
async function connectToPostgreSQL() {
    try {
        await client.connect();
    } catch (error) {
        logger.error('Error connecting to PostgreSQL database:', error);
        console.error('Error connecting to PostgreSQL database:', error);
    }
}

module.exports = {
    client,
    connectToPostgreSQL
};
