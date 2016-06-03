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

passport.use('local', new LocalStrategy(function (username, password, done)
{
	console.log("Authenticating user locally");
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
