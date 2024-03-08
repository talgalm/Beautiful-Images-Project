
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelizeConfig');

const ImageModel = sequelize.define('ImageModel', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true
  },
  imageName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  }
});

module.exports = ImageModel;