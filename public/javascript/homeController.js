'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('homeController', function($scope, $window, $http, socket) 
{
	$scope.newEncounterTitle = '';
	$scope.newEncounterDescription = '';
	
  	var posts = [];

	socket.on('init', function (data) 
  	{
  		console.log(data);
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

  	$scope.createNewEncounter = function()
  	{
  		if ($scope.newEncounterTitle === "")
  		{
  			$scope.info = "Title is blank";
  			return;
  		}

  		if ($scope.newEncounterDescription === "")
  		{
  			$scope.info = "Description is blank";
  			return;
  		}

  		var url = "api/encounter/create";
		var data =  
			{
	          	title : $scope.newEncounterTitle,
	          	description : $scope.newEncounterDescription
        	};

		$http.post(url, data).success(function(data)
		{
			console.log("---!!! Create new encounter was successful !!!---");
			console.log(data);
			socket.emit('new:encounter',
			{
				id : data.id;
			});
		});
  	};

	/*var url = "api/user";
	console.log(url);
	$http.get(url).success(function(data)
	{
		console.log(data);
	});*/
	//$scope.posts.reverse();
});