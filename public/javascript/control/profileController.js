'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('profileController', function($scope, $window, $http, socket, Profile) 
{
	$scope.newCampaignModal = {};

	$http.get('api/user/campaigns').success(function(data)
	{
		console.log("Getting campaigns");
		console.log(data);
		$scope.campaigns = data;
	});

	Profile.async().then(function()
	{
		$scope.user = Profile.getUser();
		$scope.name = $scope.user.first_name + " " + $scope.user.last_name;
	});

	socket.on('init', function (data) 
	{
		console.log(data);
	});

	$scope.uploadProfilePhoto = function($flow)
	{
		$flow.upload();
		$flow.files[0] = $flow.files[$flow.files.length - 1];
		console.log($flow);

		var url = 'api/image/profile';
		var fd = new FormData();
		fd.append("file", $flow.files[0].file);
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

	$scope.createNewCampaign = function()
	{
		var url = 'api/campaign/create';
		var data = {
			name: $scope.newCampaignModal.name,
			description: $scope.newCampaignModal.description
		};
		$http.post(url,data).success(function()
		{
			console.log("Campaign successfully created");
		});
	};
});