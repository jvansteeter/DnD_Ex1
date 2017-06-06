'use strict';

var mongoose = require('mongoose');
var EncounterPlayer = mongoose.model('EncounterPlayer');

var encounterPlayerRepository = {};

encounterPlayerRepository.create = function (name, userId, iconURL, armorClass, hitPoints, maxHitPoints, passivePerception, visible, saves, npc, callback)
{
    var encounterPlayer = new EncounterPlayer(
        {
            name: name,
            userId: userId,
            iconURL: iconURL,
            armorClass: armorClass,
            hitPoints: hitPoints,
            maxHitPoints: maxHitPoints,
            passivePerception: passivePerception,
            visible: visible,
            saves: saves,
            npc: npc
        });
    encounterPlayer.save(function (error)
    {
        handleError(error);
        callback(encounterPlayer);
    });
};

encounterPlayerRepository.read = function (playerId, callback)
{
    EncounterPlayer.findById(playerId, function(error, player)
    {
        handleError(error);
        console.log(playerId);
        if (player === null)
        {
            throw new Error('Player with id: ' + playerId + ' not found.');
        }
        callback(player);
    })
};

encounterPlayerRepository.readAll = function (playerIds, callback)
{
    EncounterPlayer.find({_id: {$in: playerIds}}, function (error, players)
    {
        handleError(error);
        callback(players);
    })
};

encounterPlayerRepository.update = function (player, callback)
{
    player.save(function (error)
    {
        handleError(error);
        callback();
    })
};

encounterPlayerRepository.delete = function (playerId, callback)
{
    EncounterPlayer.remove({_id: playerId}, function (error)
    {
        handleError(error);
        callback();
    })
};

function handleError(error)
{
    if (error)
    {
        console.log(error);
        throw error;
    }
}

module.exports = encounterPlayerRepository;