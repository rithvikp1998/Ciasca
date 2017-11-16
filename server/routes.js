var express = require('express');
var router = express.Router();
var cookie = require('cookie');
var jwt = require('jsonwebtoken');
var config = require('./config.js');

router.get('/', function(req, res){
	res.redirect('home.html');
});

router.get('/login', function(req, res){
	res.redirect('login.html');
});

router.get('/login.html', function(req, res, next){
	next();
});

router.get('/home', function(req, res){
	res.redirect('home.html');
});

router.get('/home.html', function(req, res, next){
	try {
		var cookieString = req.headers.cookie;
		var parsedCookie = cookie.parse(cookieString);
	} catch(err) {
		res.redirect('/login.html');
	}
	if(parsedCookie == undefined || parsedCookie.ciascaJWT == undefined){
		res.redirect('login.html');
	} else {
		jwt.verify(parsedCookie.ciascaJWT, config.privateKey, function(err, decoded) {
  			if(err){
  				console.log('Error with JWT verification:', err);
  				res.redirect('login.html');
  			} else {
  				console.log('User granted access based on valid JWT');
  				next();
  			}
		});
	}
});

router.get('/notfound.html', function(req, res, next){
	next();
});

router.get('/*', function(req, res, next){
	var regex = /((login|home|notfound)\.html)|(css\/(login|client)\.css)|(js\/(login|auth|client)\.js)/i;
	if(regex.test(req.url))
		next();
	else
		res.redirect('notfound.html');
});

module.exports = router;