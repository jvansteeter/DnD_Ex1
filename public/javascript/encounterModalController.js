var clientApp = angular.module('clientApp');

clientApp.config(function($modalProvider) 
{
  	angular.extend($modalProvider.defaults, 
  	{
    	html: true
  	});
})

clientApp.controller('ModalDemoCtrl', function($scope, $modal) 
{
  	$scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};

  	// Controller usage example
  	//
  	function MyModalController($scope) 
  	{
    	$scope.title = 'New Encounter';
  	}
  	
  	MyModalController.$inject = ['$scope'];
  	var myModal = $modal({controller: MyModalController, templateUrl: 'newEncounterModal.html', show: false});

  	$scope.showModal = function() 
  	{
    	myModal.$promise.then(myModal.show);
  	};

  	$scope.hideModal = function() 
  	{
    	myModal.$promise.then(myModal.hide);
  	};
});