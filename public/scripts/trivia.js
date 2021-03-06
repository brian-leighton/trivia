//PACKAGES
const socket = io();
//SOCKETS
const chatInput = document.getElementById("chat_input");
const chatSubmit = document.getElementById("chat_submit");
const messageContainer = document.getElementById("message_container");
// the prompt overrides the .onload event -- place above the prompt

//CHATROOM FUNCTIONALITY

// add chat message to chat board
function appendMessage(data){
    const div = document.createElement('div');
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
    document.querySelector(".chat__btn").classList.toggle('chat__btn--expand');
    document.querySelector(".chat__main").classList.toggle('chat__main--hide');
}
const toggleChatBtn = document.getElementById("chat__close");
toggleChatBtn.addEventListener('click', toggleChat);

//JOIN ROOM
var name = "GUEST";
//handle user changing name
document.querySelector(".chat__username--input").addEventListener('input', (e) => {
    name = e.target.value;
});
//return the triviaID to be used for socketio room
const getRoom = () => {
    const url = window.location.toString().split("/");
    return url[url.length-1];
}
const announceScore = (correct, total) => {
    const data = {
        user: name,
        message: `I scored ${correct} / ${total}`,
        room: getRoom(),
    }
    socket.emit("new-chat-message", data);
    appendMessage(`<span class="chat__user chat__user--alt">You: </span><p>${data.message}</p>`);
}
export default announceScore;
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


