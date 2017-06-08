'use strict';

var fs = require('fs-extra');
var path = require('path');

var encounterRepository = require('../repositories/encounterRepository');
var userRepository = require('../repositories/userRepository');
var characterRepository = require('../repositories/characterRepository');
var npcRepository = require('../repositories/npcRepository');
var encounterPlayerRepository = require('../repositories/encounterPlayerRepository');
var mapNotationRepository = require('../repositories/mapNotationRepository');

var encounterService = {};

encounterService.createEncounter = function (userId, title, campaignId, description, active, callback)
{
    userRepository.read(userId, function (error, user)
    {
        handleError(error, callback);
        var hostName = user.first_name + ' ' + user.last_name;
        encounterRepository.createEncounter(title, campaignId, description, userId, hostName, active, function (error)
        {
            handleError(error, callback);
            callback(error);
        });
    });
};

encounterService.getEncounterById = function (encounterId, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
        callback(error, encounter);
    });
};

encounterService.addNPC = function (encounterId, npcId, callback)
{
    encounterService.getEncounterState(encounterId, function (error, encounter)
    {
        handleError(error, callback);
        npcRepository.read(npcId, function (error, npc)
        {
            handleError(error, callback);
            encounterPlayerRepository.create(npc.name, npc.userId, npc.iconURL, npc.armorClass, npc.hitPoints, npc.hitPoints, npc.passivePerception, false, npc.getSaves(), true, function (error, encounterPlayer)
            {
                handleError(error, callback);
                addEncounterPlayerToMap(encounter, encounterPlayer, function(error)
                {
                    callback(error);
                })
            })
        })
    });
};

encounterService.addCharacter = function (encounterId, characterId, callback)
{
    encounterService.getEncounterState(encounterId, function(error, encounter)
    {
        handleError(error, callback);
        characterRepository.read(characterId, function(error, character)
        {
            handleError(error, callback);
            encounterPlayerRepository.create(character.name, character.userId, character.iconURL, character.armorClass, character.maxHitPoints, character.maxHitPoints, character.passivePerception, false, character.getSaves(), true, function (error, encounterPlayer)
            {
                handleError(error, callback);
                addEncounterPlayerToMap(encounter, encounterPlayer, function(error)
                {
                    callback(error);
                })
            })
        })
    })
};

encounterService.removePlayer = function (encounterId, playerId, callback)
{
    encounterRepository.read(encounterId, function(error, encounter)
    {
        handleError(error, callback);
        encounter.removePlayer(playerId);
        encounterPlayerRepository.delete(playerId, function (error)
        {
            callback(error);
        })
    })
};

encounterService.getEncounterState = function (encounterId, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
        handleError(error, callback);
        encounterPlayerRepository.readAll(encounter.players, function (error, players)
        {
            handleError(error, callback);
            encounter.players = players;
            mapNotationRepository.readAll(encounter.mapNotations, function (error, mapNotations)
            {
                handleError(error, callback);
                encounter.mapNotations = mapNotations;
				callback(error, encounter);
            })
        })
    })
};

encounterService.damagePlayer = function (playerId, damage, callback)
{
    encounterPlayerRepository.read(playerId, function (error, player)
    {
        handleError(error, callback);
        player.damage(damage);
        encounterPlayerRepository.update(player, function (error)
        {
            callback(error);
        })
    })
};

encounterService.healPlayer = function (playerId, heal, callback)
{
    encounterService.damagePlayer(playerId, -heal, function (error)
    {
        callback(error);
    })
};

encounterService.setInitiative = function (playerId, initiative, callback)
{
    encounterPlayerRepository.read(playerId, function (error, player)
    {
        handleError(error, callback);
        player.initiative = initiative;
        encounterPlayerRepository.update(player, function (error)
        {
            callback(error);
        })
    })
};

encounterService.toggleVisible = function (playerId, callback)
{
    encounterPlayerRepository.read(playerId, function (error, player)
    {
        handleError(error, callback);
        player.visible = !player.visible;
        encounterPlayerRepository.update(player, function (error)
        {
            callback(error);
        })
    })
};

encounterService.setActive = function (encounterId, active, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
        handleError(error, callback);
        encounter.active = active;
        encounterRepository.update(encounter, function (error)
        {
            callback(error);
        })
    })
};

encounterService.updateMapData = function (encounterId, resX, resY, dimX, dimY, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
        handleError(error, callback);
        encounter.mapResX = resX;
        encounter.mapResY = resY;
        encounter.mapDimX = dimX;
        encounter.mapDimY = dimY;
        encounterRepository.update(encounter, function (error)
        {
            callback(error);
		})
	})
};

encounterService.updatePlayer = function (playerId, playerObject, callback)
{
    encounterPlayerRepository.read(playerId, function (error, player)
    {
        handleError(error, callback);
        player.setPlayer(playerObject);
        encounterPlayerRepository.update(player, function (error)
        {
            callback(error);
		})
    })
};

encounterService.initWithoutMap = function (encounterId, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
        handleError(error, callback);
        encounter.initialized = true;
        encounterRepository.update(encounter, function (error)
        {
            callback(error);
		})
	})
};

encounterService.uploadMap = function (encounterId, imageFile, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
        handleError(error, callback);

        var directory = 'image/encounter/' + encounterId + '/';
        var fileName = 'map' + path.extname(imageFile);

        fs.ensureDirSync(directory);
        fs.copy(imageFile, directory + fileName, function (error)
        {
            handleError(error, callback);
            encounter.initialized = true;
            encounter.mapURL = directory + fileName;
            encounterRepository.update(encounter, function (error)
            {
                handleError(error, callback);
                fs.unlink(imageFile, function (error)
                {
                    callback(error);
				})
			})
		})
	})
};

encounterService.addMapNotation = function (encounterId, userId, callback)
{
    console.log('in service addMapNotation');
	encounterRepository.read(encounterId, function(error, encounter)
	{
	    console.log('have encounter');
        handleError(error, callback);
        mapNotationRepository.create(userId, function (error, mapNotation)
        {
            console.log('created notation');
            handleError(error, callback);
            encounter.addMapNotation(mapNotation._id, function(error)
            {
				console.log('saved to encounter');
				callback(error);
            });
        })
	})
};

encounterService.removeMapNotation = function (encounterId, mapNotationId, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
        handleError(error, callback);
        encounter.mapNotations.remove(mapNotationId);
		encounterRepository.update(encounter, function (error)
        {
            handleError(error, callback);
			mapNotationRepository.delete(mapNotationId, function (error)
			{
				callback(error);
			})
		})
	})
};

encounterService.updateMapNotation = function (mapNotationId, mapNotationObject, callback)
{
    console.log('in encounter service ' + mapNotationId);
	mapNotationRepository.read(mapNotationId, function (error, mapNotation)
	{
	    console.log('this gets returned from read')
	    console.log(mapNotation);
		handleError(error, callback);
		mapNotation.setMapNotation(mapNotationObject);
        mapNotationRepository.update(mapNotation, function (error)
		{
		    console.log('returned from update')
			callback(error);
		})
	})
};

// encounterService.updatePlayer = function (playerId, playerObject, callback)
// {
//     encounterPlayerRepository.read(playerId, function (error, player)
//     {
//         handleError(error, callback);
//         player.setPlayer(playerObject);
//         encounterPlayerRepository.update(player, function (error)
//         {
//             callback(error);
//         })
//     })
// };

function handleError(error, callback)
{
    if (error)
    {
        callback(error);
    }
}

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
        encounterPlayer.save(callback);
    });
}

module.exports = encounterService;