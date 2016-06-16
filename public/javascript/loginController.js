var clientApp = angular.module('clientApp');

clientApp.controller('loginControl', function($scope, $window, $http, $location, Profile) 
{
	$scope.usernameInput = "";
	$scope.passwordInput = "";
	$scope.loginInfo;
	
	$scope.login = function()
	{
		console.log("login username=" + $scope.usernameInput);
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

		$http.post(url, data).success(function(data)
		{
			console.log("Login was successful");
			console.log(data);

			Profile.setUsername(data.username);
			Profile.setFirstName(data.first_name);
			Profile.setLastName(data.last_name);
			window.location = 'home.html';
		});
	};

	$scope.register = function()
	{
		if ($scope.usernameInput === "")
		{
			$scope.info = "Username is blank";
			return;
		}
		if ($scope.firstPasswordInput === "" || $scope.secondPasswordInput === "")
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
		var data = 
		{
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
				$scope.loginInfo = "User created";
				var url = "auth/login";
				var data =  
				{
					"username" : $scope.usernameInput,
					"password" : $scope.passwordInput
				};

				$http.post(url, data).success(function(data)
				{
					console.log("Login was successful");
					console.log(data);

					Profile.setUsername(data.username);
					Profile.setFirstName(data.first_name);
					Profile.setLastName(data.last_name);
					window.location = 'home.html';
				});
			}
			else
			{
				$scope.loginInfo = data;
			}
		});
	}
});