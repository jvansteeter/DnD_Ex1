'use strict';

var clientApp = angular.module('clientApp');

clientApp.controller('profileController', function($scope, $window, $uibModal, $http, socket, Profile)
{
	var modal;

	$scope.newCampaignModal = {};

	$http.get('api/user/campaigns').success(function(data)
	{
		$scope.campaigns = data;
	});

	Profile.async().then(function()
	{
		$scope.user = Profile.getUser();
		$scope.name = $scope.user.first_name + " " + $scope.user.last_name;
        $http.get('api/character/all/' + Profile.getUserId()).success(function(data)
        {
            $scope.characters = data.characters;
        });
	});

	socket.on('init', function (data) 
	{
	});

	$scope.uploadProfilePhoto = function($flow)
	{
		$flow.upload();
		$flow.files[0] = $flow.files[$flow.files.length - 1];

		var url = 'api/image/profile';
		var fd = new FormData();
		fd.append("file", $flow.files[0].file);
		$http.post(url, fd, {
			withCredentials : false,
			headers : {
				'Content-Type' : undefined
			},
			transformRequest : angular.identity
		});
	};

	$scope.editCharacter = function()
	{
		modal = $uibModal.open({
			animation: true,
			templateUrl: 'modal/listCharactersModal.html',
			scope: $scope,
			size: ''
		});
	};

	$scope.editNPC = function()
	{
		modal = $uibModal.open({
			animation: true,
			templateUrl: 'modal/profileListNPCModal.html',
			scope: $scope,
			size: ''
		});
	};

	$scope.getModalCharacters = function()
	{
		return $scope.characters;
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
			title: $scope.newCampaignModal.title,
			description: $scope.newCampaignModal.description
		};
		$http.post(url,data).success(function(){});
	};
});