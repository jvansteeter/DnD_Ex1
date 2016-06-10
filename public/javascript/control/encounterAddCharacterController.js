var clientApp = angular.module('clientApp');

clientApp.controller('modalController', ['$scope', '$http', '$rootScope', 'Profile', function($scope, $http, $rootScope, Profile) 
{
	$scope.newCharacter = {};

	$scope.addCharacter = function()
    {
        var socket = io.connect();

        var url = 'api/encounter/addplayer/' + Profile.getEncounter();
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
         //    socket.emit('new:encounterPlayer', 
        	// {
        	// 	encounterID : Profile.getEncounter();
        	// });
        });
    };
}]);