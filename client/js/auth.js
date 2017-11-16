var socket = io.connect('http://localhost:4000');

var loginButton = document.getElementById('login-button');
var registerButton = document.getElementById('register-button');

/* Since the communication has to be done in HTTPS anyways, sending plain text doesn't matter as
 long as the user trusts the server to not store the password. */

loginButton.addEventListener('click', function(){
	console.log('Login button clicked');
	username = document.getElementById('login-username').value;
	password = document.getElementById('login-password').value;
	socket.emit('verifyUser', {
		username: username,
		password: password
	});
});

registerButton.addEventListener('click', function(){
	console.log('Register button clicked');
	username = document.getElementById('register-username').value;
	password = document.getElementById('register-password').value;
	confirmPassword = document.getElementById('register-confirm-password').value;
	email = document.getElementById('register-email').value;
	if(password != confirmPassword){
		console.log("Passwords don't match");
		return;
	} else {
		console.log('Trying to register user...');
		socket.emit('addUser', {
			username: username,
			email: email,
			password: password
		});
	}
});

socket.on('usernameTaken', function(){
	console.log('Username already taken');
});

socket.on('verificationFailed', function(){
	console.log('Invalid username or password');
});

socket.on('verificationSuccessful', function(data){
	console.log('User verified successfully');
	document.cookie = 'ciascaJWT='+data.token;
	window.location.href = '/home.html';
});

socket.on('userAdded', function(){
	console.log('User registered successfully');
});