var express = require('express');
var socketIO = require('socket.io');
var mongodb = require('mongodb');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('./config.js');

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

		socket.on('message', function(data){
			database.collection('channel-general').insert(data);
			io.sockets.emit('message', data);
		});

		socket.on('addUser', function(data){
			database.collection('users').find({ username: data.username }).toArray(function(err, result){
				if(err){
					console.log('Error while querying database', err);
					return;
				}
				if(result.length>0){
					console.log('Username already taken');
					socket.emit('usernameTaken');
					return;
				}
				bcrypt.hash(data.password, config.saltRounds, function(err, hash){
					if(err){
						console.log('Error while hashing password', err);
						return;
					}
					database.collection('users').insert({
						username: data.username,
						password: hash,
						email: data.email,
						emailVerified: 0
					});
					socket.emit('userAdded');
				});
			});
		});

		socket.on('verifyUser', function(data){
			database.collection('users').find({ username: data.username }).toArray(function(err, result){
				if(err){
					console.log('Error while querying database', err);
					return;
				}
				if(result.length==0){
					console.log('Incorrect username');
					socket.emit('verificationFailed');
					return;
				}
				bcrypt.compare(data.password, result[0].password, function(err, res){
					if(err){
						console.log('Error while verifying password', err);
						return;
					}
					if(res){
						socket.emit('verificationSuccessful');
					} else {
						console.log('Incorrect password');
						socket.emit('verificationFailed');
					}
				});
			});
		});
	});
});