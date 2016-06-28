'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('profileController', function($scope, $window, $http, socket, Profile) 
{
	$scope.name = Profile.getFirstName() + " " + Profile.getLastName();

	socket.on('init', function (data) 
	{
		console.log(data);
	});

	$scope.getCharacters = function()
	{
		var url = 'api/character/all';
		$http.get(url).success(function(data)
		{
			console.log(data);
			$scope.characters = data.characters;
		});
	};
	
	$scope.selectCharacter = function(index)
	{
		window.location = 'editCharacter.html?' + $scope.characters[index]._id;
	};
});