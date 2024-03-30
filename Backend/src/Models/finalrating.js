'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FinalRating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FinalRating.init({
    imageId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    rating: DataTypes.INTEGER,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FinalRating',
  });
  return FinalRating;
};