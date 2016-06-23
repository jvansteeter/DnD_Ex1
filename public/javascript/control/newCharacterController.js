'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('newCharacterController', function($scope, $window, $http, $alert)
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

    $scope.save = function ()
    {
        console.log("Saving");
        console.log($scope.character);

        var url = 'api/character/create';
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
                window.location = 'profile.html';
            }
            else
            {
                $alert({title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info', keyboard: true, show: false});
            }
        });
    };

    $scope.cancel = function()
    {
        var alert = $alert({title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info', keyboard: true, show: false});
        alert.show();
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
    
});