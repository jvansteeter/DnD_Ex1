'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$http', 'socket', 'Profile', function($scope, $http, socket, Profile) 
{
    var encounterID = window.location.search.replace('?', '');
    $scope.encounter = {};
    $scope.players = [];
    $scope.hit = 0;

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

    socket.on('new:encounterPlayer', function(data)
    {
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

    $scope.damagePlayer = function(hit)
    {
        console.log("Attempting to damage player " + $scope.selectedPlayer + " m: " + $scope.multiple);

        //var hit = $scope.hit * $scope.multiple;
        console.log("Hit: " + hit);
        var data = 
        {
            playerID : $scope.players[$scope.selectedPlayer]._id,
            hit : $scope.hit
        };
        var url = 'api/encounter/hitplayer';
        $http.post(url, data).success(function(data)
        {
            socket.emit('update:encounter',
            {
                encounterID : encounterID
            });
        });
    };
}]);