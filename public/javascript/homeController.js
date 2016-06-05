'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('homeController', function($scope, $window, $http, socket) 
{
	console.log("---!!! In home controller !!!---");
  	var posts = [];

	socket.on('init', function (data) 
  	{
  		console.log("Initializing socket io " + data);
    	var post1 = 
    	{ // TODO get this info from database
		    title: "Welcome to the CS201R Blog",
		    body: "Please feel free to check our new blog website.  Everything should be pretty straight forward.  You are currently on the homepage which displays all posts that have been posted to our server.  Unfortunately they currently are listed from oldest to newest, so any new posts you make will be shown at the bottom.",
		    date: "31 October 2015",
		    author: "System",
		    tags: [
		      "test",
		      "stuff",
		      "blogs",
		      "cats"
		    ]
		};
		posts.push(post1);
		$scope.posts = posts;
  	});

	var url = "api/user";
	console.log(url);
	$http.get(url).success(function(data)
	{
		console.log(data);
	});
	//$scope.posts.reverse();
});