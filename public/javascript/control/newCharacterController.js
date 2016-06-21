'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('newCharacterController', function($scope, $window, $http, Profile)
{
    $scope.features = [];
    $scope.proficiencies = [];
    $scope.languages = [];
    $scope.attacks = [];
    $scope.dndLanguages = 
        [
            'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
            'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
        ];

    $scope.addFeature = function()
    {
        $scope.features.push("");
    }

    $scope.removeFeature = function()
    {
        $scope.features.splice(-1, 1);
    }

    $scope.addProficiency = function()
    {
        $scope.proficiencies.push("");
    }

    $scope.removeProficiency = function()
    {
        $scope.proficiencies.splice(-1, 1);
    }

    $scope.addLanguage = function()
    {
        $scope.languages.push("");
    }

    $scope.removeLanguage = function()
    {
        $scope.languages.slice(-1, 1);
    }

    $scope.addAttack = function()
    {
        $scope.attacks.push("");
    }
    
    $scope.removeAttack = function()
    {
        $scope.attacks.splice(-1, 1);
    }
});