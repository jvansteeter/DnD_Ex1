'use strict';

var clientApp = angular.module('clientApp');

clientApp.config(function($locationProvider)
{
    $locationProvider.html5Mode(true);
});

clientApp.controller('encounterController', ['$scope', '$location', '$http', 'socket', function($scope, $location, $http, socket) 
{
    var path = window.location;
  	console.log("Encounter: ");
    console.log(path);

	socket.on('init', function (data) 
  	{
  		console.log(data);
  	});

}]);