'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$http', 'socket', 'Profile', function($scope, $http, socket, Profile) 
{
    var encounterID = window.location.search.replace('?', '');
    $scope.encounter = {};
    $scope.players = [];

    socket.on('init', function (data) 
    {
        var url = "api/encounter/" + encounterID;

        $http.get(url).success(function(data)
        {
            $scope.encounter = data.encounter;
            Profile.setEncounter(data.encounter._id);

            var url = 'api/encounter/players/' + encounterID;
            $http.get(url).success(function(data)
            {
                $scope.players = data;
            });
        });
    });

    socket.on('update:encounter', function(data)
    {
        console.log("Updating encounter");
        if (data.encounterID === encounterID)
        {
            var url = 'api/encounter/players/' + encounterID;
            $http.get(url).success(function(data)
            {
                $scope.players = data;
            });
        }
    });

    $scope.setPlayer = function(index)
    {
        $scope.selectedPlayer = index;
    };

    $scope.setMultiplier = function(multiple)
    {
        $scope.multiple = multiple;
    }

    $scope.hitPlayer = function(hit)
    {
        console.log("Attempting to damage player " + $scope.selectedPlayer + " m: " + $scope.multiple);

        var hit = hit * $scope.multiple;
        console.log("Hit: " + hit);
        var data = 
        {
            playerID : $scope.players[$scope.selectedPlayer]._id,
            hit : hit
        };
        var url = 'api/encounter/hitplayer';
        $http.post(url, data).success(function(data)
        {
            socket.emit('update:encounter',
            {
                encounterID : encounterID
            });
            $scope.players[$scope.selectedPlayer].hitPoints += hit;
        });
    };
}]);