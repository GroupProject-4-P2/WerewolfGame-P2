const { Op, Sequelize } = require('sequelize');
const { Room, Player, Vote, User, sequelize, Role } = require('../models');
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
            const players = await Player.findAll({ where: { RoomId: req.roomId } })

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


    static async assignRole(req, res, next) {
        try {
            const check = await Player.findOne({
                where: {
                    RoomId: req.roomId,
                    RoleId: 1
                }
            });
            if (check) {
                return `alreadyExist`;
            }
            let playerIds = await Player.findAll({ where: { RoomId: req.roomId } });
            playerIds = playerIds.map(el => {
                return el.id;
            })

            await Player.update({ RoleId: 1 }, { where: { RoomId: req.roomId, id: playerIds[3] } });
            await Player.update({ RoleId: 2 }, { where: { RoomId: req.roomId, RoleId: null, id: { [Op.ne]: playerIds[3] } } });

            return 'success';
        } catch (error) {
            return error;
        }
    }


    static async getMyRole(req, res, next) {
        try {
            const myRole = await Player.findOne({
                where: {
                    RoomId: req.roomId,
                    UserId: req.userId
                },
                include: {
                    model: Role
                }
            });


            return myRole;
        } catch (error) {
            return error;
        }
    }

    static async recentPlayer(req, res, next) {
        try {
            let recentPlayers = await Player.findAll({ where: { RoomId: req.roomId, UserId: { [Op.ne]: req.userId }, status: null }, include: { model: User } });
            return recentPlayers;
        } catch (error) {
            return error;
        }
    }

    static async getRecentPlayer(req, res, next) {
        try {
            console.log(Math.random());
            // req.roomId = 20;
            const roomId = 21;
            const recentSessions = await Vote.findAll({
                attributes: [
                    'session'
                ],
                where: {
                    RoomId: roomId,
                },
                group: ['session'],
            });

            const limit = recentSessions.length;

            const query = `
                SELECT
                    session,
                    COUNT("TargetPlayerId") AS frekuensi,
                    MAX("TargetPlayerId") AS "TargetPlayerIdTerbanyak"
                FROM
                    "Votes"
                WHERE
                    "RoomId" = :roomId
                GROUP BY
                    session, "TargetPlayerId"
                ORDER BY
                    frekuensi DESC
                LIMIT ${limit};
            `;

            let playerIdTerbanyak = await sequelize.query(query, {
                replacements: { roomId },
                type: sequelize.QueryTypes.SELECT,
            });

            playerIdTerbanyak = playerIdTerbanyak.map(el => {
                return el.TargetPlayerIdTerbanyak;
            });
            console.log(playerIdTerbanyak);

            const recentPlayerId = await Player.findAll({
                where: {
                    id: {
                        [Op.notIn]: playerIdTerbanyak,
                    },
                    RoomId: roomId,
                },
            });







            // let eliminatedUserIds = activity.length > 0 ? activity.map(el => el.User.id) : [];

            // const allPlayers = await Room.findAll({ where: { id: req.roomId }, include: User });
            // const playerIds = allPlayers.map(el => el.User.id);
            // let recentPlayerIds = activity.length > 0 ? playerIds.filter(el => !eliminatedUserIds.includes(el)) : playerIds;

            // const recentPlayers = await Promise.all(recentPlayerIds.map(el => User.findByPk(el)));

            return recentPlayerId;
        } catch (error) {
            console.error(error);
            return error;
        }
    }



}

module.exports = PlayerController;