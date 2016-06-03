var express = require('express');
var router = express.Router();
var passport = require('passport');

//
// API for user authentication
//

// register a user
router.post('/register', passport.authenticate('local-register', 
{
    failureRedirect: '/bad'
}), function(req, res)
{
	console.log("Successfully registered new user");
	res.sendStatus(200);
});

// login a local user using passport
router.post('/login', passport.authenticate('local', 
{
    successRedirect: '/',
    failureRedirect: '/'
}));

module.exports = router;
