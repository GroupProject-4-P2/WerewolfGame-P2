const express = require('express');
const app = express();
const port = 3000;
const cors = require(`cors`);
const { createServer } = require('http');
const { Server } = require('socket.io');
const RoomController = require('./controllers/RoomController');
const { verifyToken } = require('./helper/jwt');
const PlayerController = require('./controllers/PlayerController');
const UserController = require('./controllers/UserController');
const VoteController = require('./controllers/VoteController');
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
    socket.emit('hello', { message: `Your ID : ${socket.id}` });
    socket.on('check:user', async ({ authorization }) => {
        const token = verifyToken(authorization.split(' ').at(-1));
        const player = await PlayerController.findByUserId({ userId: token.id });
        if (player) {
            const room = await RoomController.findRoomByPk({ roomId: player.RoomId });
            socket.join(room.name);
        }
    });

    socket.on('getinfo:user', async ({ authorization }) => {
        const token = verifyToken(authorization.split(' ').at(-1));
        const user = await UserController.getDetail({ userId: token.id });
        if (user) {
            socket.emit('getinfo:user', { data: user });
        }
    });

    socket.use(([event, ...args], next) => {
        if (args[0]) {
            
            const token = verifyToken(args[0].authorization.split(' ').at(-1));
            if (!token) {
                return next(new Error("unauthorized event"));
            }
            socket.token = token;
            next();
        }
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
        const players = await PlayerController.findByRoomId({ roomId: payload.RoomId });
        if (players.length === 5) {
            socket.emit('join:room', { data: 'hasFull' });
            return;
        }

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
            io.to(room).emit('start:game', { isStart: true, RoomId: result.id });
        } else {
            io.to(room).emit('start:game', { isStart: false, playerLength: players.length });
        }

    });

    socket.on('private message', ({ recipient, text }) => {
        const recipientSocketId = connectedUsers[recipient];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private message', { sender: socket.id, text });
        }
    });


    socket.on('fetch:player', async ({ RoomId }) => {
        try {
            await PlayerController.getRecentPlayer({ roomId: RoomId });
        } catch (error) {
            next(error);
        }
    });

  

    socket.on('assign:role', async ({ RoomId }) => {
        try {
            const assign = await PlayerController.assignRole({ roomId: RoomId });
        
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('get:myRole', async ({ RoomId }) => {
        try {
            const data = await PlayerController.getMyRole({ roomId: RoomId, userId: socket.token.id });
            // const result = await RoomController.findRoomByPk({ roomId: RoomId });
            // io.to(result.name).emit('get:myRole', { data});
            socket.emit('get:myRole', { role : data.Role.name });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('getRecent:Player', async ({ RoomId }) => {
        try {
            const data = await PlayerController.recentPlayer({ roomId: RoomId, userId: socket.token.id });
            socket.emit('getRecent:Player', { data });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('choose:target', async ({ RoomId, TargetId }) => {
        try {
            console.log(RoomId, TargetId)
            await VoteController.create({ roomId: RoomId, userId: socket.token.id, targetId: TargetId });
            // socket.emit('getRecent:Player', { data });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('disconnect', () => {
        socket.disconnect();
    })
    socket.on("error", (err) => {
        if (err && err.message === "unauthorized event") {
            socket.disconnect();
        }
    });
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})