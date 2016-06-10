var clientApp = angular.module('clientApp');

clientApp.controller('modalController', ['$scope', '$http', '$rootScope', 'Profile', function($scope, $http, $rootScope, Profile) 
{
	$scope.newCharacter = {};

	$scope.addCharacter = function()
    {
        console.log($scope.newCharacter.name);
        console.log($scope.newCharacter.initiative);
        console.log($scope.newCharacter.armorClass);
        console.log($scope.newCharacter.hitPoints);

        var data =
        {
            name : $scope.newCharacter.name,
            initiative : $scope.newCharacter.initiative,
            armorClass : $scope.newCharacter.armorClass,
            maxHitPoints : $scope.newCharacter.hitPoints,
            hitPoints : $scope.newCharacter.hitPoints
        };
        console.log(Profile.getEncounter());
        var url = 'api/encounter/addplayer/' + Profile.getEncounter();
        $http.post(url, data).success(function(data)
        {
            console.log(data);
            $scope.newCharacter.name = '';
            $scope.newCharacter.initiative = '';
            $scope.newCharacter.armorClass = '';
            $scope.newCharacter.hitPoints = '';
            console.log("Player successfully added");
        });

        /*var socket = io.connect();

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
            socket.emit('new:encounter');
        });*/
    };
}]);