const { Op } = require('sequelize');
const { Vote } = require('../models');
class VoteController {
    static async create(req) {
        
        try {
            const recentSessions = await Vote.findAll({
                attributes: [
                    'session'
                ],
                where: {
                    RoomId: req.roomId,
                },
                group: ['session'],
            });

            let session = 1;
            if (recentSessions.length > 0) session = recentSessions.length + 1;
   
            const newVote = await Vote.create({
                RoomId: req.roomId,
                TargetPlayerId: req.targetId,
                SourcePlayerId: req.userId,
                session,
            });

            return newVote;
        } catch (error) {
            return error;
        }
    }

    // static async findVote(req, res, next) {
    //     try {
    //         const data = await Vote.findOne({
    //             where: {
    //                 [Op.and]: {
    //                     name: req.Vote,
    //                     status: 'active'
    //                 },
    //             }
    //         });

    //         return data;
    //     } catch (error) {
    //         return error;
    //     }
    // }

    // static async findVoteByPk(req, res, next) {
    //     try {
    //         const data = await Vote.findByPk(req.VoteId);

    //         return data;
    //     } catch (error) {
    //         return error;
    //     }
    // }
}

module.exports = VoteController;