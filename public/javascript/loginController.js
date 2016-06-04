var clientApp = angular.module('clientApp');

clientApp.controller('loginControl', function($scope, $window, $http, $location) 
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

        window.location = 'home.html';
      });
    };

    $scope.register = function()
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

      var url = "auth/register";
      var data = {
          "username" : $scope.usernameInput,
          "password" : $scope.passwordInput
      };
      $http.post(url, data).success(function(data)
      {
          if(data === "OK")
          {
              $scope.loginInfo = "User created";
          }
          else
              $scope.loginInfo = data;
      });
    } 
});