'use strict';

var clientApp = angular.module('clientApp');

clientApp.config(function ($modalProvider)
{
	angular.extend($modalProvider.defaults, {
		html: true
	});
});

clientApp.controller('encounterController', function ($scope, $http, $q, socket, Profile, mapMain, Encounter, $uibModal)
{
	var encounterID = window.location.search.replace('?', '');
	var initModal;
	var selectedPlayer = -1;

	$scope.encounterState = {};
	$scope.host = false;

	socket.on('init', function ()
	{
		Encounter.init(encounterID).then(function ()
		{
			$scope.host = Encounter.isHost();
			$scope.encounterState = Encounter.encounterState;

			if (!$scope.encounterState.initialized)
			{
				initModal = $uibModal.open({
					animation: true,
					templateUrl: 'modal/initializeMapModal.html',
					scope: $scope,
					backdrop: 'static',
					size: ''
				});
			}

			var id = Profile.getUserID();
			var username = Profile.getFirstName() + " " + Profile.getLastName();
			socket.emit('join',
				{
					room: encounterID,
					id: id,
					username: username
				});

			Encounter.connect();
		});
	});

	socket.on('new:joined', function (data)
	{
		console.log("New user has joined");
		console.log(data);
	});

	socket.on('exit', function (data)
	{
		console.log(data.username + " has left the chat room");
		// Encounter.disconnect(data.id);
	});

	socket.on('update:encounter', function (data)
	{
		$scope.updateEncounterState();
	});

	socket.on('update:player', function (player)
	{
		player.isHovered = false;
		for (var i = 0; i < Encounter.encounterState.players.length; i++)
		{
			if (Encounter.encounterState.players[i]._id === player._id)
			{
				if (angular.isDefined(Encounter.encounterState.players[i].isSelected) && Encounter.encounterState.players[i].isSelected === true)
				{
					player.isSelected = true;
				}
				else
				{
					player.isSelected = false;
				}
				for (var value in player)
				{
					Encounter.encounterState.players[i][value] = player[value];
					$scope.encounterState = Encounter.encounterState;
				}
			}
		}
	});

	socket.on('encounter:end', function (data)
	{
		if (data.encounterID === encounterID)
		{
			$scope.status = 'ENDED'
		}
	});

	$scope.uploadMapPhoto = function ($flow)
	{
		$flow.upload();
		$flow.files[0] = $flow.files[$flow.files.length - 1];

		var url = 'api/encounter/uploadmap/' + encounterID;
		var fd = new FormData();
		fd.append("file", $flow.files[0].file);
		$http.post(url, fd, {
			withCredentials: false,
			headers: {
				'Content-Type': undefined
			},
			transformRequest: angular.identity
		}).success(function (data)
		{
			$scope.updateEncounterState();
			initModal.close();
		});
	};

	$scope.initWithoutMap = function ()
	{
		var url = 'api/encounter/initwithoutmap/' + encounterID;
		$http.get(url).success(function (data)
		{
			$scope.updateEncounterState();
			initModal.close();
		});
	};

	$scope.updateEncounterState = function ()
	{
		Encounter.update().then(function ()
		{
			$scope.encounterState = Encounter.encounterState;
		});
	};

	$scope.isHost = function ()
	{
		return $scope.host;
	};

	$scope.isNPC = function (index)
	{
		return $scope.encounterState.players[index].npc;
	};

	$scope.isMyCharacter = function (index)
	{
		return (Profile.getUserID() === $scope.encounterState.players[index].userID);
	};

	$scope.isVisible = function (index)
	{
		return $scope.encounterState.players[index].visible;
	};

	$scope.toggleVisible = function (index)
	{
		Encounter.encounterState.players[index].visible = !Encounter.encounterState.players[index].visible;

		updateServerPlayer(Encounter.encounterState.players[index]);
	};

	$scope.healPlayer = function (hit)
	{
		console.log("Heal player");
		console.log(Encounter.encounterState.players[selectedPlayer]);
		console.log(hit);
		if (hit === 0 || isNaN(hit))
		{
			return;
		}

		$scope.encounterState.players[selectedPlayer].hitPoints = $scope.encounterState.players[selectedPlayer].hitPoints + hit;
		updateServerPlayer($scope.encounterState.players[selectedPlayer]);
	};

	$scope.damagePlayer = function (hit)
	{
		$scope.healPlayer(-hit);
	};

	$scope.setInitiative = function (initiative)
	{
		if (initiative < 1 || isNaN(initiative))
		{
			return;
		}

		var url = 'api/encounter/setinitiative';
		var data =
		{
			playerID: $scope.encounterState.players[$scope.selectedPlayer]._id,
			initiative: initiative
		};
		$http.post(url, data).success(function (data)
		{
			socket.emit('update:encounter',
				{
					encounterID: encounterID
				});

			$scope.updateEncounterState();
		});
	};

	$scope.removePlayer = function (index)
	{
		var url = 'api/encounter/removeplayer/' + encounterID;
		var data =
		{
			playerID: $scope.encounterState.players[index]._id
		};

		$http.post(url, data).success(function (data)
		{
			socket.emit('update:encounter',
				{
					encounterID: encounterID
				});

			$scope.updateEncounterState();
		});
	};

	$scope.listModalgetCharacters = function ()
	{
		var url = 'api/character/all/' + Profile.getUserID();
		$http.get(url).success(function (data)
		{
			$scope.characters = data.characters;
		});
	};

	$scope.listModalselectCharacter = function (index)
	{
		var encounterID = $scope.encounterState._id;

		var url = 'api/encounter/addcharacter/' + encounterID;
		var data =
		{
			characterID: $scope.characters[index]._id
		};

		$http.post(url, data).success(function (data)
		{
			socket.emit('update:encounter',
				{
					encounterID: encounterID
				});
			$scope.updateEncounterState();
		});
	};

	$scope.listModalgetNPCs = function ()
	{
		var url = 'api/npc/all/';
		$http.get(url).success(function (data)
		{
			$scope.npcs = data.npcs;
		});
	};

	$scope.listModalselectNPC = function (index)
	{
		var encounterID = $scope.encounterState._id;

		var url = 'api/encounter/addnpc/' + encounterID;
		var data =
		{
			npcID: $scope.npcs[index]._id
		};

		$http.post(url, data).success(function (data)
		{
			socket.emit('update:encounter',
				{
					encounterID: encounterID
				});
			$scope.updateEncounterState();
		});
	};

	$scope.submit = function ()
	{
		var url = 'api/encounter/setactive/' + encounterID;
		var active = !$scope.encounterState.active;
		var data =
		{
			active: active
		};

		$http.post(url, data).success(function (data)
		{
			if (data === "OK")
			{
				socket.emit('encounter:end',
					{
						encounterID: encounterID
					});
				socket.emit('new:encounter', {});
				$scope.encounterState.active = active;
			}
		});
	};

	$scope.setNPCtoEdit = function (index)
	{
		$scope.editNPC = JSON.parse(JSON.stringify($scope.encounterState.players[index]));
	};

	$scope.editModalSave = function ()
	{
		var url = "api/encounter/updateplayer";
		var data =
		{
			player: $scope.editNPC
		};
		$http.post(url, data).success(function (data)
		{
			if (data === "OK")
			{
				socket.emit('update:encounter',
					{
						encounterID: encounterID
					});
				$scope.updateEncounterState();
			}
		});
	};

	$scope.getColor = function (player)
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

	$scope.setHover = function (player)
	{
		for (var i = 0; i < Encounter.encounterState.players.length; i++)
		{
			if (Encounter.encounterState.players[i]._id === player._id)
			{
				Encounter.encounterState.players[i].isHovered = true;
			}
			else
			{
				Encounter.encounterState.players[i].isHovered = false;
			}
		}
	};

	$scope.removeHover = function (player)
	{
		for (var i = 0; i < Encounter.encounterState.players.length; i++)
		{
			Encounter.encounterState.players[i].isHovered = false;
		}
	};

	$scope.isHovered = function (player)
	{
		for (var i = 0; i < Encounter.encounterState.players.length; i++)
		{
			if (Encounter.encounterState.players[i]._id === player._id && (Encounter.encounterState.players[i].isHovered || Encounter.encounterState.players[i].isSelected))
			{
				if (Encounter.encounterState.players[i].isSelected)
				{
					return "background-color: rgba(0,0,0,.1); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);";
				}

				if (Encounter.encounterState.players[i].isHovered)
				{
					return "background-color: rgba(255,255,255,1); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);";
				}
			}
		}

		return "";
	};

	$scope.selectPlayer = function (player)
	{
		for (var i = 0; i < Encounter.encounterState.players.length; i++)
		{
			if (Encounter.encounterState.players[i]._id === player._id)
			{
				if (Encounter.encounterState.players[i].isSelected)
				{
					Encounter.encounterState.players[i].isSelected = false;
				}
				else
				{
					selectedPlayer = i;
					Encounter.encounterState.players[i].isSelected = true;
				}
			}
			else
			{
				Encounter.encounterState.players[i].isSelected = false;
			}
		}
	};

	function updateServerPlayer(player)
	{
		var url = 'api/encounter/updateplayer';
		var data =
		{
			player: player
		};
		$http.post(url, data).success(function (data)
		{
			if (data === "OK")
			{
				socket.emit('update:player', player);
			}
		});
	}
});