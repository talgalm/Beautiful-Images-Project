const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./sequelizeConfig'); // Import the Sequelize instance

// Define a User model
const User = sequelize.define('User', {
    // Define table columns
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Add more columns as needed
});

// Define other models as needed
// Example:
// const Post = sequelize.define('Post', {
//     title: DataTypes.STRING,
//     content: DataTypes.TEXT
// });

// Synchronize the model with the database
sequelize.sync({ alter: true }) // Use { alter: true } to automatically create missing columns and constraints
    .then(() => console.log('Models synchronized with database'))
    .catch(err => console.error('Error synchronizing models:', err));

module.exports = {
    User, // Export the User model (and other models as needed)
};
