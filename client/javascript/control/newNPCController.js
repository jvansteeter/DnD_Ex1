'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('newNPCController', function($scope, $window, $http)
{
    var uploadImage = false;
    var flow;

    $scope.npc = {};
    $scope.npc.features = [];
    $scope.npc.specials = [];
    $scope.npc.attacks = [];
    $scope.npc.equipment = [];
    $scope.npc.actions = [];

    $scope.save = function ()
    {
        var url = 'api/npc/create';
        var data =
        {
            npc: $scope.npc
        };
        $http.post(url, data).success(function(npc)
        {
            if (uploadImage)
            {
                flow.upload();
                flow.files[0] = flow.files[flow.files.length - 1];

                var url = 'api/npc/icon/' + npc._id;
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
});