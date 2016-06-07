var clientApp = angular.module('clientApp');

clientApp.config(function($modalProvider) 
{
  	angular.extend($modalProvider.defaults, 
  	{
    	html: true
  	});
});

clientApp.controller('ModalDemoCtrl', function($scope, $modal) 
{
  	$scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};

  	// Controller usage example
  	//
  	function MyModalController($scope) 
  	{
    	$scope.title = 'Some Title';
    	$scope.content = 'Hello Modal<br />This is a multiline message from a controller!';
  	}
  	MyModalController.$inject = ['$scope'];
  	var myModal = $modal({controller: MyModalController, templateUrl: 'angularModal.html', show: false});
  	$scope.showModal = function() 
  	{
    	myModal.$promise.then(myModal.show);
  	};
  	$scope.hideModal = function() 
  	{
    	myModal.$promise.then(myModal.hide);
  	};
});