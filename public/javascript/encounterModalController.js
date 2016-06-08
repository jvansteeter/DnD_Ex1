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
  	$scope.modal = 
  	{
  		title: '', 
  		info: '',
  		newEncounterTitle: '',
  		newEncounterDescription: ''
  	};
  	$scope.newEncounterTitle = '';
	$scope.newEncounterDescription = '';

  	// Controller usage example
  	//
  	function MyModalController($scope) 
  	{}

  	MyModalController.$inject = ['$scope'];
  	var myModal = $modal({controller: MyModalController, templateUrl: 'newEncounterModal.html', show: false});

  	$scope.createNewEncounter = function()
  	{
  		console.log("---!!! Attempting to create new encounter !!!---");
  		console.log("Title : " + $scope.newEncounterTitle);
  		console.log("Description : " + $scope.newEncounterDescription);

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
	          	title : $scope.newEncounterTitle,
	          	description : $scope.newEncounterDescription
        	};

		$http.post(url, data).success(function(data)
		{
			console.log("---!!! Create new encounter was successful !!!---");
			console.log(data);
  			return $scope.hideModal();
		});
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