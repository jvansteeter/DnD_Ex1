var clientApp = angular.module('clientApp');

clientApp.controller('loginControl', function($scope, $window, $http, Credentials) 
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

      var url = "users/login";
      console.log(url);
      var data =  {
                  "username" : $scope.usernameInput,
                  "password" : $scope.passwordInput
                };

      $http.post(url, data).success(function(data)
      {
        console.log("Login was successful");
        console.log(data);

        if(data.length === 0)
        {
          $scope.loginInfo = "Server Error";
        }
        else if(data === "Invalid Username")
        {
          $scope.loginInfo = data;
        }
        else if(data === "true")
        {
          Credentials.setUsername($scope.usernameInput);
          Credentials.setPassword($scope.passwordInput);
          $window.location.href = "index.html";
        }
        else if(data === "false")
        {
          $scope.loginInfo = "Invalid Password";
        }
        else
        {
          $scope.loginInfo = "Unknown Error";
        }
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