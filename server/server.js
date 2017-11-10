var express = require('express');
var socketIO = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

// Static Files
app.use(express.static('client'))

// Socket setup & pass server
var io = socketIO(server);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    // Handle message event
	socket.on('message', function(data){
		io.sockets.emit('message', data);
	});
});