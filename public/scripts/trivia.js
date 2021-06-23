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

//CHATROOM FUNCTIONALITY

// add chat message to chat board
function appendMessage(data){
    const div = document.createElement('div');
    console.log(data);
    div.innerHTML = `${data}`;
    div.classList.add("chat__item");
    messageContainer.append(div);
}
// Scroll chat baord to bottom on new message if the user hasn't moved their scroll bar
function scrollDown(){
    const isScrolledDown = messageContainer.scrollHeight - messageContainer.clientHeight <= messageContainer.scrollTop + 10;
    //scrolls to the bottom
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    //fix so it only scrolls when at the bottom
    if(isScrolledDown){
        
    }
}
//hide or show chat window
function toggleChat(){
    // add class to change the css icon
    document.querySelector("#chat__close").classList.toggle('chat__btn--expand');
    document.querySelector(".chat__main").classList.toggle('chat__main--hide');
}
const toggleChatBtn = document.getElementById("chat__close");
toggleChatBtn.addEventListener('click', toggleChat);

//JOIN ROOM
// const name = prompt("What name are you playing under today?") || "Guest";
const name = "BRIAN";
//return the triviaID to be used for socketio room
const getRoom = () => {
    const url = window.location.toString().split("/");
    return url[url.length-1];
}
appendMessage("You have connected...");

//CHATROOM EVENTS
socket.emit("joinRoom", {username: name, room: getRoom()});
// chatroom input submit button
chatSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    let data = {
        user: name,
        message: chatInput.value,
        room: getRoom(),
    }
    socket.emit("new-chat-message", data);
    appendMessage(`<span class="chat__user chat__user--main">You:</span> <p>${chatInput.value}</p>`);
    scrollDown();
    chatInput.value = '';
});

socket.on("chat-message", message => {
    appendMessage(`<span class="chat__user chat__user--alt">${message.user}: </span><p>${message.message}</p>`);
    scrollDown();
});

socket.on("new-user", data => {
    appendMessage(`<span class="chat__user chat__user--alt">${data}</span> has joined the game.`);
    scrollDown();
});

socket.on('disconnect-message', (username) => {
    appendMessage(`<span class="chat__user chat__user--alt">${username}</span> has disconnected`);
    scrollDown();
});


