const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/sequelizeConfig');

const TmpRating = sequelize.define('TmpRating', {
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
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  tableName: 'TmpRatings'
});

module.exports = TmpRating;