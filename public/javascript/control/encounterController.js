'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', function($scope, $http, $q, socket, Profile, mapMain, Encounter)
{
	var encounterID = window.location.search.replace('?', '');
	$scope.encounter = {};
	$scope.host = false;

	socket.on('init', function (data)
	{
		Encounter.init(encounterID).then(function()
		{
			$scope.host = Encounter.isHost();
			$scope.encounter = Encounter.getEncounterState();
			console.log($scope.encounter);
			// mapMain.setGameState(Encounter.isHost());
		});
		// Profile.async().then(function()
		// {
		// 	var user = Profile.getUser();
		// 	$scope.name = user.first_name + " " + user.last_name;
		// 	Profile.setUser(user);
        //
		// 	$http.get('api/encounter/' + encounterID).success(function(data)
		// 	{
		// 		$scope.encounter = data;
		// 		if (Profile.getUserID() === data.hostID)
		// 		{
		// 			$scope.host = true;
		// 		}
		// 		else
		// 		{
		// 			$scope.host = false;
		// 		}
        //
		// 		$scope.updateEncounterState().then(function()
		// 		{
		// 			mapMain.start($scope.host);
		// 		});
		// 	});
		// });
	});

	socket.on('update:encounter', function(data)
	{
		if (data.encounterID === encounterID)
		{
			$scope.updateEncounterState();
		}
	});

	socket.on('encounter:end', function(data)
	{
		if (data.encounterID === encounterID)
		{
			$scope.status = 'ENDED'
		}
	});

	$scope.updateEncounterState = function()
	{
		Encounter.update().then(function()
		{
			$scope.encounterState = Encounter.getEncounterState();
		});
		// var deferred = $q.defer();
		// var url = 'api/encounter/gamestate/' + encounterID;
		// $http.get(url).success(function(data)
		// {
		// 	$scope.encounterState = data;
		// 	mapMain.setGameState(data);
		// 	deferred.resolve();
		// }).error(function()
		// {
		// 	deferred.reject();
		// });
        //
		// return deferred.promise;
	};

	$scope.setPlayer = function(index)
	{
		$scope.selectedPlayer = index;
	};

	$scope.setMultiplier = function(multiple)
	{
		$scope.multiple = multiple;
	};

	$scope.isHost = function()
	{
		return $scope.host;
	};

	$scope.isNPC = function(index)
	{
		return $scope.encounterState.players[index].npc;
	};
	
	$scope.isMyCharacter = function(index)
	{
		return (Profile.getUserID() === $scope.encounterState.players[index].userID);
	};

	$scope.isVisible = function(index)
	{
		return $scope.encounterState.players[index].visible;
	};

	$scope.toggleVisible = function(index)
	{
		var url = 'api/encounter/togglevisible';
		var data =
		{
			playerID : $scope.encounterState.players[index]._id
		};
		$http.post(url, data).success(function(data)
		{
			if (data === "OK")
			{
				socket.emit('update:encounter',
				{
					encounterID : encounterID
				});
				$scope.encounterState.players[index].visible = !$scope.encounterState.players[index].visible;
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
			playerID : $scope.encounterState.players[$scope.selectedPlayer]._id,
			hit : hit
		};
		var url = 'api/encounter/hitplayer';
		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
			{
				encounterID : encounterID
			});

			$scope.updateEncounterState();
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
			playerID : $scope.encounterState.players[$scope.selectedPlayer]._id,
			initiative : initiative
		};
		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
			{
				encounterID : encounterID
			});

			$scope.updateEncounterState();
		});
	};

	$scope.removePlayer = function(index)
	{
		var url = 'api/encounter/removeplayer/' + encounterID;
		var data =
		{
			playerID : $scope.encounterState.players[index]._id
		};

		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
			{
				encounterID : encounterID
			});

			$scope.encounterState.players.splice(index, 1);
		});
	};

	$scope.listModalgetCharacters = function()
	{
		var url = 'api/character/all/' + Profile.getUserID();
		$http.get(url).success(function(data)
		{
			$scope.characters = data.characters;
		});
	};

	$scope.listModalselectCharacter = function(index)
	{
		var encounterID = $scope.encounter._id;

		var url = 'api/encounter/addcharacter/' + encounterID;
		var data =
		{
			characterID: $scope.characters[index]._id
		};
		
		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
				{
					encounterID : encounterID
				});
			$scope.updateEncounterState();
		});
	};

	$scope.listModalgetNPCs = function()
	{
		var url = 'api/npc/all/';
		$http.get(url).success(function(data)
		{
			$scope.npcs = data.npcs;
		});
	};

	$scope.listModalselectNPC = function(index)
	{
		var encounterID = $scope.encounter._id;

		var url = 'api/encounter/addnpc2/' + encounterID;
		var data =
		{
			npcID: $scope.npcs[index]._id
		};

		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
				{
					encounterID : encounterID
				});
			$scope.updateEncounterState();
		});
	};

	$scope.submit = function()
	{
		var url = 'api/encounter/setactive/' + encounterID;
		var active = !$scope.encounter.active;
		var data =
		{
			active : active
		};

		$http.post(url, data).success(function(data)
		{
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
		$scope.editNPC = JSON.parse(JSON.stringify($scope.encounterState.players[index]));
	};

	$scope.editModalSave = function()
	{
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
				$scope.updateEncounterState();
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