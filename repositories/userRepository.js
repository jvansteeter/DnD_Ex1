'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

var userRepository = {};

userRepository.readById = function (userId, callback)
{
    User.findById(userId, function(error, user)
    {
        handleError(error);
        callback(user);
    });
};

function handleError(error)
{
    if (error)
    {
        console.log(error);
        throw error;
    }
}

module.exports = userRepository;