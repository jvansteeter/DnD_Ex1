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

	// console.log("---!!! username: " + req.username + " password: " + req.password + " firstname: " req.firstname + " lastname: " + req.lastname + " code: " + req.authCode + " !!!---");

	console.log("---!!! username: " + req.body.username + " !!!---");

	if (req.body.authCode !== 'testtest')
	{
		res.status(401).send("Invalid Authorization Code");
		return;
	}

	// find or create the user with the given username
    User.findOrCreate({username: req.body.username}, function(err, user, created) 
    {
        if (created) 
        {
        	console.log("---!!! User was created !!!---");
            // if this username is not taken, then create a user record
            user.username = req.body.username;
            user.first_name = req.body.firstname;
            user.last_name = req.body.lastname;
            user.setPassword(password);
            user.save(function(err) 
            {
				if (err) 
				{
					console.log("\tThere was an error while saving the user");
				    return done(err);
				}
		        return done(null, user);
		    });
		} 
		else 
		{
		    // return an error if the username is taken
		    console.log("Username already exists");
		    return res.status(401).send("Username is already in use");
		}
    });

});

router.post('/login',passport.authenticate('local'), function(req, res)
{
	res.sendStatus(200);	
});

module.exports = router;
