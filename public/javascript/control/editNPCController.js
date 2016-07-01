'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('editNPCController', function($scope, $window, $http, Profile)
{
    $scope.npc = {};
    $scope.npc.features = [];
    $scope.npc.specials = [];
    $scope.npc.attacks = [];
    $scope.npc.equipment = [];
    $scope.npc.actions = [];

    $scope.save = function ()
    {
        console.log("Saving");
        console.log($scope.npc);

        var url = 'api/npc/update';
        var data =
        {
            npc: $scope.npc
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
                $scope.errorMessage = data;
                $('#errorAlert').fadeIn();
            }
        });
    };

    $scope.cancel = function()
    {
        window.location = 'profile.html';
    };

    $scope.addFeature = function()
    {
        $scope.npc.features.push("");
    };

    $scope.removeFeature = function()
    {
        $scope.npc.features.splice(-1, 1);
    };

    $scope.addSpecial = function()
    {
        $scope.npc.specials.push("");
    };

    $scope.removeSpecial = function()
    {
        $scope.npc.specials.splice(-1, 1);
    };

    $scope.addAttack = function()
    {
        $scope.npc.attacks.push("");
    };

    $scope.removeAttack = function()
    {
        $scope.npc.attacks.splice(-1, 1);
    };

    $scope.addEquipment = function()
    {
        $scope.npc.equipment.push("");
    };

    $scope.removeEquipment = function()
    {
        $scope.npc.equipment.splice(-1, 1);
    };

    $scope.addAction = function()
    {
        $scope.npc.actions.push("");
    };

    $scope.removeAction = function()
    {
        $scope.npc.actions.splice(-1, 1);
    };

    $scope.submit = function()
    {
        console.log("Attempting to delete character");

        var url = 'api/npc/delete/' + characterID;
        $http.get(url).success(function(data)
        {
            if (data === "OK")
            {
                window.location = 'profile.html';
            }
            else
            {
                console.log(data);
            }
        });
    };
});