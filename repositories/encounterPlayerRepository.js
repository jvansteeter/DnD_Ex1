'use strict';

var mongoose = require('mongoose');
var EncounterPlayer = mongoose.model('EncounterPlayer');

var encounterPlayerRepository = {};

encounterPlayerRepository.create = function (name, userId, iconURL, armorClass, hitPoints, maxHitPoints, passivePerception, speed, visible, saves, npc, callback)
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
            speed: speed,
            visible: visible,
            saves: saves,
            npc: npc
        });
    encounterPlayer.save(function (error)
    {
        callback(error, encounterPlayer);
    });
};

encounterPlayerRepository.createFromNPC = function (npcObject, callback)
{
    var encounterPlayer = new EncounterPlayer(
        {
            name: npcObject.name,
            userId: npcObject.userId,
            iconURL: npcObject.iconURL,
            armorClass: npcObject.armorClass,
            hitPoints: npcObject.hitPoints,
            maxHitPoints: npcObject.hitPoints,
            passivePerception: npcObject.passivePerception,
            speed: npcObject.speed,
            actions: npcObject.actions,
            visible: false,
            saves: npcObject.getSaves(),
            npc: true
        });
    encounterPlayer.save(function (error)
    {
        callback(error, encounterPlayer);
    });
};

encounterPlayerRepository.createFromCharacter = function (characterObject, callback)
{
    var encounterPlayer = new EncounterPlayer({
        name: characterObject.name,
        userId: characterObject.userId,
        iconURL: characterObject.iconURL,
        armorClass: characterObject.armorClass,
        hitPoints: characterObject.maxHitPoints,
        maxHitPoints: characterObject.maxHitPoints,
        passivePerception: characterObject.passivePerception,
        speed: characterObject.speed,
        actions: characterObject.actions,
        visible: true,
        saves: characterObject.getSaves(),
        npc: false
    });
    encounterPlayer.save(function (error)
    {
        callback(error, encounterPlayer);
    });
};

encounterPlayerRepository.createFromEncounterPlayer = function (playerObject, callback)
{
    var encounterPlayer = new EncounterPlayer({
        name: playerObject.name,
        userId: playerObject.userId,
        iconURL: playerObject.iconURL,
        armorClass: playerObject.armorClass,
        hitPoints: playerObject.maxHitPoints,
        maxHitPoints: playerObject.maxHitPoints,
        passivePerception: playerObject.passivePerception,
        speed: playerObject.speed,
        actions: playerObject.actions,
        visible: playerObject.visible,
        saves: playerObject.saves,
        npc: playerObject.npc
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