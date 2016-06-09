var clientApp = angular.module('clientApp');

clientApp.controller('modalController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) 
{
	$scope.newEncounterTitle = '';
	$scope.newEncounterDescription = '';

	$scope.addNewCharacter = function()
	{
		if ($scope.newEncounterTitle === "")
		{
			$scope.info = "Title is blank";
			return;
		}

		if ($scope.newEncounterDescription === "")
		{
			$scope.info = "Description is blank";
			return;
		}

		var socket = io.connect();

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
		});
	};
}]);