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
            console.log("Stored encounter id in session storage");
        });
    });





}]);