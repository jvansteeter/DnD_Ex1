'use strict';

var mongoose = require('mongoose');
var NPC = mongoose.model('NPC');

var npcRepository = {};

npcRepository.readById = function (npcId, callback)
{
    NPC.findById(npcId, function(error, user)
    {
        handleError(error);
        callback(user);
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