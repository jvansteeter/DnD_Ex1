'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('editNPCController', function($scope, $window, $http)
{
    $scope.npc = {};
    $scope.npc.features = [];
    $scope.npc.specials = [];
    $scope.npc.attacks = [];
    $scope.npc.equipment = [];
    $scope.npc.actions = [];

    var npcID = window.location.search.replace('?', '');
    $http.get('api/npc/' + npcID).success(function(data)
    {
        $scope.npc = data.npc;
    });

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

        var url = 'api/npc/delete/' + npcID;
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