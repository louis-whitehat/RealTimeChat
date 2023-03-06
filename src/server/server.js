let express = require('express');
var cors = require('cors');

var app = express()

app.use(cors);

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// });

let http = require('http').Server(app);
let io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

http.listen(3000, () => {
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {

    //socket.emit('connections', Object.keys(io.sockets.connected).length);

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });

});