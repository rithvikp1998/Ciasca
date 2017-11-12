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
	var cookieString = req.headers.cookie;
	var parsedCookie = cookie.parse(cookieString);
	if(parsedCookie == undefined || parsedCookie.ciascaJWT == undefined){
		res.redirect('login.html');
	} else {
		jwt.verify(parsedCookie.ciascaJWT, config.privateKey, function(err, decoded) {
  			if(err){
  				console.log('Error with JWT verification:', err);
  				res.redirect('login.html');
  			} else {
  				console.log('So far so good'); // [TODO] Verify if this is all or if other checks are needed
  				next();
  			}
		});
	}
});

router.get('/notfound.html', function(req, res, next){
	next();
});

router.get('/*', function(req, res, next){
	/* [TODO] FIX THIS CRAP ASAP! */
	if(req.url == '/login.html' || req.url=='/home.html' || req.url == '/notfound.html' || 
		req.url == '/css/client.css' || req.url == '/css/login.css' || 
		req.url == '/js/auth.js' || req.url == '/js/client.js' || req.url == '/js/login.js')
		next();
	else
		res.redirect('notfound.html');
});

module.exports = router;