'use strict';

var mongoose = require('mongoose');
var Character = mongoose.model('Character');

var characterRepository = {};

characterRepository.read = function (characterId, callback)
{
    Character.findById(characterId, function(error, character)
    {
		if (error)
		{
			callback(error);
			return;
		}

        if (character === null)
        {
            callback(new Error('Character with id: ' + characterId + ' not found.'));
            return;
        }

        callback(error, character);
    });
};


module.exports = characterRepository;