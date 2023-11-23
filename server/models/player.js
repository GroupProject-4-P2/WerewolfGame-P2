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
      Player.hasMany(models.Vote, { foreignKey: 'TargetPlayerId', as: 'TargetPlayer' })
      Player.hasMany(models.Vote, { foreignKey: 'SourcePlayerId', as: 'SourcePlayer' })
      Player.belongsTo(models.Room, { foreignKey: 'RoomId' })
      Player.belongsTo(models.Role, { foreignKey: 'RoleId' })
      Player.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Player.init({
    RoomId: DataTypes.INTEGER,
    RoleId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};