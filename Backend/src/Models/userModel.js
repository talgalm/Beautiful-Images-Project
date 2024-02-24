
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelizeConfig');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  }
});

module.exports = User;
