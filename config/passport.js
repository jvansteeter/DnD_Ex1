var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use('local-register', new LocalStrategy(function (username, password, done) 
{
    console.log("Username: " + username);
    console.log("Password: " + password);
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOrCreate({ username: username }, function(err, user, created) 
    {
    	console.log("Attempting to register a new user");
        console.log("Username: " + username);
        console.log("Password: " + password);
        // if there are any errors, return the error
        if (err)
        {
            return done(err);
        }

        // check to see if theres already a user with that email
        if (created) 
        {
            // if this username is not taken, then create a user record
            user.name = req.body.name;
            user.setPassword(req.body.password);
            user.save(function(err) 
            {
                if (err) 
                {
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
            res.sendStatus("403");
        }
    });
}));

/*router.post('/auth/register', function (req, res) 
{   
    if(!req.body.username || !req.body.password)
    {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }
    console.log("here");
    // find or create the user with the given username
    User.findOrCreate({username: req.body.username}, function(err, user, created) 
    {
        if (created) 
        {
            // if this username is not taken, then create a user record
            user.name = req.body.name;
            user.setPassword(req.body.password);
            user.save(function(err) 
            {
                if (err) 
                {
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
            res.sendStatus("403");
        }
    });
});*/

passport.use('local', new LocalStrategy(function (username, password, done)
{
	User.findOne({ username: username }, function (error, user)
	{
		if (error)
		{
			return done(error);
		}
		if(!user)
		{
			return done(null, false, { message: 'Incorrect username.' });
		}
		if(!user.checkPassword(password))
		{
			return done(null, false, { message: 'Incorrectpassword.' });
		}
		console.log("returning user");
		return done(null, user);
	});
}));
