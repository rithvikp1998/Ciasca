var express = require('express');
var socketIO = require('socket.io');
var mongodb = require('mongodb');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('./config.js');

// App setup
var app = express();
var routes = require('./routes.js');
app.use(routes);
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
			database.collection('channel-random');
		} else {
			console.log('Database is not empty');
		}
	});

	var server = app.listen(4000, function(){
	    console.log('Listening for requests on port 4000');
	});

	// Socket setup & pass server
	var io = socketIO(server);
	io.on('connection', function(socket){
	    console.log('Made socket connection', socket.id);
		currentUser = routes.username;
		console.log('currentUser set to', currentUser);
	    
	    socket.on('message', function(data){
	    	response = {
				username: currentUser,
				content: data.content,
				timestamp: data.timestamp,
				channel: data.channel
			};
			database.collection('channel-'+data.channel).insert(response);
			io.sockets.emit('message', response);
		});

		socket.on('addUser', function(data){
			database.collection('users').find({ $or: [{ username: data.username }, { email: data.email }]}).toArray(function(err, result){
				if(err){
					console.log('Error while querying database', err);
					return;
				}
				if(result.length == 1){
					if(result[0].username == data.username){
						console.log('Username already taken');
						socket.emit('usernameTaken');
					}
					if(result[0].email == data.email){
						console.log('Email already taken');
						socket.emit('emailTaken');
					}
					return;
				}
				if(result.length == 2){
					if(result[0].username == data.username || result[1].username == data.username){
						console.log('Username already taken');
						socket.emit('usernameTaken');
					}
					if(result[0].email == data.email || result[1].email == data.email){
						console.log('Email already taken');
						socket.emit('emailTaken');
					}
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
						emailVerified: 0,
						channels: ['general', 'random']
					});
					console.log('User registered');
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
						payload = {
							iss: 'Ciasca',
							userId: data.username
						}
						options = {
							expiresIn: '7d'
						}
						token = jwt.sign(payload, config.privateKey, options);
						currentUser = data.username;
						socket.emit('verificationSuccessful', { token: token });
					} else {
						console.log('Incorrect password');
						socket.emit('verificationFailed');
					}
				});
			});
		});

		socket.on('requestUserSubscriptions', function(){
			database.collection('users').find({ username: currentUser }).toArray(function(err, result){
				socket.emit('userSubscriptions', result[0].channels);
			});
		});

		socket.on('requestChannelMessages', function(data){
			/* [TODO] Verify if user is authorised to view this channel's messages */
			database.collection('channel-'+data.channel).find().toArray(function(err, result){
				if(err){
					console.log('Error while getting channel messages');
					return;
				}
				socket.emit('channelMessages', result);
			});
		});
	});
});