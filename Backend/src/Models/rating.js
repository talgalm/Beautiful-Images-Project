'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rating.init({
    imageId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    rating: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    submittedFrom: DataTypes.STRING,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};