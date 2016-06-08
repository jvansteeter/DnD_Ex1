var clientApp = angular.module('clientApp');

clientApp.config(function($modalProvider) 
{
  	angular.extend($modalProvider.defaults, 
  	{
    	html: true
  	});
})

clientApp.controller('modalController', ['$scope', '$modal', '$http', '$rootScope', function($scope, $modal, $http, $rootScope) 
{
  	$scope.newEncounterTitle = '';
	$scope.newEncounterDescription = '';

  	function MyModalController($scope) 
  	{}

  	MyModalController.$inject = ['$scope'];
  	var myModal = $modal({controller: MyModalController, templateUrl: 'newEncounterModal.html', show: false});

  	$scope.createNewEncounter = function()
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
		});

		socket.emit('new:encounter',
		{
			//id : data._id
		}, function () 
  		{
    		/*var args = arguments;
    		$rootScope.$apply(function () 
    		{
      			if (callback) 
      			{
        			callback.apply(socket, args);
      			}
    		});*/
  		});

		console.log("So I am out of the post");
  	};

  	$scope.showModal = function() 
  	{
    	myModal.$promise.then(myModal.show);
  	};

  	$scope.hideModal = function() 
  	{
    	myModal.$promise.then(myModal.hide);
  	};
}]);