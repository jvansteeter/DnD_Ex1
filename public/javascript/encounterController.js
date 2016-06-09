'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', function($scope, $location, $http, socket) 
{
    var path = $location.path().search("enconter");
  	console.log("Encounter: " + path);

	socket.on('init', function (data) 
  	{
  		console.log(data);
  	});
});