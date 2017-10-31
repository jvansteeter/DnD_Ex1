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

characterService.update = function (characterId, characterObj, callback)
{
	characterRepository.read(characterId, function (error, character)
	{
		if (error)
		{
			callback(error);
			return;
		}

		character.setCharacter(characterObj);
		characterRepository.update(character, function (error, character)
		{
			callback(error, character);
		})
	})
};

characterService.getAllList = function (userId, callback)
{
	characterRepository.readAll(userId, function (error, characters)
	{
		if (error)
		{
			callback(error);
			return;
		}

		var list = [];
		for (var i = 0; i < characters.length; i++)
		{
			var character = {
				_id: characters[i]._id,
				name: characters[i].name,
				class: characters[i].class,
				level: characters[i].level
			};
			list.push(character);
		}

		callback(error, list);
	})
};

characterService.get = function (characterId, callback)
{
	characterRepository.read(characterId, function (error, character)
	{
		callback(error, character);
	})
};

characterService.delete = function (characterId, callback)
{
	characterRepository.delete(characterId, function (error)
	{
		callback(error);
	})
};

module.exports = characterService;