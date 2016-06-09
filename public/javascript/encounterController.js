'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', function($scope, $location, $http, socket) 
{
  	console.log("Encounter: " + $location.path());

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

  	$scope.join = function ()
  	{
  		console.log("Encounter: " + $scope.encounter.title);
  	}
});