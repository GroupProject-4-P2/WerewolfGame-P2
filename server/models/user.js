'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Room, {foreignKey: 'CreatorId'});
      User.hasMany(models.Player, {foreignKey: 'UserId'});
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Name is Required`
        }, 
        notEmpty: {
          msg: `Name is Required`
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: `Email is already registered`
      },
      validate: {
        notNull: {
          msg: `Email is Required`
        }, 
        notEmpty: {
          msg: `Email is Required`
        },
        isEmail: {
          msg: `Email Must be Email Format`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Password is Required`
        }, 
        notEmpty: {
          msg: `Password is Required`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};