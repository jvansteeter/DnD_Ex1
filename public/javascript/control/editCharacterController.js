'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('editCharacterController', function($scope, $window, $http, $alert)
{
    $scope.character = {};
    $scope.character.features = [];
    $scope.character.proficiencies = [];
    $scope.character.languages = [];
    $scope.character.attacks = [];
    $scope.character.equipment = [];

    $scope.classes = [];
    $scope.levels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    $scope.dndLanguages =
        [
            'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
            'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
        ];

    $http.get('api/class/all').success(function(data)
    {
        $scope.classes = data.classes;
    });

    var characterID = window.location.search.replace('?', '');
    $http.get('api/character/' + characterID).success(function(data)
    {
        $scope.character = data.character;
    });

    $scope.save = function ()
    {
        console.log("Saving");
        console.log($scope.character);

        var url = 'api/character/update';
        var data =
        {
            character: $scope.character
        };
        $http.post(url, data).success(function(data)
        {
            console.log("Response");
            console.log(data);
            if (data === "OK")
            {
                window.location = 'profile';
            }
            else
            {
                $scope.errorMessage = data;
                $('#errorAlert').fadeIn();
            }
        });
    };

    $scope.cancel = function()
    {
        window.location = 'profile';
    };

    $scope.addFeature = function()
    {
        $scope.character.features.push("");
    };

    $scope.removeFeature = function()
    {
        $scope.character.features.splice(-1, 1);
    };

    $scope.addProficiency = function()
    {
        $scope.character.proficiencies.push("");
    };

    $scope.removeProficiency = function()
    {
        $scope.character.proficiencies.splice(-1, 1);
    };

    $scope.addLanguage = function()
    {
        $scope.character.languages.push("");
    };

    $scope.removeLanguage = function()
    {
        $scope.character.languages.splice(-1, 1);
    };

    $scope.addAttack = function()
    {
        $scope.character.attacks.push("");
    };

    $scope.removeAttack = function()
    {
        $scope.character.attacks.splice(-1, 1);
    };

    $scope.addEquipment = function()
    {
        $scope.character.equipment.push("");
    };

    $scope.removeEquipment = function()
    {
        $scope.character.equipment.splice(-1, 1);
    };

    $scope.submit = function()
    {
        console.log("Attempting to delete character");

        var url = 'api/character/delete/' + characterID;
        $http.get(url).success(function(data)
        {
            if (data === "OK")
            {
                window.location = 'profile';
            }
            else
            {
                console.log(data);
            }
        });
    };
});