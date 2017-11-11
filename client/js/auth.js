var socket = io.connect('http://localhost:4000');

var loginButton = document.getElementById('login-button');
var registerButton = document.getElementById('register-button');

/*[TODO] Validate all these values before further processing */
var username = '';
var password = '';
var confirmPassword = '';
var email = '';

/* Since the communication has to be done in HTTPS anyways, sending plain text doesn't matter as
 long as the user trusts the server to not store the password. */

loginButton.addEventListener('click', function(){
	console.log('Login button clicked');
	username = document.getElementById('username').value;
	password = document.getElementById('password').value;
	socket.emit('verifyUser', {
		username: username,
		password: password
	});
});

registerButton.addEventListener('click', function(){
	console.log('Register button clicked');
	username = document.getElementById('username').value;
	password = document.getElementById('password').value;
	confirmPassword = document.getElementById('password').value;
	email = document.getElementById('email').value;
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