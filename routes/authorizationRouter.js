var express = require('express');
var router = express.Router();
var passport = require('passport');

//
// API for user authentication
//

// register a user
router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/good',
    failureRedirect: '/bad'
}));

// login a local user using passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
}));

module.exports = router;
