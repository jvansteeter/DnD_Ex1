'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('newCharacterController', function($scope, $window, $http, Profile)
{
    $scope.features = [];
    $scope.proficiencies = [];

    $scope.addFeature = function()
    {
        $scope.features.push("");
    }

    $scope.addProficiency = function()
    {
        $scope.proficiencies.push("");
    }
});