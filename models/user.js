var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

// setup bcrypt
var bcrypt = require('bcrypt');
var SALT = bcrypt.genSaltSync();

// setup json web token
var jwt = require('jsonwebtoken');
var SECRET = '\x1f\x1e1\x8a\x8djO\x9e\xe4\xcb\x9d`\x13\x02\xfb+\xbb\x89q"F\x8a\xe0a';

var userSchema = new mongoose.Schema(
{
    username: {type: String, index: true, unique: true},
    name: String,
    password_hash: String
});

// hash the password
userSchema.methods.setPassword = function(password) 
{
    this.password_hash = bcrypt.hashSync(password, SALT);
};

// check the password
userSchema.methods.checkPassword = function(password) 
{
    return bcrypt.compareSync(password,this.password_hash);
};

// Generate a token for a client
userSchema.statics.generateToken = function(user) 
{
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 1);

    return jwt.sign(
    { 
    	username: user,
    	exp: parseInt(exp.getTime() / 1000) 
    }, SECRET);
};

// Verify the token from a client. Call the callback with a user object if successful or null otherwise.
userSchema.statics.verifyToken = function(token,cb) 
{
    if (!token) 
    {
        cb(null);
        return;
    }
    // decrypt the token and verify that the encoded user id is valid
    jwt.verify(token, SECRET, function(err, decoded) 
    {
        if (!decoded) 
        {
            cb(null);
            return;
        }
        User.findOne({username: decoded.username},function(err,user) 
        {
		    if (err) 
		    {
				cb(null);
		    } 
		    else 
		    {
				cb(user);
		    }
		});
    });
};

// add findOrCreate
userSchema.plugin(findOrCreate);

mongoose.model('User', userSchema);