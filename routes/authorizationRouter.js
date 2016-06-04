var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

//
// API for user authentication
//

// register a user
router.post('/register', function (req, res) 
{
	console.log("attempting to register a new user");
    
    if(!req.body.username || !req.body.password)
	{
		return res.status(400).json({ message: 'Please fill out all fields' });
	}

	// find or create the user with the given username
    User.findOrCreate({username: req.body.username}, function(err, user, created) 
    {
    	console.log("User not already in database");
        if (created) 
        {
        	console.log("User was created");
            // if this username is not taken, then create a user record
            user.username = req.body.username;
            user.setPassword(req.body.password);
            user.save(function(err) 
            {
				if (err) 
				{
					console.log("There was an error while saving the user");
				    res.sendStatus("403");
				    return;
				}
		        // create a token
				var token = User.generateToken(user.name);
		        // return value is JSON containing the user's name and token
		        res.json({name: user.name, token: token});
		    });
		} 
		else 
		{
		    // return an error if the username is taken
		    console.log("Username already exists");
		    res.sendStatus("403");
		}
    });
});

router.post('/login',passport.authenticate('local')
{		
	res.sendStatus(200);
});

// login a local user using passport
/*router.post('/login', passport.authenticate('local'), function (req, res)
{
	console.log("Here: " + req);
	res.redirect('/home.html');
});*/

module.exports = router;
