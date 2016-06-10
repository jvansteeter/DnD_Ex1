var clientApp = angular.module('clientApp');

clientApp.controller('modalController', ['$scope', '$http', '$rootScope', 'Profile', function($scope, $http, $rootScope, Profile) 
{
	$scope.name = '';
	$scope.initiative = '';
	$scope.armorClass = '';
	$scope.hitPoints = '';

	$scope.addCharacter = function()
    {
    	if ($scope.name === '')
    	{
    		return;
    	}
    	else if ($scope.initiative === '' || $scope.initiative < 0 || $scope.initiative > 50)
    	{
    		return;
    	}
    	else if ($scope.armorClass === '' || $scope.armorClass < 1 || $scope.armorClass > 50)
    	{
    		return;
    	}
    	else if ($scope.hitPoints === '' || $scope.hitPoints < 0 || $scope.hitPoints > 1000)
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
	            socket.emit('new:encounterPlayer', 
	            	{
	            		encounterID : encounterID
	            	}, function (){});
	        });
    	}
    };
}]);