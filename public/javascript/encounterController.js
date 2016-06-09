'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$location', '$http', 'socket', function($scope, $location, $http, socket) 
{
    var path = $location.search();
  	console.log("Encounter: ");
    console.log(path);

	socket.on('init', function (data) 
  	{
  		console.log(data);
  	});
}] );