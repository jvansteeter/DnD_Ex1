'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

var userRepository = {};

userRepository.read = function (userId, callback)
{
    User.findById(userId, function(error, user)
    {
        handleError(error, callback);
        if (user === null)
        {
            callback(new Error('User with id: ' + userId + ' not found.'));
        }
        callback(error, user);
    });
};

function handleError(error, callback)
{
    if (error)
    {
        callback(error);
    }
}

module.exports = userRepository;