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

io.on('connection', socket => {
    console.log(users);
    socket.on("new-user", user => {
        users[socket.id] = user;
        socket.broadcast.emit('new-user', user);
    });
    socket.on("new-chat-message", message => {
        socket.broadcast.emit('chat-message', message);
    });
});


//ROUTES

app.get("/", (req, res) => {
    res.sendFile(path.resolve('public/pages', 'index.html'));
});

app.get("/trivia", (req, res) => {
    res.sendFile(path.resolve('public/pages', 'trivia.html'));
});

let quiz;

app.post("/new/quiz", (req, res) => {
    console.log('route hit', req.body);
    //if the new quiz isn't custom return api call result
    if(!req.body.custom){

    }
    //handle custom quiz input
    quiz = {name: req.body.user}
    // console.log(quiz);
    res.send(quiz);
});

server.listen(PORT, () => {
    console.log("server listening on: ", PORT);
});