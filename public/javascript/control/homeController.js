'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('homeController', function($scope, $window, $http, socket) 
{
	socket.on('init', function (data)
	{
	});
});