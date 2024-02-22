const { Client } = require('pg');

// Create a new PostgreSQL client instance
const client = new Client({
    user: 'your_database_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_database_password',
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
