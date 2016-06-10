var clientApp = angular.module('clientApp');

clientApp.controller('modalController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) 
{
	$scope.characterName = '';
	$scope.initiative = 0;
	$scope.armorClass = 0;

	$scope.addCharacter = function()
	{
		console.log($scope.characterName);
		console.log($scope.initiative);
		console.log($scope.armorClass);
		console.log($scope.hitPoints);

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