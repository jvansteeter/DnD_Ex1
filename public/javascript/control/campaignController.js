'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('campaignController', function($scope, $window, $http, socket, Profile)
{
    var campaignID = window.location.search.replace('?', '');

    Profile.async().then(function()
    {
        var user = Profile.getUser();
        Profile.setUser(user);
        $scope.init();
    });

    socket.on('init', function (data)
    {
        console.log(data);
    });

    socket.on('update' + $scope.campaign, function()
    {
        var url = "api/encounter/all";
        $http.get(url, data).success(function(data)
        {
            console.log(data);
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
        $scope.tooltip = {
            title: "Add tags to post"
        };

        $http.get('api/campaign/' + campaignID).success(function(data)
        {
            console.log("I have campaign");
            console.log(data);
            $scope.campaign = data;

            console.log("init");
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
        });
    };

    $scope.updateEncounters = function()
    {
        var url = "api/encounter/" + $scope.campaign._id;
        $http.get(url).success(function(data)
        {
            $scope.encounters = data.reverse();
        });
    };

    $scope.createNewPost = function()
    {
        console.log("attempting to create new post");

        var url = 'api/campaign/post';
        var data = {
            campaignID: campaignID,
            content: $scope.newPost.content
        };
        $http.post(url, data).success(function(data)
        {
            console.log(data);
            $scope.posts.push({

            });
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
            campaignID: $scope.campaign._id,
            description: $scope.newEncounter.description
        };

        $http.post(url, data).success(function(data)
        {
            console.log("Create new encounter was successful");
            console.log(data);
            $scope.updateEncounters();
            socket.emit('new:encounter');
        });
    };

    $scope.isHost = function()
    {
        if ($scope.campaign)
        {
            return $scope.campaign.hosts.indexOf(Profile.getUserID()) != -1;
        }
        else
        {
            return false;
        }
    };
});