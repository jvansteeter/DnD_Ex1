'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$http', 'socket', function($scope, $http, socket) 
{
    var encounterID = window.location.search.replace('?', '');

	socket.on('init', function (data) 
  	{
  		console.log(data);
        var url = "api/encounter/" + encounterID;
        console.log("---!!! About to call for encounter ID !!!---");
        $http.get(url).success(function(data)
        {
            console.log(data);
            $scope.encounter = data.encounter;
        });
    });

    $scope.newCharacter = {};

    $scope.addCharacter = function()
    {
        console.log($scope.newCharacter.name);
        console.log($scope.newCharacter.initiative);
        console.log($scope.newCharacter.armorClass);
        console.log($scope.newCharacter.hitPoints);

        var data =
        {
            name : $scope.character.name,
            initiative : $scope.character.initiative,
            armorClass : $scope.character.armorClass,
            maxHitPoints : $scope.character.hitPoints,
            hitPoints : $scope.character.hitPoints
        };
        url = 'api/encounter/addplayer/' + $scope.encounter._id;
        /*$http.post(url, data).success(function(data)
        {
            console.log(data);
            $scope.character.name = '';
            $scope.character.initiative = '';
            $scope.character.armorClass = '';
            $scope.character.hitPoints = '';
            console.log("Player successfully added");
        });*/

        /*var socket = io.connect();

        var url = "api/encounter/create";
        var data =  
        {
            title : $scope.newEncounterTitle,
            description : $scope.newEncounterDescription
        };

        $http.post(url, data).success(function(data)
        {
            console.log("---!!! Create new encounter was successful !!!---");
            console.log(data);
            socket.emit('new:encounter');
        });*/
    };


}]);