var clientApp = angular.module('clientApp');

clientApp.controller('modalController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) 
{
	$scope.character = {};

	$scope.addCharacter = function()
	{
		console.log($scope.character.name);
		console.log($scope.character.initiative);
		console.log($scope.character.armorClass);
		console.log($scope.character.hitPoints);

		var data =
		{
			name : $scope.character.name,
			initiative : $scope.character.initiative,
			armorClass : $scope.character.armorClass,
			maxHitPoints : $scope.character.hitPoints,
			hitPoints : $scope.character.hitPoints
		};
		url = 'api/encounter/addplayer/' +

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