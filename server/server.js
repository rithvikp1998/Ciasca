var express = require('express');
var socketIO = require('socket.io');
var mongodb = require('mongodb');

// App setup
var app = express();
app.use(require('./routes.js'));
app.use(express.static('client'));

var mongoClient = mongodb.MongoClient;
mongoClient.connect('mongodb://localhost:27017/ciasca', function(err, database){
	if (err){
		console.log('Error while connecting to database', err);
		return;
	}
	console.log('Connected to database');
	database.listCollections().toArray(function(err, results){
		if (results.length==0) {
			console.log('Database is empty');
			database.collection('users');
			database.collection('channels');
			database.collection('channel-general');
		} else {
			console.log('Database is not empty');
			console.log('Current collections', results);
		}
	});

	var server = app.listen(4000, function(){
	    console.log('Listening for requests on port 4000');
	});

	// Socket setup & pass server
	var io = socketIO(server);
	io.on('connection', function(socket){
	    console.log('Made socket connection', socket.id);

	    // Handle message event
		socket.on('message', function(data){
			database.collection('channel-general').insert(data);
			io.sockets.emit('message', data);
		});
	});
});