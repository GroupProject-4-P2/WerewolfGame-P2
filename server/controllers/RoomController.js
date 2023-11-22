const { Op } = require('sequelize');
const { Room } = require('../models');
class RoomController {
    static async findOrCreate(req, res, next) {
        try {
            const [room, created] = await Room.findOrCreate({
                where: {
                    [Op.and]: {
                        name: req.room,
                        status: 'active'
                    },
                },
                defaults: {
                    name: req.room,
                    CreatorId: req.userId,
                    status: 'active',
                }
            });

            return {room, created};
        } catch (error) {
            return error;
        }
    }
}

module.exports = RoomController;