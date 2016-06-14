var clientApp = angular.module('clientApp');

clientApp.controller('modalController', ['$scope', '$http', '$rootScope', 'Profile', function($scope, $http, $rootScope, Profile) 
{
	$scope.name = '';
	$scope.initiative = '';
	$scope.armorClass = '';
	$scope.hitPoints = '';

	$scope.addCharacter = function()
    {
    	console.log("Attempting to add character");
    	if ($scope.name === '')
    	{
    		return;
    	}
    	else if ($scope.initiative === '' || $scope.initiative < 0 || $scope.initiative > 50 || isNaN($scope.initiative))
    	{
    		return;
    	}
    	else if ($scope.armorClass === '' || $scope.armorClass < 1 || $scope.armorClass > 50 || isNaN($scope.armorClass))
    	{
    		return;
    	}
    	else if ($scope.hitPoints === '' || $scope.hitPoints < 0 || $scope.hitPoints > 1000 || isNaN($scope.hitPoints))
    	{
    		return;
    	}
    	else
    	{
	        var socket = io.connect();
	        var encounterID = Profile.getEncounter();

	        var url = 'api/encounter/addplayer/' + encounterID;
	        var data =
	        {
	            name : $scope.name,
	            initiative : $scope.initiative,
	            armorClass : $scope.armorClass,
	            maxHitPoints : $scope.hitPoints,
	            hitPoints : $scope.hitPoints
	        };

	        $http.post(url, data).success(function(data)
	        {
	            console.log(data);
	            $scope.name = '';
	            $scope.initiative = '';
	            $scope.armorClass = '';
	            $scope.hitPoints = '';
	            console.log("Player successfully added");
	            socket.emit('update:encounter', 
	            	{
	            		encounterID : encounterID
	            	}, function (){});
	        });
    	}
    };

    $scope.addNPC = function()
    {
    	console.log("Attempting to add NPC");
    	if ($scope.name === '')
    	{
    		return;
    	}
    	else if ($scope.initiative === '' || $scope.initiative < 0 || $scope.initiative > 50 || isNaN($scope.initiative))
    	{
    		return;
    	}
    	else if ($scope.hitPoints === '' || $scope.hitPoints < 0 || $scope.hitPoints > 1000 || isNaN($scope.hitPoints))
    	{
    		return;
    	}
    	else
    	{
	        var socket = io.connect();
	        var encounterID = Profile.getEncounter();

	        var url = 'api/encounter/addnpc/' + encounterID;
	        var data =
	        {
	            name : $scope.name,
	            initiative : $scope.initiative,
	            maxHitPoints : $scope.hitPoints,
	            hitPoints : $scope.hitPoints
	        };

	        $http.post(url, data).success(function(data)
	        {
	            console.log(data);
	            $scope.name = '';
	            $scope.initiative = '';
	            $scope.hitPoints = '';
	            console.log("Player successfully added");
	            socket.emit('update:encounter', 
	            	{
	            		encounterID : encounterID
	            	}, function (){});
	        });
    	}
    };
}]);