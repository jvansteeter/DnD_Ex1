'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', function($scope, $http, $q, socket, Profile, mapMain)
{
	var encounterID = window.location.search.replace('?', '');
	$scope.encounter = {};
	$scope.gameState;

	socket.on('init', function (data)
	{
		var url = "api/encounter/" + encounterID;

		$http.get(url).success(function(data)
		{
			$scope.encounter = data.encounter;
			Profile.setEncounter(data.encounter._id);

			$scope.updateGameState().then(function()
			{
				mapMain.start();
			});
		});
	});

	socket.on('update:encounter', function(data)
	{
		console.log("Updating encounter");
		if (data.encounterID === encounterID)
		{
			$scope.updateGameState();
		}
	});

	socket.on('encounter:end', function(data)
	{
		if (data.encounterID === encounterID)
		{
			$scope.status = 'ENDED'
		}
	});

	$scope.updateGameState = function()
	{

		var deffered = $q.defer();
		var url = 'api/encounter/gamestate/' + encounterID;
		$http.get(url).success(function(data)
		{
			$scope.gameState = data;
			// console.log(data);
			mapMain.setGameState(data);
			deffered.resolve();
		}).error(function(data)
		{
			deffered.reject();
		});

		return deffered.promise;
	};

	$scope.setPlayer = function(index)
	{
		$scope.selectedPlayer = index;
	};

	$scope.setMultiplier = function(multiple)
	{
		$scope.multiple = multiple;
	}

	$scope.isHost = function()
	{
		if (Profile.getUserID() === $scope.encounter.hostID)
		{
			return true;
		}
		return false;
	};

	$scope.isNPC = function(index)
	{
		return $scope.gameState.players[index].npc;
	};
	
	$scope.isMyCharacter = function(index)
	{
		return (Profile.getUserID() === $scope.gameState.players[index].userID);
	};

	$scope.isVisible = function(index)
	{
		return $scope.gameState.players[index].visible;
	};

	$scope.toggleVisible = function(index)
	{
		var url = 'api/encounter/togglevisible';
		var data =
		{
			playerID : $scope.gameState.players[index]._id
		};
		$http.post(url, data).success(function(data)
		{
			if (data === "OK")
			{
				socket.emit('update:encounter',
				{
					encounterID : encounterID
				});
				$scope.gameState.players[index].visible = !$scope.gameState.players[index].visible;
			}
		});
	};

	$scope.hitPlayer = function(hit)
	{
		if (hit < 1 || isNaN(hit))
		{
			return;
		}

		hit = hit * $scope.multiple;
		var data = 
		{
			playerID : $scope.gameState.players[$scope.selectedPlayer]._id,
			hit : hit
		};
		var url = 'api/encounter/hitplayer';
		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
			{
				encounterID : encounterID
			});

			$scope.updateGameState();
		});
	};

	$scope.setInitiative = function(initiative)
	{
		if (initiative < 1 || isNaN(initiative))
		{
			return;
		}

		var url = 'api/encounter/setinitiative';
		var data =
		{
			playerID : $scope.gameState.players[$scope.selectedPlayer]._id,
			initiative : initiative
		};
		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
			{
				encounterID : encounterID
			});

			$scope.updateGameState();
		});
	};

	$scope.removePlayer = function(index)
	{
		console.log("Removing player " + index);

		var url = 'api/encounter/removeplayer/' + encounterID;
		var data =
		{
			playerID : $scope.gameState.players[index]._id
		};

		$http.post(url, data).success(function(data)
		{
			console.log(data);
			socket.emit('update:encounter', 
			{
				encounterID : encounterID
			});

			$scope.gameState.players.splice(index, 1);
		});
	};

	$scope.listModalgetCharacters = function()
	{
		var url = 'api/character/all/' + Profile.getUserID();
		$http.get(url).success(function(data)
		{
			console.log(data);
			$scope.characters = data.characters;
		});
	};

	$scope.listModalselectCharacter = function(index)
	{
		var encounterID = Profile.getEncounter();

		var url = 'api/encounter/addcharacter/' + encounterID;
		var data =
		{
			characterID: $scope.characters[index]._id
		};
		
		$http.post(url, data).success(function(data)
		{
			console.log(data);
			console.log("Character successfully added");
			socket.emit('update:encounter',
				{
					encounterID : encounterID
				});
			$scope.updateGameState();
		});
	};

	$scope.listModalgetNPCs = function()
	{
		var url = 'api/npc/all/';
		$http.get(url).success(function(data)
		{
			console.log(data);
			$scope.npcs = data.npcs;
		});
	};

	$scope.listModalselectNPC = function(index)
	{
		var encounterID = Profile.getEncounter();

		var url = 'api/encounter/addnpc2/' + encounterID;
		var data =
		{
			npcID: $scope.npcs[index]._id
		};

		$http.post(url, data).success(function(data)
		{
			console.log(data);
			console.log("NPC successfully added");
			socket.emit('update:encounter',
				{
					encounterID : encounterID
				});
			$scope.updateGameState();
		});
	};

	$scope.submit = function()
	{
		console.log("Ending encounter");

		var url = 'api/encounter/setactive/' + encounterID;
		var active = !$scope.encounter.active;
		var data =
		{
			active : active
		};

		$http.post(url, data).success(function(data)
		{
			console.log(data);

			if (data === "OK")
			{
				socket.emit('encounter:end', 
				{
					encounterID : encounterID
				});
				socket.emit('new:encounter', {});
				$scope.encounter.active = active;
			}
		});
	};
	
	$scope.setNPCtoEdit = function(index)
	{
		$scope.editNPC = JSON.parse(JSON.stringify($scope.gameState.players[index]));
	};

	$scope.editModalSave = function()
	{
		console.log($scope.editNPC);
		var url = "api/encounter/updatenpc";
		var data =
		{
			npc : $scope.editNPC
		};
		$http.post(url, data).success(function(data)
		{
			if (data === "OK")
			{
				socket.emit('update:encounter',
				{
					encounterID : encounterID
				});
				$scope.updateGameState();
			}
		});
	};

	$scope.getColor = function(player)
	{
		if (player.npc)
		{
			return "rgba(255, 0, 0, 0.3)";
		}
		else
		{
			return "rgba(51, 122, 183, 0.3)";
		}
	};
});