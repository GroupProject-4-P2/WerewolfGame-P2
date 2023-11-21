'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Player.hasMany(models.Vote)
      Player.belongsTo(models.Room)
      Player.belongsTo(models.Role)
      Player.belongsTo(models.User)
    }
  }
  Player.init({
    RoomId: DataTypes.INTEGER,
    RoleId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};