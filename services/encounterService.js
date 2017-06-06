'use strict';

var encounterRepository = require('../repositories/encounterRepository');
var userRepository = require('../repositories/userRepository');
var characterRepository = require('../repositories/characterRepository');
var npcRepository = require('../repositories/npcRepository');
var encounterPlayerRepository = require('../repositories/encounterPlayerRepository');

var encounterService = {};

encounterService.createEncounter = function (userId, title, campaignId, description, active, callback)
{
    userRepository.read(userId, function (user)
    {
        var hostName = user.first_name + ' ' + user.last_name;
        encounterRepository.createEncounter(title, campaignId, description, userId, hostName, active, function ()
        {
            callback();
        });
    });
};

encounterService.getEncounterById = function (encounterId, callback)
{
    encounterRepository.read(encounterId, function (encounter)
    {
        callback(encounter);
    });
};

encounterService.addNPC = function (encounterId, npcId, callback)
{
    encounterService.getEncounterState(encounterId, function (encounter)
    {
        npcRepository.read(npcId, function (npc)
        {
            encounterPlayerRepository.create(npc.name, npc.userId, npc.iconURL, npc.armorClass, npc.hitPoints, npc.hitPoints, npc.passivePerception, false, npc.getSaves(), true, function (encounterPlayer)
            {
                addEncounterPlayerToMap(encounter, encounterPlayer, function()
                {
                    callback();
                })
            })
        })
    });
};

encounterService.addCharacter = function (encounterId, characterId, callback)
{
    encounterService.getEncounterState(encounterId, function(encounter)
    {
        characterRepository.read(characterId, function(character)
        {
            encounterPlayerRepository.create(character.name, character.userId, character.iconURL, character.armorClass, character.maxHitPoints, character.maxHitPoints, character.passivePerception, false, character.getSaves(), true, function (encounterPlayer)
            {
                addEncounterPlayerToMap(encounter, encounterPlayer, function()
                {
                    callback();
                })
            })
        })
    })
};

encounterService.removePlayer = function (encounterId, playerId, callback)
{
    encounterRepository.read(encounterId, function(encounter)
    {
        encounter.removePlayer(playerId);
        encounterPlayerRepository.delete(playerId, function ()
        {
            callback();
        })
    })
};

encounterService.getEncounterState = function (encounterId, callback)
{
    encounterRepository.read(encounterId, function (encounter)
    {
        encounterPlayerRepository.readAll(encounter.players, function (players)
        {
            encounter.players = players;
            callback(encounter);
        })
    })
};

encounterService.damagePlayer = function (playerId, damage, callback)
{
    encounterPlayerRepository.read(playerId, function (player)
    {
        player.damage(damage);
        encounterPlayerRepository.update(player, function ()
        {
            callback();
        })
    })
};

encounterService.healPlayer = function (playerId, heal, callback)
{
    encounterService.damagePlayer(playerId, -heal, function ()
    {
        callback();
    })
};

encounterService.setInitiative = function (playerId, initiative, callback)
{
    encounterPlayerRepository.read(playerId, function (player)
    {
        player.initiative = initiative;
        encounterPlayerRepository.update(player, function ()
        {
            callback();
        })
    })
};

encounterService.toggleVisible = function (playerId, callback)
{
    encounterPlayerRepository.read(playerId, function (player)
    {
        player.visible = !player.visible;
        encounterPlayerRepository.update(player, function ()
        {
            callback();
        })
    })
};

encounterService.setActive = function (encounterId, active, callback)
{
    encounterRepository.read(encounterId, function (encounter)
    {
        encounter.active = active;
        encounterRepository.update(encounter, function ()
        {
            callback();
        })
    })
};

function addEncounterPlayerToMap(encounter, encounterPlayer, callback)
{
    //calculate and assign mapX, mapY to encounterPlayer
    var tokenPlaced = false;
    var y = 0;
    var x = 0;

    while (!tokenPlaced)
    {
        var spaceIsFree = true;
        for (var i = 0; i < encounter.players.length; i++)
        {
            var player = encounter.players[i];
            if (player.mapX === x && player.mapY === y)
            {
                spaceIsFree = false;
            }
        }

        if (spaceIsFree)
        {
            encounterPlayer.mapX = x;
            encounterPlayer.mapY = y;
            tokenPlaced = true;
        }

        x++;
        if (x >= encounter.mapDimX)
        {
            x = 0;
            y++
        }
    }

    encounter.addPlayer(encounterPlayer._id, function()
    {
        encounterPlayer.save(callback());
    });
}

module.exports = encounterService;