'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.hasMany(models.Vote, { foreignKey: 'RoomId' });
      Room.hasMany(models.Player, { foreignKey: 'RoomId' });
      Room.belongsTo(models.User, { foreignKey: 'CreatorId' });
    }
  }
  Room.init({
    CreatorId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};