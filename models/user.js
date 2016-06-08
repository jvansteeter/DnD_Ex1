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
    first_name: String,
    last_name: String,
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

// add findOrCreate
userSchema.plugin(findOrCreate);

mongoose.model('User', userSchema);