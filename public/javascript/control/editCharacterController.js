'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('editCharacterController', function($scope, $window, $http, $alert, $uibModal)
{
    $scope.character = {};
    $scope.character.features = [];
    $scope.character.proficiencies = [];
    $scope.character.languages = [];
    $scope.character.attacks = [];
    $scope.character.equipment = [];

    var uploadImage = false;
    var flow;
    var modal;

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
        var url = 'api/character/update';
        var data =
        {
            character: $scope.character
        };
        $http.post(url, data).success(function(data)
        {
            if (uploadImage)
            {
                flow.upload();
                flow.files[0] = flow.files[flow.files.length - 1];

                var url = 'api/character/icon/' + $scope.character._id;
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

    $scope.deleteCharacter = function()
    {
        $scope.areYouSureTitle = "Delete Character?";
        modal = $uibModal.open({
            animation: true,
            templateUrl: 'modal/areYouSureModal.html',
            scope: $scope,
            size: ''
        });
    };

    $scope.submit = function()
    {

        var url = 'api/character/delete/' + characterID;
        $http.get(url).success(function(data)
        {
            if (data === "OK")
            {
                window.location = 'profile';
            }
        });
    };
});