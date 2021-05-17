const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
// const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const io = require('socket.io')(server);
const users = {};

io.on('connection', async(socket) => {
    socket.on("new-user", user => {
        users[socket.id] = user;
        socket.broadcast.emit('new-user', users[socket.id]);    });
    socket.on("new-chat-message", message => {
        socket.broadcast.emit('chat-message', message);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('disconnect-message', users[socket.id]);
    })
});


//ROUTES

require('./routes/database')(app);
//PAGES
app.get("/", (req, res) => {
    res.sendFile(path.resolve('public/pages', 'index.html'));
});
app.get("/trivia/:id", (req, res) => {
    res.sendFile(path.resolve('public/pages', 'trivia.html')); 
});

//SERVER
server.listen(PORT, () => {
    console.log("server listening on: ", PORT);
});