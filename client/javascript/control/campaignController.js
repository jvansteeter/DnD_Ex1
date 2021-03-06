'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('campaignController', function($scope, $window, $http, socket, Profile)
{
    var campaignID = window.location.search.replace('?', '');

    Profile.async().then(function()
    {
        $scope.init();
    });

    socket.on('init', function (data)
    {

    });

    socket.on('update' + $scope.campaign, function()
    {
        var url = "api/encounter/all";
        $http.get(url, data).success(function(data)
        {
            $scope.encounters = data.reverse();
        });
    });

    socket.on('new:encounter', function()
    {
        $scope.updateEncounters();
    });

    $scope.init = function()
    {
        $scope.newEncounter = {};
        $scope.newEncounter.title = "";
        $scope.newEncounter.description = "";
        $scope.newPost = {};
        $scope.newPost.content = "";
        $scope.tooltip = {
            title: "Add tags to post"
        };

        $http.get('api/campaign/' + campaignID).success(function(data)
        {
            $scope.campaign = data;

            if ($scope.isHost())
            {
                $scope.encounterMenu = "col col-xs-3";
                $scope.encounterMain = "col col-xs-9";
            }
            else
            {
                $scope.encounterMenu = "hidden";
                $scope.encounterMain = "col col-xs-12";
            }

            $scope.updateEncounters();
            $scope.updatePosts();
        });

        $http.get('api/campaign/adventurers/' + campaignID).success(function(data)
        {
            $scope.adventurers = data;
        });
    };

    $scope.updateEncounters = function()
    {
        var url = "api/campaign/encounter/" + $scope.campaign._id;
        $http.get(url).success(function(data)
        {
            $scope.encounters = data.reverse();
        });
    };

    $scope.updatePosts = function()
    {
        var url = 'api/campaign/posts/' + campaignID;
        $http.get(url).success(function(data)
        {
            $scope.posts = data.reverse();
        });
    };

    $scope.createNewPost = function()
    {
        var url = 'api/campaign/post';
        var data = {
            campaignId: campaignID,
            content: $scope.newPost.content
        };
        $http.post(url, data).success(function(data)
        {
            $scope.updatePosts();
        });
    };

    $scope.createNewEncounter = function()
    {
        if ($scope.newEncounterTitle === "")
        {
            $scope.info = "Title is blank";
            return;
        }

        var url = "api/encounter/create";
        var data =
        {
            title: $scope.newEncounter.title,
            campaignId: $scope.campaign._id,
            description: $scope.newEncounter.description
        };

        $http.post(url, data).success(function(data)
        {
            $scope.updateEncounters();
            socket.emit('new:encounter');
        });
    };

    $scope.isHost = function()
    {
        if ($scope.campaign)
        {
            return $scope.campaign.hosts.indexOf(Profile.getUserId()) != -1;
        }
        else
        {
            return false;
        }
    };
});