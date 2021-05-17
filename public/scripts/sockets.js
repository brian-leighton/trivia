//SOCKETS
const socket = io();
const chatInput = document.getElementById("chat_input");
const chatSubmit = document.getElementById("chat_submit");
const messageContainer = document.getElementById("message_container");

function appendMessage(data){
    const div = document.createElement('div');
    div.innerText = data;
    messageContainer.append(div);
}

const name = prompt("What name are you playing under today?");
appendMessage("You have connected..");
socket.emit("new-user", name);

chatSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    let data = {
        user: name,
        message: chatInput.value
    }
    socket.emit("new-chat-message", data);
    appendMessage(`You: ${chatInput.value}`);
    chatInput.innerText = '';
});

// socket.emit("new-user", name);
socket.on("chat-message", data => {
    console.log(data);
    appendMessage(data);
});

socket.on("new-user", data => {
    console.log('data', data);
    appendMessage(`${data} has joined the game.`);
});
 
