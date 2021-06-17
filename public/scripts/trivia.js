//PACKAGES
const socket = io();
//SOCKETS
const chatInput = document.getElementById("chat_input");
const chatSubmit = document.getElementById("chat_submit");
const messageContainer = document.getElementById("message_container");
// do something
let quiz = [];
// the prompt overrides the .onload event -- place above the prompt

window.onload = async () => {
    let url = window.location.pathname;
    let triviaId = url.substring(url.lastIndexOf('/') + 1);
    let triviaRes = await axios.get(`/get/trivia/${triviaId}`);
    quiz = triviaRes.data;
}

// add chat message to chat board
function appendMessage(data){
    const div = document.createElement('div');
    div.innerText = data;
    messageContainer.append(div);
}
//JOIN ROOM
const name = prompt("What name are you playing under today?") || "Guest";
//return the triviaID to be used for socketio room
const room = () => {
    const url = window.location.toString().split("/");
    return url[url.length-1];
}
appendMessage("You have connected..");

socket.emit("joinRoom", {username: name, room: room()});

// chatroom input submit
chatSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    let data = {
        user: name,
        message: chatInput.value,
        room: room(),
    }
    socket.emit("new-chat-message", data);
    appendMessage(`You: ${chatInput.value}`);
    chatInput.value = '';
});
//handle chatroom events
socket.on("chat-message", message => {
    appendMessage(`${message.user}: ${message.message}`);
});

socket.on("new-user", data => {
    appendMessage(`${data} has joined the game.`);
});

socket.on('disconnect-message', (username) => {
    appendMessage(`${username} has disconnected`);
});


