'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('campaignController', function($scope, $window, $http, socket, Profile)
{
    var campaignID = window.location.search.replace('?', '');
    $scope.tooltip = {
        title: "Add tags to post"
    };
    $scope.newPost = {};
    $scope.posts = [];
    $http.get('api/campaign/' + campaignID).success(function(data)
    {
        console.log("I have campaign");
        console.log(data);
        $scope.campaign = data;
    });

    socket.on('init', function (data)
    {
        console.log(data);

        // var url = "api/posts/all/" + Profile.getCampaign();
        //
        // $http.get(url).success(function(data)
        // {
        //     console.log(data);
        //     $scope.encounters = data.encounters.reverse();
        // });
    });

    socket.on('update' + $scope.campaign, function()
    {
        var url = "api/encounter/all";
        $http.get(url, data).success(function(data)
        {
            console.log(data);
            $scope.encounters = data.encounters.reverse();
        });
    });

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
});