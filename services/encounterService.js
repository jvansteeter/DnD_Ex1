'use strict';

var encounterRepository = require('../repositories/encounterRepository');
var userRepository = require('../repositories/userRepository');
var npcRepository = require('../repositories/npcRepository');
var encounterPlayerRepository = require('../repositories/encounterPlayerRepository');

var encounterService = {};

encounterService.createEncounter = function (userId, title, campaignId, description, active, callback)
{
    userRepository.readById(userId, function (user)
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
    encounterRepository.readById(encounterId, function (encounter)
    {
        callback(encounter);
    });
};

encounterService.addNPC = function (encounterId, npcId, callback)
{
    encounterService.getEncounterById(encounterId, function (encounter)
    {
        npcRepository.readById(npcId, function (npc)
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