const express = require('express');
const app = express();
const port = 3000;
const cors = require(`cors`);
const { createServer } = require('http');
const { Server } = require('socket.io');
const RoomController = require('./controllers/RoomController');
const { verifyToken } = require('./helper/jwt');
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

    socket.use(([event, ...args], next) => {
        console.log({ event }, { args });
        const token = verifyToken(args[0].authorization.split(' ').at(-1));
        if (!token) {
            return next(new Error("unauthorized event"));
        }
        socket.token = token;
        next();
    });

    socket.on("search:room", async (payload) => {
        const { room, created } = await RoomController.findOrCreate({ userId: socket.token.id, room: payload.room });
    });

    socket.on('authenticate', (userId) => {
        console.log(`User ${userId} authenticated`);
        connectedUsers[userId] = socket.id;
    });

    socket.on('private message', ({ recipient, text }) => {
        const recipientSocketId = connectedUsers[recipient];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private message', { sender: socket.id, text });
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