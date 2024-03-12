'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TmpRating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TmpRating.init({
    imageId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userName: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    submittedFrom: DataTypes.STRING,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TmpRating',
  });
  return TmpRating;
};