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
    socket.on("joinRoom", ({username, room}) => {
        //store user in array to be found using socket.id later
        users[socket.id] = username;
        //join room
        socket.join(room);
        //welcome new user
        socket.broadcast.to(room).emit('new-user', users[socket.id]);    
    });

    socket.on("new-chat-message", message => {
        socket.broadcast.to(message.room).emit('chat-message', message);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('disconnect-message', users[socket.id]);
    });
});


//ROUTES

require('./routes/trivia')(app);
//PAGES
app.get("/", (req, res) => {
    res.sendFile(path.resolve('public/pages', "index.html"));
});
app.get("/trivia", (req, res) => {
    res.sendFile(path.resolve('public/pages', "showTrivia.html"));
})
app.get("/trivia/new", (req, res) => {
    res.sendFile(path.resolve('public/pages', 'createTrivia.html'));
});
app.get("/trivia/:id", (req, res) => {
    res.sendFile(path.resolve('public/pages', 'trivia.html')); 
});

//SERVER
server.listen(PORT, () => {
    console.log("server listening on: ", PORT);
});
