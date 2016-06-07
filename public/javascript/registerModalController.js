var clientApp = angular.module('clientApp');

clientApp.config(function($modalProvider) 
{
  	angular.extend($modalProvider.defaults, 
  	{
    	html: true
  	});
})

clientApp.controller('modalController', function($scope, $modal, $http, $window) 
{
  	$scope.modal = {title: 'Title'};//, content: 'Hello Modal<br />This is a multiline message!'};

  	// Controller usage example
  	//
  	function MyModalController($scope) 
  	{
  		$scope.title = 'Register New User';
    	$scope.info = '';
  	}

  	MyModalController.$inject = ['$scope'];
  	var myModal = $modal({controller: MyModalController, templateUrl: 'registerUserModal.html', show: false});

  	$scope.register = function()
    {
      	if ($scope.usernameInput === "")
      	{
        	$scope.info = "Username is blank";
       	 	return;
      	}
      	if ($scope.firstPasswordInput === "" || $scope.secondPasswordInput)
      	{
        	$scope.info = "Password is blank";
        	return;
      	}
      	if ($scope.firstPasswordInput !== $scope.secondPasswordInput)
      	{
      		$scope.info = "Passwords do not match";
      		return;
      	}
      	if ($scope.firstNameInput === "" || $scope.lastNameInput === "")
      	{
      		$scope.info = "Please fill out first and last name";
      		return;
      	}

      	var url = "auth/register";
      	var data = {
          	"username" : $scope.usernameInput,
          	"password" : $scope.firstPasswordInput,
          	"firstname" : $scope.firstNameInput,
          	"lastname" : $scope.lastNameInput,
          	"authCode" : $scope.authCode
      	};
      	$http.post(url, data).success(function(data)
      	{
          	if(data === "OK")
          	{
              	$scope.info = "User created";
              	$http.post('auth/login', {username: usernameInput, password: firstPasswordInput}).success(function(data)
              	{
              		window.location = 'home.html';
              	});
          	}
          	else
          	{
              	$scope.info = data;
          	}
      	});
    }

  	$scope.showModal = function() 
  	{
    	myModal.$promise.then(myModal.show);
  	};

  	$scope.hideModal = function() 
  	{
    	myModal.$promise.then(myModal.hide);
  	};
});