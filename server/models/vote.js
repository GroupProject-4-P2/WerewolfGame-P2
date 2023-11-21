'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vote.belongsTo(models.Player)
      Vote.belongsTo(models.Room)
    }
  }
  Vote.init({
    RoomId: DataTypes.INTEGER,
    TargetPlayerId: DataTypes.INTEGER,
    SourcePlayerId: DataTypes.INTEGER,
    session: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Vote',
  });
  return Vote;
};