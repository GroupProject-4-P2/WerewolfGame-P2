const { Op } = require('sequelize');
const { Room, Player } = require('../models');
class PlayerController {
    static async create(req, res, next) {
        try {
            const [newPlayer, isCreate] = await Player.findOrCreate({
                where: {
                    [Op.and]: {
                        RoomId: req.roomId,
                        UserId: req.userId
                    }
                },
                defaults: {
                    RoomId: req.roomId,
                    UserId: req.userId
                }
            });

            return { newPlayer, isCreate };
        } catch (error) {
            return error;
        }
    }

    static async findByRoomId(req, res, next) {
        try {
            const players = await Player.findAll({ where: { RoomId: req.roomId }})

            return players;
        } catch (error) {
            return error;
        }
    }

    static async findByUserId(req, res, next) {
        try {
            const player = await Player.findOne({
                where: { UserId: req.userId },
                order: [['createdAt', 'DESC']]
            });

            return player;
        } catch (error) {
            return error;
        }
    }
}

module.exports = PlayerController;