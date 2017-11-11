var express = require('express');
var socketIO = require('socket.io');

// App setup
var app = express();
app.use(express.static('client'));
app.use(require('./routes.js'));

var server = app.listen(4000, function(){
    console.log('Listening for requests on port 4000');
});

// Socket setup & pass server
var io = socketIO(server);
io.on('connection', (socket) => {
    console.log('Made socket connection', socket.id);

    // Handle message event
	socket.on('message', function(data){
		io.sockets.emit('message', data);
	});
});