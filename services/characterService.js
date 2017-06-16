'use strict';

var characterRepository = require('../repositories/characterRepository');
var path = require('path');
var fs = require('fs-extra');

var characterService = {};

characterService.createNewCharacter = function (userId, characterObject, callback)
{
	characterRepository.create(userId, characterObject, function (error, character)
	{
		callback(error, character);
	})
};

characterService.uploadCharacterIcon = function (characterId, iconFile, callback)
{
	characterRepository.read(characterId, function (error, character)
	{
		var directory = 'image/character/' + characterId + '/';
		var fileName = 'icon' + path.extname(iconFile);

		fs.ensureDirSync(directory);
		fs.copy(iconFile, directory + fileName, function (error)
		{
			if (error)
			{
				callback(error);
				return;
			}

			character.iconURL = directory + fileName;
			characterRepository.update(character, function (error)
			{
				if (error)
				{
					callback(error);
					return;
				}

				fs.unlink(iconFile, function (error)
				{
					callback(error);
				})
			})
		})
	})
};

module.exports = characterService;