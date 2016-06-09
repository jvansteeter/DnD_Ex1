'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$routeParams', '$http', 'socket', function($scope, $routeParams, $http, socket) 
{
    var path = $routeParams;
  	console.log("Encounter: ");
    console.log(path);

	socket.on('init', function (data) 
  	{
  		console.log(data);
  	});

}]);