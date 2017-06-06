'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

var userRepository = {};

userRepository.read = function (userId, callback)
{
    User.findById(userId, function(error, user)
    {
        handleError(error);
        if (user === null)
        {
            throw new Error('User with id: ' + userId + ' not found.');
        }
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