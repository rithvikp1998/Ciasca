var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	console.log("Request made to /");
	/*[TODO] Add authentication here */
	res.redirect('home.html');
});

router.get('/login', function(req, res){
	console.log("Request made to /login");
	res.redirect('login.html');
});

module.exports = router;