'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('homeController', function($scope, $window, $http, socket)
{
    socket.on('init', function (data)
    {

        var url = "api/campaign/all";
        $http.get(url).success(function(data)
        {
            $scope.campaigns = data.reverse();
        });
    });

    socket.on('new:campaign', function()
    {
        var url = "api/campaign/all";
        $http.get(url).success(function(data)
        {
            $scope.encounters = data.reverse();
        });
    });

    $scope.joinCampaign = function(campaignID)
    {
        var url = 'api/campaign/join';
        var data = {
            campaignID: campaignID
        };
        $http.post(url, data).success(function(data)
        {
            window.location = "campaign?" + campaignID;
        });
    };
});