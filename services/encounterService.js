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
    	if (error)
		{
			callback(error);
			return;
		}

		var hostName = user.first_name + ' ' + user.last_name;
		encounterRepository.createEncounter(title, campaignId, description, userId, hostName, active, function (error)
		{
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
    encounterRepository.read(encounterId, function (error, encounter)
    {
		if (error)
		{
			callback(error);
			return;
		}

        npcRepository.read(npcId, function (error, npc)
        {
			if (error)
			{
				callback(error);
				return;
			}

            // encounterPlayerRepository.create(npc.name, npc.userId, npc.iconURL, npc.armorClass, npc.hitPoints, npc.hitPoints, npc.passivePerception, npc.speed, false, npc.getSaves(), true, function (error, encounterPlayer)
            encounterPlayerRepository.createFromNPC(npc, function (error, encounterPlayer)
            {
				if (error)
				{
					callback(error);
					return;
				}

                addEncounterPlayerToMap(encounter, encounterPlayer, function(error)
                {
                    callback(error, encounterPlayer);
                })
            })
        })
    });
};

encounterService.addCharacter = function (encounterId, characterId, callback)
{
    encounterRepository.read(encounterId, function(error, encounter)
    {
		if (error)
		{
			callback(error);
			return;
		}

        characterRepository.read(characterId, function(error, character)
        {
			if (error)
			{
				callback(error);
				return;
			}

            // encounterPlayerRepository.create(character.name, character.userId, character.iconURL, character.armorClass, character.maxHitPoints, character.maxHitPoints, character.passivePerception, character.speed, true, character.getSaves(), false, function (error, encounterPlayer)
            encounterPlayerRepository.createFromCharacter(character, function (error, encounterPlayer)
            {
				if (error)
				{
					callback(error);
					return;
				}

                addEncounterPlayerToMap(encounter, encounterPlayer, function(error)
                {
                    callback(error, encounterPlayer);
                })
            })
        })
    })
};

encounterService.removePlayer = function (encounterId, playerId, callback)
{
    encounterRepository.read(encounterId, function(error, encounter)
    {
		if (error)
		{
			callback(error);
			return;
		}

        encounter.removePlayer(playerId, function (error)
        {
			if (error)
			{
				callback(error);
				return;
			}

			encounterPlayerRepository.delete(playerId, function (error)
			{
				callback(error);
			})
		});
    })
};

encounterService.getEncounterState = function (encounterId, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
		if (error)
		{
			callback(error);
			return;
		}

		encounterPlayerRepository.readAll(encounter.players, function (error, players)
		{
			if (error)
			{
				callback(error);
				return;
			}

			encounter.players = players;
			mapNotationRepository.readAll(encounter.mapNotations, function (error, mapNotations)
			{
				if (error)
				{
					callback(error);
					return;
				}

				// convert stringified cells back to JSON
				for (var i = 0; i < mapNotations.length; i++)
				{
					var mapNotation = mapNotations[i];
					var cells = [];
					for (var j = 0; j < mapNotation.cells.length; j++)
					{
						cells.push(JSON.parse(mapNotation.cells[j]))
					}
					mapNotation.cells = cells;
				}

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
		if (error)
		{
			callback(error);
			return;
		}

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
		if (error)
		{
			callback(error);
			return;
		}

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
		if (error)
		{
			callback(error);
			return;
		}

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
		if (error)
		{
			callback(error);
			return;
		}

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
		if (error)
		{
			callback(error);
			return;
		}

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
		if (error)
		{
			callback(error);
			return;
		}

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
		if (error)
		{
			callback(error);
			return;
		}

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
		if (error)
		{
			callback(error);
			return;
		}

        var directory = 'image/encounter/' + encounterId + '/';
        var fileName = 'map' + path.extname(imageFile);

        fs.ensureDirSync(directory);
        fs.copy(imageFile, directory + fileName, function (error)
        {
			if (error)
			{
				callback(error);
				return;
			}

            encounter.initialized = true;
            encounter.mapURL = directory + fileName;
            encounterRepository.update(encounter, function (error)
            {
				if (error)
				{
					callback(error);
					return;
				}

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
	encounterRepository.read(encounterId, function(error, encounter)
	{
		if (error)
		{
			callback(error);
			return;
		}

        mapNotationRepository.create(userId, function (error, mapNotation)
        {
			if (error)
			{
				callback(error);
				return;
			}

            encounter.addMapNotation(mapNotation._id, function(error)
            {
				callback(error);
            });
        })
	})
};

encounterService.removeMapNotation = function (encounterId, mapNotationId, callback)
{
    encounterRepository.read(encounterId, function (error, encounter)
    {
		if (error)
		{
			callback(error);
			return;
		}

        encounter.mapNotations.remove(mapNotationId);
		encounterRepository.update(encounter, function (error)
        {
			if (error)
			{
				callback(error);
				return;
			}

			mapNotationRepository.delete(mapNotationId, function (error)
			{
				callback(error);
			})
		})
	})
};

encounterService.updateMapNotation = function (mapNotationId, mapNotationObject, callback)
{
	mapNotationRepository.read(mapNotationId, function (error, mapNotation)
	{
		if (error)
		{
			callback(error);
			return;
		}

		mapNotation.setMapNotation(mapNotationObject);
        mapNotationRepository.update(mapNotation, function (error)
		{
			callback(error);
		})
	})
};

function addEncounterPlayerToMap(encounter, encounterPlayer, callback)
{
    //calculate and assign mapX, mapY to encounterPlayer
    var tokenPlaced = false;
    var y = 0;
    var x = 0;

    encounterPlayerRepository.readAll(encounter.players, function (error, players)
	{
		if (error)
		{
			callback(error);
			return;
		}

		while (!tokenPlaced)
		{
			var spaceIsFree = true;
			for (var i = 0; i < players.length; i++)
			{
				var player = players[i];
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

		encounter.addPlayer(encounterPlayer._id, function(error)
		{
			if (error)
			{
				callback(error);
				return;
			}

			encounterPlayer.save(callback);
		});
	});
}

module.exports = encounterService;