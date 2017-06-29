'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('newCharacterController', function($scope, $window, $http, $alert)
{
    $scope.character = {};
    $scope.character.features = [];
    $scope.character.proficiencies = [];
    $scope.character.languages = [];
    $scope.character.actions = [];
    $scope.character.equipment = [];
    
    $scope.classes = [];
    $scope.levels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    $scope.dndLanguages = 
        [
            'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
            'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
        ];

    var uploadImage = false;
    var flow;
    
    $http.get('api/class/all').success(function(data)
    {
        $scope.classes = data.classes;
    });

    $scope.save = function ()
    {
        var url = 'api/character/create';
        var data =
        {
            character: $scope.character
        };
        $http.post(url, data).success(function(character)
        {
            if (uploadImage)
            {
                flow.upload();
                flow.files[0] = flow.files[flow.files.length - 1];

                var url = 'api/character/icon/' + character._id;
                var fd = new FormData();
                fd.append("file", flow.files[0].file);
                $http.post(url, fd, {
                    withCredentials: false,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function(data)
                {
                    window.location = 'profile';
                }).error(function(data)
                {
                    $scope.errorMessage = data;
                    $('#errorAlert').fadeIn();
                });
            }
            else
            {
                window.location = 'profile';
            }
        });
    };

    $scope.uploadCharacterIcon = function($flow)
    {
        uploadImage = true;
        flow = $flow;
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

    $scope.addAction = function()
    {
        $scope.character.actions.push("");
    };
    
    $scope.removeActions = function()
    {
        $scope.character.actions.splice(-1, 1);
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