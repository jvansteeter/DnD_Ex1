var clientApp = angular.module('clientApp');

clientApp.controller('modalController', ['$scope', '$http', '$rootScope', 'Profile', function($scope, $http, $rootScope, Profile) 
{
	$scope.newCharacter = {};

	$scope.addCharacter = function()
    {
    	if ($scope.newCharacter.name === '')
    	{
    		return;
    	}
    	else if ($scope.newCharacter.initiative === '' || $scope.newCharacter.initiative < 0 || $scope.newCharacter.initiative > 50)
    	{
    		return;
    	}
    	else if ($scope.newCharacter.armorClass === '' || $scope.newCharacter.armorClass < 1 || $scope.newCharacter.armorClass > 50)
    	{
    		return;
    	}
    	else if ($scope.newCharacter.hitPoints === '' || $scope.newCharacter.hitPoints < 0 || $scope.newCharacter.hitPoints > 1000)
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
	            name : $scope.newCharacter.name,
	            initiative : $scope.newCharacter.initiative,
	            armorClass : $scope.newCharacter.armorClass,
	            maxHitPoints : $scope.newCharacter.hitPoints,
	            hitPoints : $scope.newCharacter.hitPoints
	        };

	        $http.post(url, data).success(function(data)
	        {
	            console.log(data);
	            $scope.newCharacter.name = '';
	            $scope.newCharacter.initiative = '';
	            $scope.newCharacter.armorClass = '';
	            $scope.newCharacter.hitPoints = '';
	            console.log("Player successfully added");
	            socket.emit('new:encounterPlayer', 
	            	{
	            		encounterID : encounterID
	            	}, function (){});
	        });
    	}
    };
}]);