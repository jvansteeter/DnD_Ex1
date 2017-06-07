'use strict';

var mongoose = require('mongoose');
var NPC = mongoose.model('NPC');

var npcRepository = {};

npcRepository.read = function (npcId, callback)
{
    NPC.findById(npcId, function(error, npc)
    {
        handleError(error, callback);
        if (npc === null)
        {
            callback(new Error('NPC with id: ' + npcId + ' not found.'));
        }
        callback(error, npc);
    });
};

function handleError(error, callback)
{
    if (error)
    {
        callback(error);
    }
}

module.exports = npcRepository;