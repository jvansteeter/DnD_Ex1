var clientApp = angular.module('clientApp');

clientApp.controller('headerControl', function($scope) 
{
  var userName = "Cole"; // TODO get user.name from database
  $scope.title = userName + "'s Blog";
});