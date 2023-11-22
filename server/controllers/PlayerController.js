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
            
            return {newPlayer, isCreate};
        } catch (error) {
            return error;
        }
    }
}

module.exports = PlayerController;