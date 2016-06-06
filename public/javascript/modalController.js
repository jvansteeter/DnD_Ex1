var clientApp = angular.module('clientApp');

clientApp.controller('encounterModalController', function ($scope, $uibModal, $log) 
{
  	$scope.items = ['item1', 'item2', 'item3'];
  	$scope.animationsEnabled = true;

  	$scope.open = function (size) 
  	{
    	var modalInstance = $uibModal.open(
    	{
      		animation: $scope.animationsEnabled,
      		templateUrl: 'myModalContent.html',
      		controller: 'encounterModalInstanceController',
      		size: size,
      		resolve: 
      		{
        		items: function () 
        		{
          			return $scope.items;
        		}
      		}
    	});

    	modalInstance.result.then(function (selectedItem) 
    	{
      		$scope.selected = selectedItem;
    	}, 
    	function () 
    	{
      		$log.info('Modal dismissed at: ' + new Date());
    	});
  	};

  	$scope.toggleAnimation = function () 
  	{
    	$scope.animationsEnabled = !$scope.animationsEnabled;
  	};
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

clientApp.controller('encounterModalInstanceController', function ($scope, $uibModalInstance, items) 
{
  	$scope.items = items;
  	$scope.selected = 
  	{
    	item: $scope.items[0]
  	};

  	$scope.ok = function () 
  	{
    	$uibModalInstance.close($scope.selected.item);
  	};

  	$scope.cancel = function () 
  	{
    	$uibModalInstance.dismiss('cancel');
  	};
});