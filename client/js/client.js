var socket = io.connect('http://localhost:4000');

var sidebar = document.getElementById('sidebar');
var chatWindow = document.getElementById('chat-window');
var inputField = document.getElementById('input-field');
var sendButton = document.getElementById('send-button');
var currentChannel = 'general';

function loadChannel(channel){
	socket.emit('requestChannelMessages', {
		channel: channel
	});
	chatWindow.innerHTML = 'Loading...';
	currentChannel = channel;
	console.log('currentChannel set to', channel);
}

// Emit events
window.addEventListener('load',function(){
	socket.emit('requestUserSubscriptions');
	sidebar.innerHTML = '<p>Loading...</p>';
});

sendButton.addEventListener('click', function(){
	socket.emit('message', {
		channel: currentChannel,
		content: inputField.value,
		timestamp: new Date()
	});
	inputField.value = '';
});


// Listen for events
socket.on('message', function(message){
	if(message.channel == currentChannel)
    	chatWindow.innerHTML += '<p><strong>' + message.username + ': </strong>' + message.content + ' ' + message.timestamp + '</p>';
});

socket.on('userSubscriptions', function(data){
	sidebar.innerHTML = '';
	for(var i = 0; i < data.length; i++){
		channel = data[i];
		sidebar.innerHTML += '<p id=' + channel + ' onClick=loadChannel("' + channel + '")>' + channel + '</p>';
	}
});

socket.on('channelMessages', function(data){
	chatWindow.innerHTML = '';
	var prevTimestamp = '';
	for(var i = 0; i < data.length; i++){
		if(data[i].timestamp.slice(0,10)!=prevTimestamp){
			chatWindow.innerHTML += '<p><strong> ' + data[i].timestamp.slice(0,10) + ' </strong></p>';
			prevTimestamp = data[i].timestamp.slice(0,10);
		}
		chatWindow.innerHTML += '<p><strong>' + data[i].username + ': </strong>' + data[i].content + '</p>';
	}
});