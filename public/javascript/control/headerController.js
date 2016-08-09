var clientApp = angular.module('clientApp');

clientApp.controller('headerController', function($scope, Profile)
{
	Profile.async().then(function()
	{
		$scope.user = Profile.getUser();
		$scope.name = $scope.user.first_name;
	});
});