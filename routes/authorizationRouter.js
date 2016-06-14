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
            user.setPassword(req.body.password);
            user.save(function(err) 
            {
				if (err) 
				{
					console.log("\tThere was an error while saving the user");
				    return res.send(err);
				}
		        return res.send("OK");
		    });
		} 
		else 
		{
		    // return an error if the username is taken
		    return res.send("Username is already in use");
		}
    });
});

router.post('/login',passport.authenticate('local'), function(req, res)
{
	res.send(res);
	//res.sendStatus(200);	
});

module.exports = router;
