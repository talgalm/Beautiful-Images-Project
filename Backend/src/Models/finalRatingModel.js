const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelizeConfig');

const FinalRating = sequelize.define('FinalRating', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  imageName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false
  }
});

module.exports = FinalRating;