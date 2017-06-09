'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

var userRepository = {};

userRepository.read = function (userId, callback)
{
    User.findById(userId, function(error, user)
    {
		if (error)
		{
			callback(error);
			return;
		}

        if (user === null)
        {
            callback(new Error('User with id: ' + userId + ' not found.'));
            return;
        }

        callback(error, user);
    });
};

module.exports = userRepository;