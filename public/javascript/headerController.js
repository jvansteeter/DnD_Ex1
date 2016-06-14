var clientApp = angular.module('clientApp');

clientApp.controller('headerController', function($scope, Profile) 
{
  	$scope.name = Profile.getFirstName;
});