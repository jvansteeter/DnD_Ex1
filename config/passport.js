var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// used to serialize the user for the session
passport.serializeUser(function(user, done) 
{
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) 
{
    User.findById(id, function(err, user) 
    {
        done(err, user);
    });
});

/*passport.use('local-register', new LocalStrategy(function(username, password, done)
{
	console.log("---!!! attempting to register a new user !!!---");
    
    if(!username || !password)
	{
		return res.status(400).json({ message: 'Please fill out all fields' });
	}

	done(null, false, { message: 'User not created' });
	return;

	// find or create the user with the given username
    User.findOrCreate({username: username}, function(err, user, created) 
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
    });
}));*/

passport.use('local', new LocalStrategy(function (username, password, done)
{
	console.log("---!!! Authenticating user locally !!!---");
	console.log("Username: " + username + " Password: " + password);
	User.findOne({ username: username }, function (error, user)
	{
		console.log("User successfully authenticated");
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
