var clientApp = angular.module('clientApp');

clientApp.controller('loginControl', function($scope, $window, $http, Profile)
{
	$scope.usernameInput = "";
	$scope.passwordInput = "";
	$scope.loginInfo;

	$scope.usernameRegister = "";
	$scope.firstPasswordRegister = "";
	$scope.secondPasswordRegister = "";
	$scope.firstNameRegister = "";
	$scope.lastNameRegister = "";
	$scope.authCodeRegister = "";
	
	$scope.login = function()
	{
		if ($scope.usernameInput === "")
		{
			$scope.loginInfo = "Username is blank";
			return;
		}

		if ($scope.passwordInput === "")
		{
			$scope.loginInfo = "Password is blank";
			return;
		}

		var url = "auth/login";
		var data =  {
					"username" : $scope.usernameInput,
					"password" : $scope.passwordInput
				};

		$http.post(url, data).then(function(response)
		{
			window.location = 'profile';
		}, function(response)
		{
			if (response.status === 401)
			{
				$scope.alertMessage = "Invalid Username or Password";
				$('#errorAlert').fadeIn();
			}
		});
	};

	$scope.register = function()
	{
		if ($scope.usernameRegister === "")
		{
			$scope.registerInfo = "Username is blank";
			return;
		}
		if ($scope.firstPasswordRegister === "" || $scope.secondPasswordRegister === "")
		{
			$scope.registerInfo = "Password is blank";
			return;
		}
		if ($scope.firstPasswordRegister !== $scope.secondPasswordRegister)
		{
			$scope.registerInfo = "Passwords do not match";
			return;
		}
		if ($scope.firstNameRegister === "" || $scope.lastNameRegister === "")
		{
			$scope.registerInfo = "Please fill out first and last name";
			return;
		}

		var url = "auth/register";
		var data = 
		{
			"username" : $scope.usernameRegister,
			"password" : $scope.firstPasswordRegister,
			"firstname" : $scope.firstNameRegister,
			"lastname" : $scope.lastNameRegister,
			"authCode" : $scope.authCodeRegister
		};
		$http.post(url, data).success(function(data)
		{
			if(data === "OK")
			{
				$scope.registerInfo = "User created";
				var url = "auth/login";
				var data =  
				{
					"username" : $scope.usernameRegister,
					"password" : $scope.firstPasswordRegister
				};

				$http.post(url, data).success(function(data)
				{
					window.location = 'profile';
				});
			}
			else
			{
				$scope.registerInfo = data;
			}
		});
	}
});