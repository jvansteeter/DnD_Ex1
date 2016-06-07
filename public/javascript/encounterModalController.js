var clientApp = angular.module('clientApp');

clientApp.config(function($modalProvider) 
{
  	angular.extend($modalProvider.defaults, 
  	{
    	html: true
  	});
})

clientApp.controller('modalController', function($scope, $modal, $http) 
{
  	$scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};

  	// Controller usage example
  	//
  	function MyModalController($scope) 
  	{
    	$scope.title = 'New Encounter';
    	$scope.info = '';
  	}

  	MyModalController.$inject = ['$scope'];
  	var myModal = $modal({controller: MyModalController, templateUrl: 'newEncounterModal.html', show: false});

  	$scope.createNewEncounter = function()
  	{
  		console.log("---!!! Attempting to create new encounter !!!---");

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

  		var url = "api/encounter/create";
		var data =  
			{
	          	"test" : "test"
        	};

		$http.post(url, data).success(function(data)
		{
			console.log("Create new encounter was successful");
			console.log(data);
		});
  		myModal.$promise.then(myModal.hide);
  	};

  	$scope.showModal = function() 
  	{
    	myModal.$promise.then(myModal.show);
  	};

  	$scope.hideModal = function() 
  	{
    	myModal.$promise.then(myModal.hide);
  	};
});