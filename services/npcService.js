'use strict';

var npcRepository = require('../repositories/npcRepository');
var path = require('path');
var fs = require('fs-extra');

var npcService = {};

npcService.createNewNPC = function (userId, npcObject, callback)
{
	npcRepository.create(userId, npcObject, function (error, npc)
	{
		callback(error, npc);
	})
};

npcService.uploadNPCIcon = function (npcId, iconFile, callback)
{
	npcRepository.read(npcId, function (error, npc)
	{
		var directory = 'image/character/' + npcId + '/';
		var fileName = 'icon' + path.extname(iconFile);

		fs.ensureDirSync(directory);
		fs.copy(iconFile, directory + fileName, function (error)
		{
			if (error)
			{
				callback(error);
				return;
			}

			npc.iconURL = directory + fileName;
			npcRepository.update(npc, function (error)
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

npcService.update = function (npcId, npcObj, callback)
{
	npcRepository.read(npcId, function (error, npc)
	{
		if (error)
		{
			callback(error);
			return;
		}

		npc.setNPC(npcObj);
		npcRepository.update(npc, function (error, npc)
		{
			callback(error, npc);
		})
	})
};

npcService.getAllList = function (callback)
{
	npcRepository.readAll(function (error, npcs)
	{
		if (error)
		{
			callback(error);
			return;
		}

		var list = [];
		for (var i = 0; i < npcs.length; i++)
		{
			var npc = {
				_id: npcs[i]._id,
				name: npcs[i].name,
				class: npcs[i].class,
				level: npcs[i].level
			};
			list.push(npc);
		}

		callback(error, list);
	})
};

npcService.get = function (npcId, callback)
{
	npcRepository.read(npcId, function (error, npc)
	{
		callback(error, npc);
	})
};

npcService.delete = function (npcId, callback)
{
	npcRepository.delete(npcId, function (error)
	{
		callback(error);
	})
};

module.exports = npcService;