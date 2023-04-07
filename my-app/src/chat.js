import qs from 'qs';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

function initChat() {
  // Define constants

  const chatForm = document.getElementById('chat-form');
  const chatMessages = document.querySelector('.chat-messages');
  const roomName = document.getElementById('room-name');
  const userList = document.getElementById('users');
  const socket = io();

  // Get username and room from URL using qs library
  const queryParams = new URLSearchParams(window.location.search);
const username = queryParams.get('username');
const room = queryParams.get('room');
  // Join chatroom
  socket.emit('joinRoom', { username, room });

  // Get room and users
  socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

  // Message from server
  socket.on('message', (message) => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // Message submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });

  // Output message to DOM
  function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
  }

  // Add room name to DOM
  function outputRoomName(room) {
    roomName.innerText = room;
  }

  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }

  // Export the necessary variables and functions
  return {
    socket,
    chatForm,
    chatMessages,
    roomName,
    userList,
    outputMessage,
    outputRoomName,
    outputUsers
  };
}

export default initChat;