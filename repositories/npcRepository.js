'use strict';

var mongoose = require('mongoose');
var NPC = mongoose.model('NPC');

var npcRepository = {};

npcRepository.read = function (npcId, callback)
{
    NPC.findById(npcId, function(error, npc)
    {
        handleError(error);
        if (npc === null)
        {
            throw new Error('NPC with id: ' + npcId + ' not found.');
        }
        callback(npc);
    });
};

function handleError(error)
{
    if (error)
    {
        console.log(error);
        throw error;
    }
}

module.exports = npcRepository;