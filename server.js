const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected.');

// Handle 'joinRoom' event
socket.on('joinRoom', ({ room, username }) => {
    // Join the specified room
    socket.join(room);
    console.log(`User ${username} joined room ${room}.`);

    // Store the username in the socket object
    socket.username = username;

    // Emit 'roomJoined' event to the client
    socket.emit('roomJoined');
});

    // Handle 'sendMessage' event
    socket.on('sendMessage', (message) => {
        // Get the room the socket is currently in
        const room = Array.from(socket.rooms)[1];

        // Emit 'messageReceived' event to all clients in the room
        io.to(room).emit('messageReceived', {
            username: socket.username,
            message: message
        });
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is listening on port 3000...');
});
