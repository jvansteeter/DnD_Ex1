'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('homeController', function($scope, $window, $http, socket) 
{
	var posts = [];

	socket.on('init', function (data) 
	{
		console.log(data);

		var url = "api/encounter/all";
		var data =  
		{
			"username" : $scope.usernameInput,
			"password" : $scope.passwordInput
		};

		$http.get(url, data).success(function(data)
		{
			console.log(data);
			$scope.encounters = data.encounters.reverse();
		});
	});

	socket.on('new:encounter', function()
	{
		var url = "api/encounter/all";
		var data =  
		{
			"username" : $scope.usernameInput,
			"password" : $scope.passwordInput
		};

		$http.get(url, data).success(function(data)
		{
			console.log(data);
			$scope.encounters = data.encounters.reverse();
		});
	});
});