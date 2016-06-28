'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$http', 'socket', 'Profile', function($scope, $http, socket, Profile) 
{
	var encounterID = window.location.search.replace('?', '');
	$scope.encounter = {};
	$scope.players = [];

	socket.on('init', function (data) 
	{
		var url = "api/encounter/" + encounterID;

		$http.get(url).success(function(data)
		{
			$scope.encounter = data.encounter;
			Profile.setEncounter(data.encounter._id);

			if (data.encounter.active === true)
			{
				$scope.status = '';
			}
			else
			{
				$scope.status = 'ENDED';
			}

			$scope.updatePlayers();
		});
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

	$scope.updatePlayers = function()
	{
		var url = 'api/encounter/players/' + encounterID;
		$http.get(url).success(function(data)
		{
			$scope.players = data;
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
		if (Profile.getUsername() === $scope.encounter.host)
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
		return (Profile.getUsername() === $scope.players[index].user);
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
		var url = 'api/character/all';
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
		});
	};

	$scope.submit = function()
	{
		console.log("Ending encounter");

		var url = 'api/encounter/end/' + encounterID;

		$http.get(url).success(function(data)
		{
			console.log(data);

			if (data === "OK")
			{
				socket.emit('encounter:end', 
				{
					encounterID : encounterID
				});
				$scope.status = "ENDED";
			}
		});
	};
}]);