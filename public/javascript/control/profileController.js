'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('profileController', function($scope, $window, $http, socket, Profile) 
{
	var flow;
	$scope.name = Profile.getFirstName() + " " + Profile.getLastName();

	socket.on('init', function (data) 
	{
		console.log(data);
	});

	$scope.initFlow = function($flow)
	{
		flow = $flow;
		var defaultImage = new Image();
		defaultImage.src = "http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image";
		console.log("Initializing flow");
		// var reader = new FileReader();
		// reader.readAsArrayBuffer(defaultImage);
		// $flow.files[0] = reader.result;
		// $flow.files[0] = defaultImage;
	};

	$scope.seeFlow = function()
	{
		console.log(flow);
	};

	$scope.saveNoImage = function()
	{
		var url = 'api/image/no';
		var data = flow.files[0];
		var fd = new FormData();

		fd.append("file", flow.files[0]);

		$http.post(url, fd, {
			headers:
			{
				'Content-Type': undefined
			},
            transformRequest : angular.identity
		}).success(function(data)
		{
			console.log(data);
		});
	};

	$scope.getNoImage = function()
    {
    	$('#myImage').html('<img src="api/image/no">');
        // var url = 'api/image/no';
        //
        // $http.get(url).success(function(data)
        // {
        //     $scope.image = data.Image;
        // });
    };

	$scope.uploadProfilePhoto = function($flow)
	{
		$flow.upload();
		$flow.files[0] = $flow.files[$flow.files.length - 1];
	};

	$scope.uploadImage = function(files)
	{
		var url = 'api/image/no';
		for ( var i = 0; i < files.length; i++)
		{
			var fd = new FormData();
			fd.append("file", files[i]);
			$http.post(url, fd, {
				withCredentials : false,
				headers : {
					'Content-Type' : undefined
				},
				transformRequest : angular.identity
			})
				.success(function(data)
				{
					console.log(data);
				})
				.error(function(data)
				{
					console.log(data);
				});
		}
	};

	$scope.listModalgetCharacters = function()
	{
		var url = 'api/character/all/' + Profile.getUserID();
		$http.get(url).success(function(data)
		{
			console.log(data);
			$scope.characters = data.characters;
		});
	};
	
	$scope.listModalselectCharacter = function(index)
	{
		window.location = 'editCharacter?' + $scope.characters[index]._id;
	};

	$scope.listModalgetNPCs = function()
	{
		var url = 'api/npc/all/';
		$http.get(url).success(function(data)
		{
			console.log(data);
			$scope.npcs = data.npcs;
		});
	};

	$scope.listModalselectNPC = function(index)
	{
		window.location = 'editNPC?' + $scope.npcs[index]._id;
	};
});