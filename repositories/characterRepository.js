'use strict';

var mongoose = require('mongoose');
var Character = mongoose.model('Character');

var characterRepository = {};

characterRepository.create = function (userId, characterObject, callback)
{
	var character = new Character({
		userId: userId
	});
	character.setCharacter(characterObject);
	character.save(function (error, character)
	{
		callback(error, character);
	});
};

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

characterRepository.readAll = function (userId, callback)
{
	Character.find({userId: userId}, function (error, characters)
	{
		callback(error, characters);
	})
};

characterRepository.update = function (character, callback)
{
	character.save(function (error)
	{
		callback(error);
	})
};

characterRepository.delete = function (characterId, callback)
{
	Character.findById(characterId, function (error, character)
	{
		if (error)
		{
			callback(error);
			return;
		}

		character.remove(function (error)
		{
			callback(error);
		})
	})
};

module.exports = characterRepository;