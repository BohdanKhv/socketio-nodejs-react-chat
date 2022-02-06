const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io')

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "https://woh-chat-app.herokuapp.com",
        methods: ["GET", "POST"],
    }
})

// When user connecter to the server
io.on('connection', (socket) => {
    console.log('User Connected', socket.id);

    socket.on('join_room', (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on('send_message', (data) => {
        // console.log(data)
        socket.to(data.room).emit('receive_message', data)
    })

    socket.on('disconnect', () => {
        console.log('User Disconected', socket.id)
    })
}) 

// Serve client react instead of backend 
// Add the follwing code to your server file on the backend 
const path = require('path');
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

server.listen(process.env.PORT || 3001, () => {
    console.log("Server is runnig")
})