var socket = io.connect('http://localhost:4000');

var sidebar = document.getElementById('sidebar');
var chatWindow = document.getElementById('chat-window');
var inputField = document.getElementById('input-field');
var sendButton = document.getElementById('send-button');

function loadChannel(channelId){
	socket.emit('requestChannelMessages', {
		user: 'olaf',
		channel: channelId
	});
	chatWindow.innerHTML = 'Loading...';
}

// Emit events
window.addEventListener('load',function(){
	socket.emit('requestUserSubscriptions', {
		user: 'olaf'
	});
	sidebar.innerHTML = '<p>Loading...</p>';
});

sendButton.addEventListener('click', function(){
	socket.emit('message', {
		content: inputField.value,
		user: 'olaf',
		timestamp: new Date()
	});
	inputField.value = '';
});


// Listen for events
socket.on('message', function(message){
    chatWindow.innerHTML += '<p><strong>' + message.user + ': </strong>' + message.content + ' ' + message.timestamp + '</p>';
});

socket.on('userSubscriptions', function(data){
	sidebar.innerHTML = '';
	for(var channel in data.subscriptions){
		var channelId = channel.trim().toLower()
		sidebar.innerHTML += '<p id=' + channelId + ' onClick=loadChannel(' + channelId + ')>' + channel + '</p>';
	}
});

socket.on('channelMessages', function(data){
	chatWindow.innerHTML = '';
	var prevTimestamp = '';
	for(var message in channelMessages){
		if(message.timestamp.getDate()!=prevTimestamp){
			chatWindow.innerHTML += '<p><strong> ' + message.timestamp.getDate() + ' </strong></p>';
			prevTimestamp = message.timestamp.getDate();
		}
		chatWindow.innerHTML += '<p><strong>' + message.user + ': </strong>' + message.content + '</p>';
	}
});