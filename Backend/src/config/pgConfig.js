const { Client } = require('pg');

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
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:', error);
    }
}

module.exports = {
    client,
    connectToPostgreSQL
};
