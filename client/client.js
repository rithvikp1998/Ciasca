var socket = io.connect('http://localhost:4000');

var chatWindow = document.getElementById('chat-window');
var inputField = document.getElementById('input-field');
var sendButton = document.getElementById('send-button');

// Emit events
sendButton.addEventListener('click', function(){
	socket.emit('message', {
		content: inputField.value,
		user: 'olaf'
	});
	inputField.value = '';
});


// Listen for events
socket.on('message', function(message){
    chatWindow.innerHTML += '<p><strong>' + message.user + ': </strong>' + message.content + '</p>';
});