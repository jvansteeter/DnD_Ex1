'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('campaignController', function($scope, $window, $http, socket, Profile)
{
    $scope.posts = [];

    socket.on('init', function (data)
    {
        var url = "api/posts/all/" + Profile.getCampaign();

        $http.get(url).success(function(data)
        {
            console.log(data);
            $scope.encounters = data.encounters.reverse();
        });
    });

    socket.on('update' + Profile.getCampaign(), function()
    {
        var url = "api/encounter/all";
        var data =
        {
            "username" : $scope.usernameInput,
            "password" : $scope.passwordInput
        };

        $http.get(url, data).success(function(data)
        {
            console.log(data);
            $scope.encounters = data.encounters.reverse();
        });
    });
});