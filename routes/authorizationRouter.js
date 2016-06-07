var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

//
// API for user authentication
//

router.post('/register', function(req, res) //passport.authenticate('local-register'), function(req, res)
{
	console.log("---!!! Attempting to register a new user !!!---");
	res.sendStatus(200);
});

router.post('/login',passport.authenticate('local'), function(req, res)
{
	res.sendStatus(200);	
});

module.exports = router;
