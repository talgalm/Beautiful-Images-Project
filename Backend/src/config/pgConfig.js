const { Client } = require('pg');
const logger = require('../logger');
// Create a new PostgreSQL client instance
let client;

if (process.env.NODE_ENV === 'test') {
    // Use test database configuration
    client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'database_test',
        password: '123',
        dialect : 'postgres'
    });
} else {
    // Use development or production database configuration
    client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'beautiful-images-db',
        password: '123',
        port: 5432, // Default PostgreSQL port
    });
}

// Connect to the PostgreSQL database
async function connectToPostgreSQL() {
    try {
        await client.connect();
    } catch (error) {
        logger.error('Error connecting to PostgreSQL database:', error);
        console.error('Error connecting to PostgreSQL database:', error);
    }
}

// Disconnect from the PostgreSQL database
async function disconnectFromPostgreSQL() {
    try {
      await client.end();
    } catch (error) {
      logger.error('Error disconnecting from PostgreSQL database:', error);
      console.error('Error disconnecting from PostgreSQL database:', error);
    }
  }

module.exports = {
    client,
    connectToPostgreSQL,
    disconnectFromPostgreSQL
};
