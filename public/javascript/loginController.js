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
		console.log("Attempting to register")
		if ($scope.usernameRegister === "")
		{
			$scope.registerInfo = "Username is blank";
			return;
		}
		if ($scope.firstPasswordRegister === "" || $scope.secondPasswordInput === "")
		{
			$scope.registerInfo = "Password is blank";
			return;
		}
		if ($scope.firstPasswordRegister !== $scope.secondPasswordInput)
		{
			$scope.registerInfo = "Passwords do not match";
			return;
		}
		if ($scope.firstNameRegister === "" || $scope.lastNameInput === "")
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
		console.log(data);
		$http.post(url, data).success(function(data)
		{
			console.log(data);
			if(data === "OK")
			{
				$scope.registerInfo = "User created";
				var url = "auth/login";
				var data =  
				{
					"username" : $scope.usernameRegister,
					"password" : $scope.passwordRegister
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
				$scope.registerInfo = data;
			}
		});
	}
});