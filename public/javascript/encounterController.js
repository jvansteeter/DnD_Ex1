'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('encounterController', ['$scope', '$http', 'socket', 'Profile', function($scope, $http, socket, Profile) 
{
    var encounterID = window.location.search.replace('?', '');
    $scope.encounter = {};
    $scope.newCharacter = {};

    socket.on('init', function (data) 
    {
        console.log(data);
        var url = "api/encounter/" + encounterID;
        console.log("---!!! About to call for encounter ID !!!---");
        $http.get(url).success(function(data)
        {
            console.log(data);
            $scope.encounter = data.encounter;
            Profile.setEncounter(data.encounter._id);
        });
    });

    socket.on('new:encounterPlayer', function(data)
    {
        console.log(data);
        if (data.encounterID === encounterID)
        {
            var url = 'api/encounter/players/' + encounterID;
            $http.get(url).success(function(data)
            {
                console.log("Receiving information about this encounters players");
                console.log(data);
            });
        }
    });





}]);