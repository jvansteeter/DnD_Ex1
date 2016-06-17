'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('profileController', function($scope, $window, $http, socket, Profile) 
{
	$scope.name = Profile.getFirstName() + " " + Profile.getLastName();

	socket.on('init', function (data) 
	{
		console.log(data);

		
	});

	
});