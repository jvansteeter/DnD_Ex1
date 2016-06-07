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
		res.send("Invalid Authorization Code");
		res.status(401);
		return;
	}

	// find or create the user with the given username
    /*User.findOrCreate(
    	{
    		username: username,

    	}, function(err, user, created) 
    {
        if (created) 
        {
        	console.log("User was created");
            // if this username is not taken, then create a user record
            user.username = username;
            user.setPassword(password);
            user.save(function(err) 
            {
				if (err) 
				{
					console.log("There was an error while saving the user");
				    return done(err);
				}
		        
		        return done(null, user);
		    });
		} 
		else 
		{
		    // return an error if the username is taken
		    console.log("Username already exists");
		    return done(null, false, { message: 'User not created' });
		}
    });*/

	res.send("OK");
});

router.post('/login',passport.authenticate('local'), function(req, res)
{
	res.sendStatus(200);	
});

module.exports = router;
