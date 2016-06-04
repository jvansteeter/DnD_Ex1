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

passport.use('local-signup', new LocalStrategy(function(req, email, password, done) 
{
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() 
    {
	    // find a user whose email is the same as the forms email
	    // we are checking to see if the user trying to login already exists
	    User.findOne({ 'local.email' :  email }, function(err, user) 
	    {
	        // if there are any errors, return the error
	        if (err)
	        {
	            return done(err);
	        }

	        // check to see if theres already a user with that email
	        if (user) 
	        {
	            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
	        } 
	        else 
	        {
	            // if there is no user with that email
	            // create the user
	            var newUser = new User();
	            // set the user's local credentials
	            newUser.username = username;
	            newUser.password_hash = password;
	            // save the user
	            newUser.save(function(err) 
	            {
	                if (err)
	                {
	                    throw err;
	                }
	                return done(null, newUser);
	            });
	        }
	    });    
    });
}));


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
