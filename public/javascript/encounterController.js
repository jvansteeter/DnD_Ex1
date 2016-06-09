'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$http', 'socket', function($scope, $http, socket) 
{
    var encounterID = window.location.search.replace('?', '');

	socket.on('init', function (data) 
  	{
  		console.log(data);
  	});

    var url = "api/encounter/" + encounterID;
    $http.get(url, data).success(function(data)
    {
        console.log(data);
        $scope.encounter = data.encounter;
    });

}]);