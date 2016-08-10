'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', function($scope, $http, socket, Profile)
{
	var encounterID = window.location.search.replace('?', '');
	$scope.encounter = {};
	$scope.players = [];

	$http.get('api/encounter/' + encounterID).success(function(data)
	{
		$scope.encounter = data.encounter;
		$scope.updatePlayers();
	});

	Profile.async().then(function()
	{
		var user = Profile.getUser();
		$scope.name = user.first_name + " " + user.last_name;
		Profile.setUser(user);
	});

	socket.on('init', function (data)
	{

	});

	socket.on('update:encounter', function(data)
	{
		console.log("Updating encounter");
		if (data.encounterID === encounterID)
		{
			$scope.updatePlayers();
		}
	});

	socket.on('encounter:end', function(data)
	{
		if (data.encounterID === encounterID)
		{
			$scope.status = 'ENDED'
		}
	});

	$scope.demonstrateTwoWayBinding = function()
	{
		console.log("In controller:: attempting 2 way binding");
	};

	$scope.updatePlayers = function()
	{
		var url = 'api/encounter/players/' + encounterID;
		$http.get(url).success(function(data)
		{
			$scope.players = data;
			console.log(data);
		});
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
		return $scope.players[index].npc;
	};
	
	$scope.isMyCharacter = function(index)
	{
		return (Profile.getUserID() === $scope.players[index].userID);
	};

	$scope.isVisible = function(index)
	{
		return $scope.players[index].visible;
	};

	$scope.toggleVisible = function(index)
	{
		var url = 'api/encounter/togglevisible';
		var data =
		{
			playerID : $scope.players[index]._id
		};
		$http.post(url, data).success(function(data)
		{
			if (data === "OK")
			{
				socket.emit('update:encounter',
				{
					encounterID : encounterID
				});
				$scope.players[index].visible = !$scope.players[index].visible;
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
			playerID : $scope.players[$scope.selectedPlayer]._id,
			hit : hit
		};
		var url = 'api/encounter/hitplayer';
		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
			{
				encounterID : encounterID
			});

			$scope.updatePlayers();
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
			playerID : $scope.players[$scope.selectedPlayer]._id,
			initiative : initiative
		};
		$http.post(url, data).success(function(data)
		{
			socket.emit('update:encounter',
			{
				encounterID : encounterID
			});

			$scope.updatePlayers();
		});
	};

	$scope.removePlayer = function(index)
	{
		console.log("Removing player " + index);

		var url = 'api/encounter/removeplayer/' + encounterID;
		var data =
		{
			playerID : $scope.players[index]._id
		};

		$http.post(url, data).success(function(data)
		{
			console.log(data);
			socket.emit('update:encounter', 
			{
				encounterID : encounterID
			});

			$scope.players.splice(index, 1);
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
		var encounterID = $scope.encounter._id;

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
			$scope.updatePlayers();
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
		var encounterID = $scope.encounter._id;

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
			$scope.updatePlayers();
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
		$scope.editNPC = JSON.parse(JSON.stringify($scope.players[index]));
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
				$scope.updatePlayers();
			}
		});
	};
});