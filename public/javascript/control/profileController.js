'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('profileController', function($scope, $window, $http, socket, Profile) 
{
	$scope.name = Profile.getFirstName() + " " + Profile.getLastName();

	socket.on('init', function (data) 
	{
		console.log(data);
	});

	$scope.listModalgetCharacters = function()
	{
		var url = 'api/character/all/' + Profile.getUserID();;
		$http.get(url).success(function(data)
		{
			console.log(data);
			$scope.characters = data.characters;
		});
	};
	
	$scope.listModalselectCharacter = function(index)
	{
		window.location = 'editCharacter?' + $scope.characters[index]._id;
	};

	$scope.listModalgetNPCs = function()
	{
		var url = 'api/npc/all/' + Profile.getUserID();;
		$http.get(url).success(function(data)
		{
			console.log(data);
			$scope.npcs = data.npcs;
		});
	};

	$scope.listModalselectNPC = function(index)
	{
		window.location = 'editNPC?' + $scope.npcs[index]._id;
	};
});