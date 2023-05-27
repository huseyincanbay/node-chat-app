// Establish a socket connection
const socket = io();

// DOM elements
const roomForm = document.getElementById('room-form');
const chatContainer = document.getElementById('chat-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');

// Hide the chat container initially
chatContainer.classList.add('hidden');

// Join room event
document.getElementById('join-btn').addEventListener('click', () => {
  const room = document.getElementById('room-input').value;
  const username = document.getElementById('username-input').value;

  if (room && username) {
    // Emit 'joinRoom' event to the server
    socket.emit('joinRoom', { room, username });
  }
});

// Listen for 'roomJoined' event
socket.on('roomJoined', () => {
  // Show the chat container
  chatContainer.classList.remove('hidden');
  roomForm.classList.add('hidden');
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value;

  if (message) {
    // Emit 'sendMessage' event to the server
    socket.emit('sendMessage', message);

    // Clear the input field
    messageInput.value = '';
  }
});

// Listen for 'messageReceived' event
socket.on('messageReceived', (data) => {
  const { username, message, isSent } = data;

  // Create a new message element
  const newMessage = document.createElement('div');
  newMessage.classList.add('user-message');
  if (isSent) {
    newMessage.classList.add('sent');
  }

  // Create a message box within the message element
  const messageBox = document.createElement('div');
  messageBox.classList.add('message-box');

  // Set the username
  const usernameText = document.createElement('div');
  usernameText.classList.add('username');
  usernameText.innerText = username;

  // Set the message text
  const messageText = document.createElement('p');
  messageText.innerText = message;

  // Append the username and message to the message box
  messageBox.appendChild(usernameText);
  messageBox.appendChild(messageText);

  // Append the message box to the message element
  newMessage.appendChild(messageBox);

  // Append the message to the message container
  messageContainer.appendChild(newMessage);

  // Scroll to the bottom of the message container
  messageContainer.scrollTop = messageContainer.scrollHeight;
});
