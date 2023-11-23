const { Op } = require('sequelize');
const { Room } = require('../models');
class RoomController {
    static async create(req, res, next) {
        try {
            const newRoom = await Room.create({
                name: req.room,
                CreatorId: req.userId,
                status: 'active',
            });

            return newRoom;
        } catch (error) {
            return error;
        }
    }

    static async findRoom(req, res, next) {
        try {
            const data = await Room.findOne({
                where: {
                    [Op.and]: {
                        name: req.room,
                        status: 'active'
                    },
                }
            });

            return data;
        } catch (error) {
            return error;
        }
    }

    static async findRoomByPk(req, res, next) {
        try {
            const data = await Room.findByPk(req.roomId);

            return data;
        } catch (error) {
            return error;
        }
    }
}

module.exports = RoomController;