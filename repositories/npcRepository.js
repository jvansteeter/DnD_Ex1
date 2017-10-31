'use strict';

var mongoose = require('mongoose');
var NPC = mongoose.model('NPC');

var npcRepository = {};

npcRepository.create = function (userId, npcObject, callback)
{
	var npc = new NPC({
		userId: userId
	});

	npc.setNPC(npcObject);
	npc.save(function (error, npc)
	{
		callback(error, npc);
	});
};

npcRepository.read = function (npcId, callback)
{
	NPC.findById(npcId, function(error, npc)
	{
		if (error)
		{
			callback(error);
			return;
		}

		if (npc === null)
		{
			callback(new Error('NPC with id: ' + npcId + ' not found.'));
			return;
		}

		callback(error, npc);
	});
};

npcRepository.readAll = function (callback)
{
	NPC.find({}, function (error, npcs)
	{
		callback(error, npcs);
	})
};

npcRepository.update = function (npc, callback)
{
	npc.save(function(error, npc)
	{
		callback(error, npc);
	})
};

npcRepository.delete = function (npcId, callback)
{
	NPC.findById(npcId, function (error, npc)
	{
		if (error)
		{
			callback(error);
			return;
		}

		npc.remove(function(error)
		{
			callback(error);
		})
	})
};

module.exports = npcRepository;