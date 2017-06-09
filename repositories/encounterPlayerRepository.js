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
        callback(error, encounterPlayer);
    });
};

encounterPlayerRepository.read = function (playerId, callback)
{
    EncounterPlayer.findById(playerId, function(error, player)
    {
		if (error)
		{
			callback(error);
			return;
		}

        if (player === null)
        {
            callback(new Error('Player with id: ' + playerId + ' not found.'));
            return;
        }

        callback(error, player);
    })
};

encounterPlayerRepository.readAll = function (playerIds, callback)
{
    EncounterPlayer.find({_id: {$in: playerIds}}, function (error, players)
    {
        if (error)
        {
            callback(error);
            return;
        }

        callback(error, players);
    })
};

encounterPlayerRepository.update = function (player, callback)
{
    player.save(function (error)
    {
		if (error)
		{
			callback(error);
			return;
		}

        callback(error);
    })
};

encounterPlayerRepository.delete = function (playerId, callback)
{
    EncounterPlayer.remove({_id: playerId}, function (error)
    {
		if (error)
		{
			callback(error);
			return;
		}

        callback(error);
    })
};

module.exports = encounterPlayerRepository;