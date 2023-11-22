const express = require('express');
const app = express();
const port = 3000;
const cors = require(`cors`);
const { createServer } = require('http');
const { Server } = require('socket.io');
const RoomController = require('./controllers/RoomController');
const { verifyToken } = require('./helper/jwt');
const PlayerController = require('./controllers/PlayerController');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require(`./router`));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log('New Connection', socket.id);
    socket.emit('hello', { message: `Your ID : ${socket.id}` });
    socket.on('check:user', async ({ authorization }) => {
        const token = verifyToken(authorization.split(' ').at(-1));
        const player = await PlayerController.findByUserId({ userId: token.id });
        const room = await RoomController.findRoomByPk({ roomId: player.RoomId});
        socket.join(room.name);
    });

    socket.use(([event, ...args], next) => {
        const token = verifyToken(args[0].authorization.split(' ').at(-1));
        if (!token) {
            return next(new Error("unauthorized event"));
        }
        socket.token = token;
        next();
    });

    socket.on("search:room", async (payload) => {
        const result = await RoomController.findRoom({ userId: socket.token.id, room: payload.search });
        if (result) {
            socket.emit('search:room', { data: result });
        } else {
            socket.emit('search:room', { data: 'notExist' });
        }
    });

    socket.on("create:room", async (payload) => {
        const result = await RoomController.create({ userId: socket.token.id, room: payload.search });
        await PlayerController.create({ userId: socket.token.id, roomId: result.id });
        socket.join(result.name);
        socket.emit('create:room', { data: result });
    });

    socket.on("join:room", async (payload) => {
        const { newPlayer, isCreate } = await PlayerController.create({ userId: socket.token.id, roomId: payload.RoomId });
        const result = await RoomController.findRoomByPk({ roomId: newPlayer.RoomId });
        socket.join(result.name);
        if (isCreate) {
            socket.emit('join:room', { data: 'success' });
        } else {
            socket.emit('join:room', { data: 'hasExist' });
        }
    });

    socket.on("start:game", async (payload, room) => {
        const result = await RoomController.findRoom({ userId: socket.token.id, room: payload.room });
        const players = await PlayerController.findByRoomId({ roomId: result.id });
        if (players.length === 5) {
            io.to(room).emit('start:game', { isStart: true }, (err, res) => {

            });
        } else {
            io.to(room).emit('start:game', { isStart: false, playerLength: players.length }, (err, res) => {

            });
        }
    });

    socket.on("error", (err) => {
        if (err && err.message === "unauthorized event") {
            socket.disconnect();
        }
    });
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})