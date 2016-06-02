var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use('local-register', new LocalStrategy(function (username, password, done) 
{
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ username: username }, function(err, user) 
    {
        // if there are any errors, return the error
        if (err)
            return done(err);

        // check to see if theres already a user with that email
        if (user) 
        {
            return done(null, false, {message: "username already taken"});
        } 
        else 
        {
            // if there is no user with that email
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.username = username;
            newUser.setPassword(password); 

            // save the user
            newUser.save(function(err) 
            {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
    });
}));

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
