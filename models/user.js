var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

// setup bcrypt
var bcrypt = require('bcryptjs');
var SALT = bcrypt.genSaltSync();

var userSchema = new mongoose.Schema(
{
    username: {type: String, index: true, unique: true},
    profilePhotoURL: {type: String, required: true, default: "image/common/noImage.png"},
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