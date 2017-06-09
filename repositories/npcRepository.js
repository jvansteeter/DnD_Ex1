'use strict';

var mongoose = require('mongoose');
var NPC = mongoose.model('NPC');

var npcRepository = {};

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

module.exports = npcRepository;