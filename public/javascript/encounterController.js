'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$http', 'socket', function($scope, $http, socket) 
{
    var path = window.location.search;
  	console.log("Encounter: ");
    console.log(path);

	socket.on('init', function (data) 
  	{
  		console.log(data);
  	});

}]);